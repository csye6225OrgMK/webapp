// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const AssignmentController = require('../controller/Assignment');


// Get all assignments or a particular created by authorized user
router.get('/v2/assignments', AssignmentController.getAllAssignment);
// Create a new assignment (POST /api/assignments)
router.post('/v2/assignments', AssignmentController.createAssignment);


router.get('/v2/assignments/:id', AssignmentController.getAssignmentByID);

//POST assignment submission
router.post('/v2/assignments/:id/submission', AssignmentController.submitAssignment);
router.all('/v2/assignments/:id/submission', (req, res) => {
    // Return a 405 status code for any request other than POST
    return res.status(405).send();
});


// Update an assignment (PUT /api/assignments/:id)
router.put('/v2/assignments/:id', AssignmentController.updateAssignment);

// Delete an assignment (DELETE /api/assignments/:id)
router.delete('/v2/assignments/:id', AssignmentController.deleteAssignment);

// Update an assignment (PATCH /api/assignments/:id)
router.patch('*', AssignmentController.updateAssignmentPatch);

// Update an assignment (PATCH /api/assignments/:id)
router.head('*', AssignmentController.headRequest);

router.options('*', AssignmentController.optionRequest);

module.exports = router;

