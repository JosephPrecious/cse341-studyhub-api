const express = require("express");
const coursesController = require("../controllers/courses");
const { ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.use(ensureAuthenticated);

/**
 * @swagger
 * /courses:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get all courses
 *     security:
 *       - sessionAuth: []
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
router.route("/").get(coursesController.getAll).post(coursesController.create);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get one course
 *     security:
 *       - sessionAuth: []
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
  .put(coursesController.update)
  .delete(coursesController.remove);

module.exports = router;
