function generateInvoiceHTML(data) {
    const itemsHTML = data.items.map(
        item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.quantity * item.price).toFixed(2)}</td>
        </tr>`
    ).join("");

    return `
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { text-align: center; color: #333; }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                border: 1px solid #ccc;
                text-align: left;
                padding: 10px;
            }
            th { background-color: #f5f5f5; }
            .total {
                text-align: right;
                font-weight: bold;
                font-size: 16px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <h1>Factura de Compra</h1>
        <p><strong>Factura #:</strong> ${data.invoiceNumber}</p>
        <p><strong>Fecha:</strong> ${data.date}</p>
        <p><strong>Cliente:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> ${data.customerEmail}</p>

        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>

        <p class="total">Total: $${data.total.toFixed(2)}</p>
    </body>
    </html>
    `;
}

module.exports = { generateInvoiceHTML };
