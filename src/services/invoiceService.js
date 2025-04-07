const nodemailer = require("nodemailer");
const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");
require("dotenv").config();

// Transporter con opción para certificados autofirmados
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true, // Usar true para puerto 465 (SSL)
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ✅ Aceptar certificados autofirmados
  },
});

// Crear y enviar factura
const generarYEnviarFactura = async (pedidoId) => {
  const [[pedido]] = await db.query("SELECT * FROM pedido WHERE idPedido = ?", [pedidoId]);
  if (!pedido) throw new Error("Pedido no encontrado");

  const [[usuario]] = await db.query("SELECT * FROM usuario WHERE idUsuario = ?", [pedido.idUsuario]);
  if (!usuario) throw new Error("Usuario no encontrado");

  const [productos] = await db.query(`
    SELECT p.nombre, pp.cantidad, p.precio
    FROM pedido_producto pp
    JOIN producto p ON pp.idProducto = p.idProducto
    WHERE pp.idPedido = ?
  `, [pedidoId]);

  // Generar PDF
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Factura de compra", 14, 20);
  doc.setFontSize(12);
  doc.text(`Número de pedido: ${pedido.idPedido}`, 14, 30);
  doc.text(`Fecha: ${pedido.fecha} ${pedido.hora}`, 14, 36);
  doc.text(`Cliente: ${usuario.nombre}`, 14, 42);
  doc.text(`Correo: ${usuario.correo}`, 14, 48);

  const items = productos.map(p => [
    p.nombre,
    p.cantidad,
    `$${Number(p.precio).toFixed(2)}`,
    `$${(Number(p.precio) * p.cantidad).toFixed(2)}`
  ]);

  doc.autoTable({
    head: [["Producto", "Cantidad", "Precio Unitario", "Subtotal"]],
    body: items,
    startY: 55,
  });

  doc.text(`Total: $${pedido.total}`, 14, doc.lastAutoTable.finalY + 10);

  // Crear ruta temporal
  const fileName = `factura_${pedido.idPedido}.pdf`;
  const filePath = path.join(__dirname, "..", "temp", fileName);

  // Asegura que la carpeta /temp existe
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  doc.save(filePath);

  // Enviar correo
  await transporter.sendMail({
    from: `"Aura Style" <${process.env.MAIL_USER}>`,
    to: usuario.correo,
    subject: "Tu Factura de Compra",
    html: `<p>Hola ${usuario.nombre},</p><p>Gracias por tu compra. Adjuntamos tu factura en PDF.</p>`,
    attachments: [
      {
        filename: fileName,
        path: filePath,
      },
    ],
  });

  // Eliminar archivo temporal
  fs.unlinkSync(filePath);
};

module.exports = { generarYEnviarFactura };