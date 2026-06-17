const ObjectId = require("mongodb").ObjectId;
const mongodb = require("../data/database");

const validateObjectId = (id, resourceName, res) => {
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ message: `Invalid ${resourceName} id` });
    return null;
  }

  return new ObjectId(id);
};

const createResourceController = ({
  collectionName,
  resourceName,
  buildResource,
  validateResource
}) => {
  const getAll = async (req, res) => {
    try {
      const db = mongodb.getDb();
      const items = await db.collection(collectionName).find().toArray();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  const getById = async (req, res) => {
    try {
      const id = validateObjectId(req.params.id, resourceName, res);
      if (!id) return;

      const db = mongodb.getDb();
      const item = await db.collection(collectionName).findOne({ _id: id });

      if (!item) {
        return res.status(404).json({ message: `${resourceName} not found` });
      }

      return res.status(200).json(item);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };

  const create = async (req, res) => {
    try {
      const item = buildResource(req.body);
      const validationError = validateResource(item);

      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      const db = mongodb.getDb();
      const response = await db.collection(collectionName).insertOne(item);
      return res.status(201).json({ id: response.insertedId });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };

  const update = async (req, res) => {
    try {
      const id = validateObjectId(req.params.id, resourceName, res);
      if (!id) return;

      const item = buildResource(req.body);
      const validationError = validateResource(item);

      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      const db = mongodb.getDb();
      const response = await db
        .collection(collectionName)
        .replaceOne({ _id: id }, item);

      if (response.matchedCount === 0) {
        return res.status(404).json({ message: `${resourceName} not found` });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };

  const remove = async (req, res) => {
    try {
      const id = validateObjectId(req.params.id, resourceName, res);
      if (!id) return;

      const db = mongodb.getDb();
      const response = await db.collection(collectionName).deleteOne({ _id: id });

      if (response.deletedCount === 0) {
        return res.status(404).json({ message: `${resourceName} not found` });
      }

      return res.status(200).json({ message: `${resourceName} deleted successfully` });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };

  return {
    getAll,
    getById,
    create,
    update,
    remove
  };
};

module.exports = createResourceController;
