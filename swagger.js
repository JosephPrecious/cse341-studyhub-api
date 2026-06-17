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
      url: "http://localhost:3000",
      description: "HTTP"
    },
    {
      url: "https://cse341-studyhub-api-o2rw.onrender.com",
      description: "Render server"
    }
  ],
  tags: [
    { name: "Users", description: "User management endpoints" },
    { name: "Courses", description: "Course management endpoints" },
    { name: "Assignments", description: "Assignment management endpoints" },
    { name: "Groups", description: "Study group endpoints" },
    { name: "Auth", description: "Authentication endpoints" }
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