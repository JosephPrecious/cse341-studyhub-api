const createResourceController = require("./resourceController");
const { buildGroup, validateGroup } = require("../models/group");

module.exports = createResourceController({
  collectionName: "studygroups",
  resourceName: "Study group",
  buildResource: buildGroup,
  validateResource: validateGroup
});
