const createResourceController = require("./resourceController");
const { buildUser, validateUser } = require("../models/user");

module.exports = createResourceController({
  collectionName: "users",
  resourceName: "User",
  buildResource: buildUser,
  validateResource: validateUser
});
