const express = require("express");
const mongodb = require("../data/database");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;
const { ensureAuthenticated } = require("../middleware/auth");

const validateObjectId = (id, res) => {
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid course id" });
    return null;
  }

  return new ObjectId(id);
};

/**
 * @swagger
 * /courses:
 *   get:
 *   tags:
 *     - Courses
 *     summary: Get all courses
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get("/", async (req, res) => {
  try {
    const db = mongodb.getDb();

    const courses = await db
      .collection("courses")
      .find()
      .toArray();

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


/**
 * @swagger
 * /courses:
 *   post:
 *   tags:
 *     - Courses
 *     summary: Create a new course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseName
 *               - instructor
 *               - semester
 *               - credits
 *               - description
 *             properties:
 *               courseName:
 *                 type: string
 *               instructor:
 *                 type: string
 *               semester:
 *                 type: string
 *               credits:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created
 */
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const {
      courseName,
      instructor,
      semester,
      credits,
      description
    } = req.body;

    if (
      !courseName ||
      !instructor ||
      !semester ||
      !credits ||
      !description
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const db = mongodb.getDb();

    const course = {
      courseName,
      instructor,
      semester,
      credits,
      description
    };

    const response = await db
      .collection("courses")
      .insertOne(course);

    res.status(201).json({
      id: response.insertedId
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *   tags:
 *    - Courses
 *     summary: Get a single course
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course found
 *       404:
 *         description: Course not found
 */
router.get("/:id", async (req, res) => {
  try {
    const db = mongodb.getDb();

    const courseId = validateObjectId(req.params.id, res);
    if (!courseId) return;

    const course = await db
      .collection("courses")
      .findOne({ _id: courseId });

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.status(200).json(course);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


/**
 * @swagger
 * /courses/{id}:
 *   put:
 *   tags:
 *     - Courses
 *     summary: Update a course
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
 *             required:
 *               - courseName
 *               - instructor
 *               - semester
 *               - credits
 *               - description
 *             properties:
 *               courseName:
 *                 type: string
 *               instructor:
 *                 type: string
 *               semester:
 *                 type: string
 *               credits:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       204:
 *         description: Course updated
 *       404:
 *         description: Course not found
 */
router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const db = mongodb.getDb();

    const courseId = validateObjectId(req.params.id, res);
    if (!courseId) return;

    const {
      courseName,
      instructor,
      semester,
      credits,
      description
    } = req.body;

    // ✅ VALIDATION
    if (
      !courseName ||
      !instructor ||
      !semester ||
      !credits ||
      !description
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const updatedCourse = {
      courseName,
      instructor,
      semester,
      credits,
      description
    };

    const response = await db
      .collection("courses")
      .replaceOne(
        { _id: courseId },
        updatedCourse
      );

    // if nothing matched
    if (response.matchedCount === 0) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.status(204).send();

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});

 /**
 * @swagger
 * /courses/{id}:
 *   delete:
 *    tags:
 *       - Courses
 *     summary: Delete a course
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */ 
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const db = mongodb.getDb();

    const courseId = validateObjectId(req.params.id, res);
    if (!courseId) return;

    const response = await db
      .collection("courses")
      .deleteOne({ _id: courseId });

    // if nothing was deleted
    if (response.deletedCount === 0) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.status(200).json({
      message: "Course deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;
