const express = require("express");
const assignmentsController = require("../controllers/assignments");
const { ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /assignments:
 *   get:
 *     tags:
 *       - Assignments
 *     summary: Get all assignments
 *     responses:
 *       200:
 *         description: List of assignments
 *   post:
 *     tags:
 *       - Assignments
 *     summary: Create an assignment
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentInput'
 *     responses:
 *       201:
 *         description: Assignment created
 */
router
  .route("/")
  .get(assignmentsController.getAll)
  .post(ensureAuthenticated, assignmentsController.create);

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     tags:
 *       - Assignments
 *     summary: Get one assignment
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Assignment found
 *       404:
 *         description: Assignment not found
 *   put:
 *     tags:
 *       - Assignments
 *     summary: Update an assignment
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentInput'
 *     responses:
 *       204:
 *         description: Assignment updated
 *   delete:
 *     tags:
 *       - Assignments
 *     summary: Delete an assignment
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Assignment deleted
 */
router
  .route("/:id")
  .get(assignmentsController.getById)
  .put(ensureAuthenticated, assignmentsController.update)
  .delete(ensureAuthenticated, assignmentsController.remove);

module.exports = router;
