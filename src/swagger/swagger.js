const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de E-commerce",
      version: "1.0.0",
      description: "Documentación de la API de E-commerce con Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000", // URL del servidor
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: { // 👈 Aquí defines el esquema de seguridad
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [], // 👈 Esto aplica el esquema a todas las rutas por defecto
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Ruta de archivos donde se definen los endpoints
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerDocs };
