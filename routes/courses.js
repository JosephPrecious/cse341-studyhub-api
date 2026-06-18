const express = require("express");
const coursesController = require("../controllers/courses");
const { ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /courses:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get all courses
 *     responses:
 *       200:
 *         description: List of courses
 *   post:
 *     tags:
 *       - Courses
 *     summary: Create a course
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseInput'
 *     responses:
 *       201:
 *         description: Course created
 */
router
  .route("/")
  .get(coursesController.getAll)
  .post(ensureAuthenticated, coursesController.create);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get one course
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Course found
 *       404:
 *         description: Course not found
 *   put:
 *     tags:
 *       - Courses
 *     summary: Update a course
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseInput'
 *     responses:
 *       204:
 *         description: Course updated
 *   delete:
 *     tags:
 *       - Courses
 *     summary: Delete a course
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Course deleted
 */
router
  .route("/:id")
  .get(coursesController.getById)
  .put(ensureAuthenticated, coursesController.update)
  .delete(ensureAuthenticated, coursesController.remove);

module.exports = router;
