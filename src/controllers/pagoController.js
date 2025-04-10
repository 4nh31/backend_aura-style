const { client } = require('../config/paypal');
const paypal = require('@paypal/checkout-server-sdk'); // 🔥 ¡IMPORTANTE! Estaba faltando esta línea
const db = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

class PagoController {
  // Crear una orden de pago con PayPal
  static async crearOrden(req, res) {
    verifyToken(req, res, async () => {
      const { total, idPedido } = req.body;

      if (!total || !idPedido) {
        return res.status(400).json({ error: 'Total y ID del pedido son obligatorios' });
      }

      try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'MXN',
                value: total.toString(),
              },
              reference_id: idPedido.toString(),
            },
          ],
          application_context: {
            return_url: `http://localhost:5173/gracias?pedido=${idPedido}`, // Cambiado a "/gracias" para coincidir con el componente ThankYou en React
            cancel_url: `https://tudominio.com/pagos/cancelado?pedido=${idPedido}`,
          },
        });

        const response = await client().execute(request);

        res.json({
          id: response.result.id,
          status: response.result.status,
          total: response.result.total,
          links: response.result.links,
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Capturar el pago de una orden
  static async capturarPago(req, res) {
    verifyToken(req, res, async () => {
      const { orderID } = req.params;
  
      try {
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});
  
        const response = await client().execute(request);
  
        // Obtener el ID del pedido asociado (reference_id de PayPal)
        const pedidoId = response.result.purchase_units[0].reference_id;
  
        // Actualizar estado del pedido
        await db.query('UPDATE pedido SET estado = ? WHERE idPedido = ?', [
          'Pagado',
          pedidoId,
        ]);
  
        // Obtener el idUsuario de la base de datos asociado al pedido
        const [rows] = await db.query('SELECT idUsuario FROM pedido WHERE idPedido = ?', [pedidoId]);
        const idUsuario = rows[0].idUsuario;
  
        // Obtener el correo del usuario desde la base de datos
        const [usuario] = await db.query('SELECT correo FROM usuario WHERE idUsuario = ?', [idUsuario]);
  
        // Si no existe el usuario, devolver error
        if (!usuario || !usuario[0].correo) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
  
        const correoUsuario = usuario[0].correo;
  
        // ✅ Enviar la factura al correo del usuario
        const { generarYEnviarFactura } = require('../services/invoiceService');
        await generarYEnviarFactura(pedidoId, correoUsuario); // Aquí le pasamos el correo del usuario
  
        res.json({
          message: 'Pago capturado con éxito y factura enviada',
          detalles: response.result,
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }
}

module.exports = PagoController;