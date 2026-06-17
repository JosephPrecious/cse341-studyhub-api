const createResourceController = require("./resourceController");
const {
  buildAssignment,
  validateAssignment
} = require("../models/assignment");

module.exports = createResourceController({
  collectionName: "assignments",
  resourceName: "Assignment",
  buildResource: buildAssignment,
  validateResource: validateAssignment
});
