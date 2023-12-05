// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const AssignmentController = require('../controller/Assignment');


// Get all assignments or a particular created by authorized user
router.get('/v3/assignments', AssignmentController.getAllAssignment);


router.get('/v3/assignments/:id', AssignmentController.getAssignmentByID)
    .all((req, res) => {
        return res.status(405).end();
    });

// Create a new assignment (POST /api/assignments)
router.post('/v3/assignments', AssignmentController.createAssignment)
    .get(AssignmentController.getAllAssignment)
    .all((req, res) => {
        return res.status(405).end();
    });

//POST assignment submission
router.post('/v3/assignments/:id/submission', AssignmentController.submitAssignment)



// Update an assignment (PATCH /api/assignments/:id)
router.patch('*', AssignmentController.updateAssignmentPatch);

// Update an assignment (PATCH /api/assignments/:id)
router.head('*', AssignmentController.headRequest);

router.options('*', AssignmentController.optionRequest);


// Update an assignment (PUT /api/assignments/:id)
router.put('/v3/assignments/:id', AssignmentController.updateAssignment);

// Delete an assignment (DELETE /api/assignments/:id)
router.delete('/v3/assignments/:id', AssignmentController.deleteAssignment);




module.exports = router;

