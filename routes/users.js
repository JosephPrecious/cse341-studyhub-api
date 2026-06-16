const express = require("express");
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const { ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

const validateObjectId = (id, res) => {
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid user id" });
    return null;
  }

  return new ObjectId(id);
};

const buildUser = (body) => ({
  githubId: body.githubId,
  username: body.username,
  email: body.email,
  profileImage: body.profileImage
});

const hasRequiredFields = (user) =>
  user.githubId && user.username && user.email && user.profileImage;

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", async (req, res) => {
  try {
    const db = mongodb.getDb();
    const users = await db.collection("users").find().toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get one user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/:id", async (req, res) => {
  try {
    const userId = validateObjectId(req.params.id, res);
    if (!userId) return;

    const db = mongodb.getDb();
    const user = await db.collection("users").findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - githubId
 *               - username
 *               - email
 *               - profileImage
 *             properties:
 *               githubId:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const user = buildUser(req.body);

    if (!hasRequiredFields(user)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = mongodb.getDb();
    const response = await db.collection("users").insertOne(user);
    res.status(201).json({ id: response.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
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
 *         description: User updated
 */
router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const userId = validateObjectId(req.params.id, res);
    if (!userId) return;

    const user = buildUser(req.body);

    if (!hasRequiredFields(user)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = mongodb.getDb();
    const response = await db
      .collection("users")
      .replaceOne({ _id: userId }, user);

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
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
    const userId = validateObjectId(req.params.id, res);
    if (!userId) return;

    const db = mongodb.getDb();
    const response = await db.collection("users").deleteOne({ _id: userId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
