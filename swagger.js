const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "StudyHub API",
    version: "1.0.0",
    description: "StudyHub API Documentation"
  },
  tags: [
    { name: "Authentication", description: "GitHub OAuth and session routes" },
    { name: "Users", description: "User account resources" },
    { name: "Courses", description: "Course resources" },
    { name: "Assignments", description: "Assignment resources" },
    { name: "Study Groups", description: "Study group resources" }
  ],
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local server"
    },
    {
      url: "https://cse341-studyhub-api-o2rw.onrender.com",
      description: "Render server"
    }
  ],
  components: {
    securitySchemes: {
      sessionAuth: {
        type: "apiKey",
        in: "cookie",
        name: "connect.sid"
      }
    },
    parameters: {
      Id: {
        in: "path",
        name: "id",
        required: true,
        schema: {
          type: "string"
        }
      }
    },
    schemas: {
      UserInput: {
        type: "object",
        required: ["githubId", "username", "email", "profileImage"],
        properties: {
          githubId: { type: "string" },
          username: { type: "string" },
          email: { type: "string" },
          profileImage: { type: "string" }
        }
      },
      CourseInput: {
        type: "object",
        required: [
          "courseName",
          "instructor",
          "semester",
          "credits",
          "description"
        ],
        properties: {
          courseName: { type: "string" },
          instructor: { type: "string" },
          semester: { type: "string" },
          credits: { type: "number" },
          description: { type: "string" }
        }
      },
      AssignmentInput: {
        type: "object",
        required: [
          "title",
          "dueDate",
          "courseId",
          "status",
          "priority",
          "submissionLink",
          "notes"
        ],
        properties: {
          title: { type: "string" },
          dueDate: { type: "string", format: "date-time" },
          courseId: { type: "string" },
          status: { type: "string" },
          priority: { type: "string" },
          submissionLink: { type: "string" },
          notes: { type: "string" }
        }
      },
      StudyGroupInput: {
        type: "object",
        required: ["name", "topic", "meetingTime", "members"],
        properties: {
          name: { type: "string" },
          topic: { type: "string" },
          meetingTime: { type: "string", format: "date-time" },
          members: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;
