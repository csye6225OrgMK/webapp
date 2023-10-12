// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const AssignmentController = require('../controller/Assignment');


// Get all assignments or a particular created by authorized user
router.get('/v1/assignments', AssignmentController.getAllAssignment);
router.get('/v1/assignments/:id', AssignmentController.getAssignmentByID);

// Create a new assignment (POST /api/assignments)
router.post('/v1/assignments', AssignmentController.createAssignment)
        .get(AssignmentController.getAllAssignment)
        .all( (req,res) => {
            return res.status(405).end();
        })

// Update an assignment (PATCH /api/assignments/:id)
router.patch('*', AssignmentController.updateAssignmentPatch);

// Update an assignment (PUT /api/assignments/:id)
router.put('/v1/assignments/:id', AssignmentController.updateAssignment);

// Delete an assignment (DELETE /api/assignments/:id)
router.delete('/v1/assignments/:id', AssignmentController.deleteAssignment);

module.exports = router;
