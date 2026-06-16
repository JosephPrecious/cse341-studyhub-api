const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "StudyHub API",
    version: "1.0.0",
    description: "StudyHub API Documentation"
  },
  servers: [
    {
      /*url: "http://localhost:3000",*/
      description:"HTTP"
    },
    
    {
      /*url: "https://cse341-studyhub-api.onrender.com",*/
      description:"Render server"
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;