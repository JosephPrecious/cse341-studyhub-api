const express = require("express");
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const { ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

const validateObjectId = (id, res) => {
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid group id" });
    return null;
  }

  return new ObjectId(id);
};

const buildGroup = (body) => ({
  name: body.name,
  topic: body.topic,
  meetingTime: body.meetingTime,
  members: body.members
});

const hasRequiredFields = (group) =>
  group.name &&
  group.topic &&
  group.meetingTime &&
  Array.isArray(group.members) &&
  group.members.length > 0;

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Get all study groups
 *     responses:
 *       200:
 *         description: List of study groups
 */
router.get("/", async (req, res) => {
  try {
    const db = mongodb.getDb();
    const groups = await db.collection("studygroups").find().toArray();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     summary: Get one study group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Study group found
 *       404:
 *         description: Study group not found
 */
router.get("/:id", async (req, res) => {
  try {
    const groupId = validateObjectId(req.params.id, res);
    if (!groupId) return;

    const db = mongodb.getDb();
    const group = await db.collection("studygroups").findOne({ _id: groupId });

    if (!group) {
      return res.status(404).json({ message: "Study group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Create a study group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - topic
 *               - meetingTime
 *               - members
 *             properties:
 *               name:
 *                 type: string
 *               topic:
 *                 type: string
 *               meetingTime:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Study group created
 */
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const group = buildGroup(req.body);

    if (!hasRequiredFields(group)) {
      return res.status(400).json({
        message: "Name, topic, meetingTime, and at least one member are required"
      });
    }

    const db = mongodb.getDb();
    const response = await db.collection("studygroups").insertOne(group);
    res.status(201).json({ id: response.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /groups/{id}:
 *   put:
 *     summary: Update a study group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       204:
 *         description: Study group updated
 */
router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const groupId = validateObjectId(req.params.id, res);
    if (!groupId) return;

    const group = buildGroup(req.body);

    if (!hasRequiredFields(group)) {
      return res.status(400).json({
        message: "Name, topic, meetingTime, and at least one member are required"
      });
    }

    const db = mongodb.getDb();
    const response = await db
      .collection("studygroups")
      .replaceOne({ _id: groupId }, group);

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: "Study group not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Delete a study group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const groupId = validateObjectId(req.params.id, res);
    if (!groupId) return;

    const db = mongodb.getDb();
    const response = await db
      .collection("studygroups")
      .deleteOne({ _id: groupId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: "Study group not found" });
    }

    res.status(200).json({ message: "Study group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
