// controllers/AssignmentController.js
const {Assignment} = require('../model/model');  // you need to add {} when the destination file exports multiple objects
const {authenticateUser} = require('../route/userAuthentication');
const sequelize = require('../dbconnection');
const logger = require('../logger');



const AssignmentController = {
  getAllAssignment: async (req, res) => {
    try {
      const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function
      if (authenticationResult.statusCode === 200) {
      // Authentication successful, use the user object
      logger.info('GET/v1/assignments: User authenticated.');
      const existingUser = authenticationResult.user;

      //query to get all assignments done by this authorized user:
      const allAssignment = await Assignment.findAll({ where: { assignment_created_by_user_id: existingUser.id } });
      //var checkAuth = allAssignment.assignment_created_by_user_id == existingUser.id;
    
      if (!allAssignment || allAssignment.length === 0 ){
        logger.warn('GET/v1/assignments: no assigment found under this user');
        return res.status(404).json({message:'Not Found'}); 
      }
      client.increment();
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
  let assigmentId = req.params.id;
  try {
    const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function
    if (authenticationResult.statusCode === 200) {
    // Authentication successful, use the user object
    const existingUser = authenticationResult.user;
    const assignment = await Assignment.findOne({ where:{ id: req.params.id }});

    if (!assignment || assignment.length === 0){
      logger.warn('GET/v1/assignments/' + assigmentId + ': Assignment Not Found');
      return res.status(404).json({message:'Assignment Not Found'});  
    }

    var checkAuth = assignment.assignment_created_by_user_id == existingUser.id;

    if (!checkAuth){
      logger.error('GET/v1/assignments' + assigmentId + ': Forbidden Access to '+ assigmentId + ' assignments.');
      return res.status(403).json({message:'Forbidden Access'}); 
    }

    client.increment("GETAssignmentById", 1);
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
  logger.error('GET/v1/assignments: ERROR in getting  '+ assigmentId + '  assignments.');
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

      if (new Date(req.body.deadline) <= new Date()) {
        logger.error('POST/v1/assignments/: ERROR : The deadline must be in the future.');
        return res.status(400).json({ message:'The deadline must be in the future.' });
      }
      const assignment = await Assignment.create({
        name,
        points,
        attempts,
        deadline,
        assignment_created_by_user_id : existingUser.id,
      });

      client.increment("POSTAssignmentById", 1);
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
  let assigmentId = req.params.id;
  try {
    logger.info('PUT/v1/assignments/' + assigmentId + ' : Authenticating the user...');
    const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function

    if (authenticationResult.statusCode === 200) {
    // Authentication successful, use the user object
    logger.info('PUT/v1/assignments/ ' + assigmentId + ' : User Authenticated.');
    const existingUser = authenticationResult.user;
    const existingAssignment = await Assignment.findOne({
      where: { id: req.params.id }
      });

      var checkAuth = existingUser.id === existingAssignment.assignment_created_by_user_id;
      if (!checkAuth){
        logger.error('PUT/v1/assignments/ ' + assigmentId + ' : Forbidden Access to '+ assigmentId + ' assignments.');
        return res.status(403).json({message:'Forbidden Access'}); 
      }
      if (!existingAssignment || existingAssignment.length === 0){
        logger.error('PUT/v1/assignments/ ' + assigmentId + ' : Forbidden Access to ' + assigmentId + ' assignments.');
        return res.status(403).json({message:'Forbidden Access'});  
      }

    try {
      const updates = req.body;
      const updatedDeadline = new Date(req.body.deadline);
      if (updatedDeadline <= new Date()) {
        logger.error('PUT/v1/assignments/ ' + assigmentId + ' : ERROR : The deadline must be in the future.');
        return res.status(400).json({ message:'The deadline must be in the future.' });
      }
      await existingAssignment.update(updates);
      await existingAssignment.update({assignment_updated: sequelize.fn('NOW')});
      client.increment("PUTAssignmentById", 1);
      return res.status(204).json();
    } catch (error) {
      logger.error('PUT/v1/assignments/ ' + assigmentId + ' : ERROR : ' + error.errors[0].message);
      return res.status(400).json({ message:error.errors[0].message });
    }
  } else {
    return ; //res.status(authenticationResult.statusCode).json({ message: authenticationResult.message });;
  }
} catch (error) {
  logger.error('PUT/v1/assignments/ ' + assigmentId + ' : Unauthorized Access.');
  return res.status(401).json({message:'Unauthorized Access'}); 
}
},


//DELETE Assignment
deleteAssignment: async (req, res) => {
  let assigmentId = req.params.id;
  try {
    logger.info('DELETE/v1/assignments/ ' + assigmentId + ' : Authenticating the user.');
    const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function

    if (authenticationResult.statusCode === 200) {
    // Authentication successful, use the user object
      logger.info('DELETE/v1/assignments/ ' + assigmentId + ' : User Authenticated.');
      const existingUser = authenticationResult.user;
      const existingAssignment = await Assignment.findOne({
        where: { id: req.params.id } 
      });

      if(existingAssignment === null) {
        logger.error('DELETE/v1/assignments/ ' + assigmentId + ' : Assignment not found.');
        return res.status(404).json({ message: 'Assignment not found' });
      }

      if(existingAssignment.assignment_created_by_user_id != existingUser.id) {
        logger.error('DELETE/v1/assignments/ ' + assigmentId + ' : Forbidden access to ' + assigmentId + ' assignment.');
        return res.status(403).json({ message: 'Forbidden access to the assignment' });
      }

      if (existingAssignment.assignment_created_by_user_id === existingUser.id){
        const deletedRowCount = await existingAssignment.destroy({
        where: { assignment_created_by_user_id: existingUser.id } 
      });
      }


  
      // Handle success and return a success message
      client.increment("DELETEAssignmentById", 1);
      logger.info('DELETE/v1/assignments/ ' + assigmentId + ' : SUCCESS in deleting ' + assigmentId + ' assignment.');
      return res.status(204).json({ message: 'Assignment deleted successfully' });

  } else {
    // Authentication failed, returning an appropriate response
    return ; //res.status(authenticationResult.statusCode).json({ message: authenticationResult.message });;
  }
} catch (error) {
  logger.error('DELETE/v1/assignments/ ' + assigmentId + ' : Unauthorized Access.');
  return res.status(401).json({message:'Unauthorized Access'});
}
},

updateAssignmentPatch: async (req, res) => {
  return res.status(405).json();
}

};


module.exports = AssignmentController;