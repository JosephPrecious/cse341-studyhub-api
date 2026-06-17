const createResourceController = require("./resourceController");
const { buildCourse, validateCourse } = require("../models/course");

module.exports = createResourceController({
  collectionName: "courses",
  resourceName: "Course",
  buildResource: buildCourse,
  validateResource: validateCourse
});
