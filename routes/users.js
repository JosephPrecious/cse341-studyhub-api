const express = require("express");
const usersController = require("../controllers/users");
const { ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.use(ensureAuthenticated);

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a user
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created
 */
router.route("/").get(usersController.getAll).post(usersController.create);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get one user
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       204:
 *         description: User updated
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: User deleted
 */
router
  .route("/:id")
  .get(usersController.getById)
  .put(usersController.update)
  .delete(usersController.remove);

module.exports = router;
