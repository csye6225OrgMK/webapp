// controllers/AssignmentController.js
const {Assignment} = require('../model/model');  // you need to add {} when the destination file exports multiple objects
const {authenticateUser} = require('../route/userAuthentication');
// const {User} = require('../model/model'); // Importing Sequelize model
const sequelize = require('../dbconnection');
const logger = require('../logger');

const AssignmentController = {
  getAllAssignment: async (req, res) => {
    try {
      const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function
      if (authenticationResult.statusCode === 200) {
      // Authentication successful, use the user object
      logger.error('GET/v1/assignments: ERROR in getting all assignments.');
      const existingUser = authenticationResult.user;

      //query to get all assignments done by this authorized user:
      const allAssignment = await Assignment.findAll({ where: { assignment_created_by_user_id: existingUser.id } });
      //var checkAuth = allAssignment.assignment_created_by_user_id == existingUser.id;
      
      if (!allAssignment || allAssignment.length === 0 ){
        logger.error('GET/v1/assignments: ERROR in accessing the assignments.');
        return res.status(403).json({message:'Forbidden Access'}); 
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
      //return res.status(authenticationResult.statusCode).json({ message: authenticationResult.message });
      return ;
    }
  } catch (error) {
    logger.error('GET/v1/assignments: ERROR in getting all assignments.');
    return res.status(401).json({message:'Unauthorized Access'}); //Forbidden
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
      logger.error('GET/v1/assignments: Forbidden Access to this assignments.');
      return res.status(403).json({message:'Forbidden Access'}); 
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
    return ; //res.status(authenticationResult.statusCode).json({ message: authenticationResult.message });
  }
} catch (error) {
  logger.error('GET/v1/assignments: ERROR in getting this assignments.');
  return res.status(401).json({message:'Unauthorized Access'}); 
}
},


//Post Assignments to db
createAssignment: async (req, res) => {
  try {
    logger.info('POST/v1/assignments: Authenticating the user.');
    const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function

    if (authenticationResult.statusCode === 200) {
      logger.info('POST/v1/assignments: User Authenticated.');
    // Authentication successful
    const existingUser = authenticationResult.user;
    logger.warn('POST/v1/assignments: User creating new assignment.');
    try {
      const { name, points, attempts, deadline } = req.body;
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
      logger.error('POST/v1/assignments: Error in creating assignment.');
      return res.status(400).json({ message:error.errors[0].message });
    }
  } else {
    // Authentication failed, returning an appropriate response
    return ; //res.status(authenticationResult.statusCode).json({ message: authenticationResult.message });
  }
} catch (error) {
  logger.error('POST/v1/assignments: Unauthorized Access.');
  return res.status(401).json({message:'Unauthorized Access'}); 
}
},


//Update Assignment using PUT method
updateAssignment: async (req, res) => {
  try {
    logger.info('PUT/v1/assignments: Authenticating the user.');
    const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function

    if (authenticationResult.statusCode === 200) {
    // Authentication successful, use the user object
    logger.info('PUT/v1/assignments: User Authenticated.');
    const existingUser = authenticationResult.user;
    const existingAssignment = await Assignment.findOne({
      where: { id: req.params.id }
      });

      var checkAuth = existingUser.id === existingAssignment.assignment_created_by_user_id;
      if (!existingAssignment || existingAssignment.length === 0 || !checkAuth){
        logger.error('PUT/v1/assignments: Forbidden Access to this assignments.');
        return res.status(403).json({message:'Forbidden Access'});  
      }
    try {
      const updates = req.body;
      await existingAssignment.update(updates);
      await existingAssignment.update({assignment_updated: sequelize.fn('NOW')});
      return res.status(204).json();
    } catch (error) {
      return res.status(400).json({ message:error.errors[0].message });
    }
  } else {
    // Authentication failed, returning an appropriate response
    //return res.status(401).json({ message: authenticationResult.message });
    return ; //res.status(authenticationResult.statusCode).json({ message: authenticationResult.message });;
  }
} catch (error) {
  logger.error('PUT/v1/assignments: Unauthorized Access.');
  return res.status(401).json({message:'Unauthorized Access'}); 
}
},


//DELETE Assignment
deleteAssignment: async (req, res) => {
  try {
    logger.info('DELETE/v1/assignments: Authenticating the user.');
    const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function

    if (authenticationResult.statusCode === 200) {
    // Authentication successful, use the user object
      logger.info('DELETE/v1/assignments: User Authenticated.');
      const existingUser = authenticationResult.user;
      const existingAssignment = await Assignment.findOne({
        where: { id: req.params.id } 
      });

      if(existingAssignment === null) {
        logger.error('DELETE/v1/assignments: Assignment not found.');
        return res.status(404).json({ message: 'Assignment not found' });
      }

      if (existingAssignment.assignment_created_by_user_id === existingUser.id){

        const deletedRowCount = await existingAssignment.destroy({
        where: { assignment_created_by_user_id: existingUser.id } 
      });

      }
      else{
        logger.error('DELETE/v1/assignments: Forbidden access to the assignment.');
        return res.status(403).json({ message: 'Forbidden access to the assignment' });
      }
  
      // Handle success and return a success message
      logger.info('DELETE/v1/assignments: SUCCESS in deleting this assignment.');
      return res.status(204).json({ message: 'Assignment deleted successfully' });

  } else {
    // Authentication failed, returning an appropriate response
    return ; //res.status(authenticationResult.statusCode).json({ message: authenticationResult.message });;
  }
} catch (error) {
  logger.error('DELETE/v1/assignments: Unauthorized Access.');
  return res.status(401).json({message:'Unauthorized Access'});
}
},

updateAssignmentPatch: async (req, res) => {
  return res.status(405).json();
}

};


module.exports = AssignmentController;