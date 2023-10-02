// controllers/AssignmentController.js
const Assignment = require('../models/Assignment');

class AssignmentController {
  // Create a new assignment
  static async createAssignment(req, res) {
    try {
      const { title, description, points } = req.body;

      // Create the assignment and associate it with the authenticated user
      const assignment = await Assignment.create({
        title,
        description,
        points,
        UserId: req.user.id, // Assign the authenticated user's ID
      });

      res.status(201).json(assignment);
    } catch (error) {
      console.error('Error creating assignment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Update an assignment
  static async updateAssignment(req, res) {
    const { id } = req.params;

    try {
      const assignment = await Assignment.findByPk(id);

      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      if (assignment.UserId !== req.user.id) {
        return res.status(403).json({ error: 'Permission denied' });
      }

      const { title, description, points } = req.body;

      // Update assignment properties
      assignment.title = title;
      assignment.description = description;
      assignment.points = points;

      await assignment.save();

      res.status(200).json(assignment);
    } catch (error) {
      console.error('Error updating assignment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Delete an assignment
  static async deleteAssignment(req, res) {
    const { id } = req.params;

    try {
      const assignment = await Assignment.findByPk(id);

      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      if (assignment.UserId !== req.user.id) {
        return res.status(403).json({ error: 'Permission denied' });
      }

      await assignment.destroy();

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AssignmentController;
