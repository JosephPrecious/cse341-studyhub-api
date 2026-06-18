const express = require("express");
const groupsController = require("../controllers/groups");
const { ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /groups:
 *   get:
 *     tags:
 *       - Study Groups
 *     summary: Get all study groups
 *     responses:
 *       200:
 *         description: List of study groups
 *   post:
 *     tags:
 *       - Study Groups
 *     summary: Create a study group
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudyGroupInput'
 *     responses:
 *       201:
 *         description: Study group created
 */
router
  .route("/")
  .get(groupsController.getAll)
  .post(ensureAuthenticated, groupsController.create);

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     tags:
 *       - Study Groups
 *     summary: Get one study group
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Study group found
 *       404:
 *         description: Study group not found
 *   put:
 *     tags:
 *       - Study Groups
 *     summary: Update a study group
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudyGroupInput'
 *     responses:
 *       204:
 *         description: Study group updated
 *   delete:
 *     tags:
 *       - Study Groups
 *     summary: Delete a study group
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Study group deleted
 */
router
  .route("/:id")
  .get(groupsController.getById)
  .put(ensureAuthenticated, groupsController.update)
  .delete(ensureAuthenticated, groupsController.remove);

module.exports = router;
