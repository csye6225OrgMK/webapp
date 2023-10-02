// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const AssignmentController = require('../controllers/AssignmentController');

// Create a new assignment (POST /api/assignments)
router.post('/', authenticateToken, AssignmentController.createAssignment);

// Update an assignment (PUT /api/assignments/:id)
router.put('/:id', authenticateToken, AssignmentController.updateAssignment);

// Delete an assignment (DELETE /api/assignments/:id)
router.delete('/:id', authenticateToken, AssignmentController.deleteAssignment);

module.exports = router;
