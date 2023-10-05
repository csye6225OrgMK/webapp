// controllers/AssignmentController.js
const {Assignment} = require('../model/model');  // you need to add {} when the destination file exports multiple objects
const {authenticateUser} = require('../route/userAuthentication');
// const {User} = require('../model/model'); // Importing Sequelize model
const sequelize = require('../dbconnection');


const AssignmentController = {
  getAllAssignment: async (req, res) => {
    try {
      const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function
      if (authenticationResult.statusCode === 200) {
      // Authentication successful, use the user object
      const existingUser = authenticationResult.user;

      //query to get all assignments done by this authorized user:
      const allAssignment = await Assignment.findAll({ where: { assignment_created_by_user_id: existingUser.id } });
      
      if (!allAssignment || allAssignment.length === 0){
        return res.status(401).json({message:'Assignment not found either because of invalid assignment id or unauthrized access'}); 
      }

      const extractedDetails = allAssignment.map((assignment) => {
        return {
          id: assignment.id,
          name: assignment.name,
          points: assignment.points,
          attempts: assignment.attempts,
          deadline: assignment.deadline,
          assignment_created: assignment.assignment_created,
          assignment_updated: assignment.assignment_updated,
        };
        });
      
      return res.status(200).json(extractedDetails);
    } else {
      // Authentication failed, returning an appropriate response
      console.log('User', error);
      return res.status(401).json({ message: authenticationResult.message });
    }
  } catch (error) {
    console.log('Error in handling the request', error);
    return res.status(403).json(); 
  }
},


//get assignment by Id
getAssignmentByID: async (req, res) => {
  try {
    const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function
    if (authenticationResult.statusCode === 200) {
    // Authentication successful, use the user object
    const existingUser = authenticationResult.user;
    const assignment = await Assignment.findOne({ where:{ id: req.params.id }});

    var checkAuth = assignment.assignment_created_by_user_id == existingUser.id;
      if (!assignment || assignment.length === 0 || !checkAuth){
        return res.status(401).json({message:'Assignment not found either because of invalid assignment id or unauthrized access'}); 
      }

    return res.status(200).json({
      id: assignment.dataValues.id,
        name: assignment.dataValues.name,
        points: assignment.dataValues.points,
        attempts: assignment.dataValues.attempts,
        deadline: assignment.dataValues.deadline,
        assignment_created: assignment.dataValues.assignment_created,
        assignment_updated: assignment.dataValues.assignment_updated,
    });
  } else {
    // Authentication failed, returning an appropriate response
    return res.status(401).json({ message: authenticationResult.message });
  }
} catch (error) {
  return res.status(403).json({message:'Assignment not available'}); 
}
},


//Post Assignments to db
createAssignment: async (req, res) => {
  try {
    const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function

    if (authenticationResult.statusCode === 200) {
    // Authentication successful
    const existingUser = authenticationResult.user;
    //console.log(existingUser.email);
    try {
      const { name, points,attempts, deadline } = req.body;
      const assignment = await Assignment.create({
        name,
        points,
        attempts,
        deadline,
        assignment_created_by_user_id : existingUser.id,
      });

      return res.status(201).json({name:assignment.name,
        points:assignment.points,
        attempts:assignment.attempts,
        deadline:assignment.deadline,});  // cannot return assignment object directly, because we doont want to send "assignment_created_by_user_id : existingUser.id" this data
    } catch (error) {
      console.log('Error in creating', error);
      return res.status(401).json({ message:error.errors[0].message });
    }
  } else {
    // Authentication failed, returning an appropriate response
    return res.status(401).json({ message: authenticationResult.message });
  }
} catch (error) {
  return res.status(403).json({ message: 'Bad Request' }); 
}
},


//Update Assignment using PUT method
updateAssignment: async (req, res) => {
  try {
    const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function

    if (authenticationResult.statusCode === 200) {
    // Authentication successful, use the user object
    const existingUser = authenticationResult.user;
    const existingAssignment = await Assignment.findOne({
      where: { id: req.params.id }
      });

      var checkAuth = existingUser.id === existingAssignment.assignment_created_by_user_id;
      if (!existingAssignment || existingAssignment.length === 0 || !checkAuth){
        return res.status(401).json({message:'Assignment not found under the signed in user'}); 
      }
    try {
      const updates = req.body;
      await existingAssignment.update(updates);
      await existingAssignment.update({assignment_updated: sequelize.fn('NOW')});
      return res.status(201).json({
        name:existingAssignment.name,
        points:existingAssignment.points,
        attempts:existingAssignment.attempts,
        deadline:existingAssignment.deadline,
      });
    } catch (error) {
      return res.status(401).json({ message:error.errors[0].message });
    }
  } else {
    // Authentication failed, returning an appropriate response
    return res.status(401).json({ message: authenticationResult.message });
  }
} catch (error) {
  return res.status(403).json({message:'Bad Request'}); 
}
},


//DELETE Assignment
deleteAssignment: async (req, res) => {
  try {
    const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function

    if (authenticationResult.statusCode === 200) {
    // Authentication successful, use the user object
      const existingUser = authenticationResult.user;
      const existingAssignment = await Assignment.findOne({
        where: { id: req.params.id } // where assignment creator id is same as the id of logged in user && assignment_id = id passed in the request
      });

      if (existingAssignment.assignment_created_by_user_id === existingUser.id){

        const deletedRowCount = await existingAssignment.destroy({
        where: { assignment_created_by_user_id: existingUser.id} // where assignment creator id is same as the id of logged in user && assignment_id = id passed in the request
      });

      if (deletedRowCount === 0) {
        // Handle the case where no rows were deleted (assignment not found)
        return res.status(401).json({ message: 'Assignment not found under the signed in user' });
      }

      }
      else{
        return res.status(401).json({ message: 'Unauthorized access to the assignment' });
      }
  
      // Handle success and return a success message
      return res.status(200).json({ message: 'Assignment deleted successfully' });

  } else {
    // Authentication failed, returning an appropriate response
    //return res.status(400).json({ message: authenticationResult.message });
  }
} catch (error) {
  return res.status(403).json({message:'Bad Request'}); 
}
}
};


module.exports = AssignmentController;