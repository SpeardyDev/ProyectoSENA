const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Metadata acerca de nuestra API
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title:
        "Documentación de la API: Sistema de gestión de inventario para la empresa Marflex",
      version: "1.0.0",
      description:
        "Estas API's manejarán el sistema de gestión de inventario para la empresa Marflex",
      contact: {
        name: "Grupo de proyecto",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["../backend/routes/*.js"],
};

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Dcoumentacion en formato JSON
const swaggerSpec = swaggerJsDoc(swaggerOptions);

const swaggerDocs = (app, port) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "aplication/json");
    res.send(swaggerSpec);
  });

  console.log(
    `Documentación versión 1 está disponible en http://localhost:${port}/api/docs`
  );
};

module.exports = { swaggerUi, swaggerDocs };