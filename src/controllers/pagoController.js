const { client } = require('../config/paypal');
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
        request.requestBody({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: total.toString(),
              },
              reference_id: idPedido.toString(),
            },
          ],
        });

        const response = await client().execute(request);
        res.json({ id: response.result.id });
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
        const response = await client().execute(request);

        // Actualizar el estado del pedido en la base de datos
        await db.query('UPDATE Pedido SET estado = ? WHERE idPedido = ?', [
          'Pagado',
          response.result.purchase_units[0].reference_id,
        ]);

        res.json({ message: 'Pago capturado con éxito', detalles: response.result });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }
}

module.exports = PagoController;