const express = require("express");
const mongodb = require("../data/database");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;

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

router.post("/", async (req, res) => {
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

router.get("/:id", async (req, res) => {
  try {
    const db = mongodb.getDb();

    const courseId = new ObjectId(req.params.id);

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

router.put("/:id", async (req, res) => {
  try {
    const db = mongodb.getDb();

    const courseId = new ObjectId(req.params.id);

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

module.exports = router;