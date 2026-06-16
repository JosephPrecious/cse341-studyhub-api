const express = require("express");
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const router = express.Router();

// TEST ROUTE
router.get("/", (req, res) => {
  res.send("Assignments route working");
});

/**
 * @swagger
 * /assignments:
 *   get:
 *     summary: Get all assignments
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", async (req, res) => {
  try {
    const db = mongodb.getDb();

    const assignments = await db
      .collection("assignments")
      .find()
      .toArray();

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     summary: Get one assignment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
router.get("/:id", async (req, res) => {
  try {
    const db = mongodb.getDb();

    const assignmentId = new ObjectId(req.params.id);

    const assignment = await db
      .collection("assignments")
      .findOne({ _id: assignmentId });

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    res.status(200).json(assignment);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Create assignment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - dueDate
 *               - courseId
 *               - status
 *               - priority
 *               - submissionLink
 *               - notes
 *             properties:
 *               title:
 *                 type: string
 *               dueDate:
 *                 type: string
 *               courseId:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               submissionLink:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      dueDate,
      courseId,
      status,
      priority,
      submissionLink,
      notes
    } = req.body;

    if (
      !title ||
      !dueDate ||
      !courseId ||
      !status ||
      !priority ||
      !submissionLink ||
      !notes
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const db = mongodb.getDb();

    const assignment = {
      title,
      dueDate,
      courseId,
      status,
      priority,
      submissionLink,
      notes
    };

    const response = await db
      .collection("assignments")
      .insertOne(assignment);

    res.status(201).json({
      id: response.insertedId
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /assignments/{id}:
 *   put:
 *     summary: Update assignment
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
 *         description: Updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
router.put("/:id", async (req, res) => {
  try {
    const db = mongodb.getDb();

    const assignmentId = new ObjectId(req.params.id);

    const {
      title,
      dueDate,
      courseId,
      status,
      priority,
      submissionLink,
      notes
    } = req.body;

    if (
      !title ||
      !dueDate ||
      !courseId ||
      !status ||
      !priority ||
      !submissionLink ||
      !notes
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const updatedAssignment = {
      title,
      dueDate,
      courseId,
      status,
      priority,
      submissionLink,
      notes
    };

    const response = await db
      .collection("assignments")
      .replaceOne(
        { _id: assignmentId },
        updatedAssignment
      );

    if (response.matchedCount === 0) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     summary: Delete assignment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const db = mongodb.getDb();

    const assignmentId = new ObjectId(req.params.id);

    const response = await db
      .collection("assignments")
      .deleteOne({ _id: assignmentId });

    if (response.deletedCount === 0) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    res.status(200).json({
      message: "Assignment deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;