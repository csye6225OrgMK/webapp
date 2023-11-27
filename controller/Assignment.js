const {
  Assignment,
  Submission
} = require('../model/model'); // need to add {} when the destination file exports multiple objects

const {
  authenticateUser
} = require('../route/userAuthentication');
const sequelize = require('../dbconnection');
const logger = require('../logger');
const client = require('../cloudwatchMetrics');
require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
// const credentials = new AWS.SharedIniFileCredentials({ profile: process.env.profile });
// AWS.config.credentials = credentials;
const sns = new AWS.SNS();

logger.info("SNS TOPIC ARN: ", process.env.SNS_TOPIC_ARN);
logger.info("User profile ", process.env.profile);


const AssignmentController = {
  getAllAssignment: async (req, res) => {
      try {
          const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function
          if (authenticationResult.statusCode === 200) {
              // Authentication successful, use the user object
              logger.info('GET/v1/assignments: User authenticated.');
              const existingUser = authenticationResult.user;

              //query to get all assignments done by this authorized user:
              const allAssignment = await Assignment.findAll({
                  where: {
                      assignment_created_by_user_id: existingUser.id
                  }
              });

              if (!allAssignment || allAssignment.length === 0) {
                  logger.warn('GET/v1/assignments: no assigment found under this user');
                  return res.status(404).json({
                      message: 'Not Found'
                  });
              }
              client.increment("GETAllAssignment", 1);
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
              return;
          }
      } catch (error) {
          logger.error('GET/v1/assignments: ERROR in getting all assignments.');
          return res.status(401).json({
              message: 'Unauthorized Access'
          }); 
      }
  },


  //get assignment by Id
  getAssignmentByID: async (req, res) => {
      let assignmentId = req.params.id;
      try {
          const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function
          if (authenticationResult.statusCode === 200) {
              // Authentication successful, use the user object
              const existingUser = authenticationResult.user;
              const assignment = await Assignment.findOne({
                  where: {
                      id: req.params.id
                  }
              });

              if (!assignment || assignment.length === 0) {
                  logger.warn('GET/v1/assignments/' + assignmentId + ': Assignment Not Found');
                  return res.status(404).json({
                      message: 'Assignment Not Found'
                  });
              }

              var checkAuth = assignment.assignment_created_by_user_id == existingUser.id;

              if (!checkAuth) {
                  logger.error('GET/v1/assignments' + assignmentId + ': Forbidden Access to ' + assignmentId + ' assignments.');
                  return res.status(403).json({
                      message: 'Forbidden Access'
                  });
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
              return;
          }
      } catch (error) {
          logger.error('GET/v1/assignments: ERROR in getting  ' + assignmentId + '  assignments.');
          return res.status(401).json({
              message: 'Unauthorized Access'
          });
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
                  const {
                      name,
                      points,
                      attempts,
                      deadline
                  } = req.body;

                  if (new Date(req.body.deadline) <= new Date()) {
                      logger.error('POST/v1/assignments/: ERROR : The deadline must be in the future.');
                      return res.status(400).json({
                          message: 'The deadline must be in the future.'
                      });
                  }
                  const assignment = await Assignment.create({
                      name,
                      points,
                      attempts,
                      deadline,
                      assignment_created_by_user_id: existingUser.id,
                  });

                  client.increment("POSTAssignmentById", 1);
                  return res.status(201).json({
                      name: assignment.name,
                      points: assignment.points,
                      attempts: assignment.attempts,
                      deadline: assignment.deadline,
                  }); // cannot return assignment object directly, because we doont want to send "assignment_created_by_user_id : existingUser.id" this data
              } catch (error) {
                  console.log('Error in creating', error);
                  logger.error('POST/v1/assignments: Error in creating assignment.');
                  return res.status(400).json({
                      message: error.errors[0].message
                  });
              }
          } else {
              // Authentication failed, returning an appropriate response
              return;
          }
      } catch (error) {
          logger.error('POST/v1/assignments: Unauthorized Access.');
          return res.status(401).json({
              message: 'Unauthorized Access'
          });
      }
  },


  //Update Assignment using PUT method
  updateAssignment: async (req, res) => {
      let assignmentId = req.params.id;
      try {
          logger.info('PUT/v1/assignments/' + assignmentId + ' : Authenticating the user...');
          const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function

          if (authenticationResult.statusCode === 200) {
              // Authentication successful, use the user object
              logger.info('PUT/v1/assignments/ ' + assignmentId + ' : User Authenticated.');
              const existingUser = authenticationResult.user;
              const existingAssignment = await Assignment.findOne({
                  where: {
                      id: req.params.id
                  }
              });

              var checkAuth = existingUser.id === existingAssignment.assignment_created_by_user_id;
              if (!checkAuth) {
                  logger.error('PUT/v1/assignments/ ' + assignmentId + ' : Forbidden Access to ' + assignmentId + ' assignments.');
                  return res.status(403).json({
                      message: 'Forbidden Access'
                  });
              }
              if (!existingAssignment || existingAssignment.length === 0) {
                  logger.error('PUT/v1/assignments/ ' + assignmentId + ' : Forbidden Access to ' + assignmentId + ' assignments.');
                  return res.status(403).json({
                      message: 'Forbidden Access'
                  });
              }

              try {
                  const updates = req.body;
                  const updatedDeadline = new Date(req.body.deadline);
                  if (updatedDeadline <= new Date()) {
                      logger.error('PUT/v1/assignments/ ' + assignmentId + ' : ERROR : The deadline must be in the future.');
                      return res.status(400).json({
                          message: 'The deadline must be in the future.'
                      });
                  }
                  await existingAssignment.update(updates);
                  client.increment("PUTAssignmentById", 1);
                  return res.status(204).json();
              } catch (error) {
                  logger.error('PUT/v1/assignments/ ' + assignmentId + ' : ERROR : ' + error.errors[0].message);
                  return res.status(400).json({
                      message: error.errors[0].message
                  });
              }
          } else {
              return; 
          }
      } catch (error) {
          logger.error('PUT/v1/assignments/ ' + assignmentId + ' : Unauthorized Access.');
          return res.status(401).json({
              message: 'Unauthorized Access'
          });
      }
  },


  //DELETE Assignment
  deleteAssignment: async (req, res) => {
      let assignmentId = req.params.id;
      try {
          logger.info('DELETE/v1/assignments/ ' + assignmentId + ' : Authenticating the user.');
          const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function

          if (authenticationResult.statusCode === 200) {
              // Authentication successful, use the user object
              logger.info('DELETE/v1/assignments/ ' + assignmentId + ' : User Authenticated.');
              const existingUser = authenticationResult.user;
              const existingAssignment = await Assignment.findOne({
                  where: {
                      id: req.params.id
                  }
              });

              if (existingAssignment === null) {
                  logger.error('DELETE/v1/assignments/ ' + assignmentId + ' : Assignment not found.');
                  return res.status(404).json({
                      message: 'Assignment not found'
                  });
              }

              if (existingAssignment.assignment_created_by_user_id != existingUser.id) {
                  logger.error('DELETE/v1/assignments/ ' + assignmentId + ' : Forbidden access to ' + assignmentId + ' assignment.');
                  return res.status(403).json({
                      message: 'Forbidden access to the assignment'
                  });
              }

              if (existingAssignment.assignment_created_by_user_id === existingUser.id) {
                  const deletedRowCount = await existingAssignment.destroy({
                      where: {
                          assignment_created_by_user_id: existingUser.id
                      }
                  });
              }

              // Handle success and return a success message
              client.increment("DELETEAssignmentById", 1);
              logger.info('DELETE/v1/assignments/ ' + assignmentId + ' : SUCCESS in deleting ' + assignmentId + ' assignment.');
              return res.status(204).json({
                  message: 'Assignment deleted successfully'
              });

          } else {
              // Authentication failed, returning an appropriate response
              return;
          }
      } catch (error) {
          logger.error('DELETE/v1/assignments/ ' + assignmentId + ' : Unauthorized Access.');
          return res.status(401).json({
              message: 'Unauthorized Access'
          });
      }
  },


  // Post Assignments submission to
  submitAssignment: async (req, res) => {
    let assignmentId = req.params.id;
    try {
        logger.info('POST/v1/assignments/:id/submission: Authenticating the user.');
        const authenticationResult = await authenticateUser(req, res); // Call authenticateUser function

        if (authenticationResult.statusCode === 200) {
            logger.info('POST/v1/assignments/:id/submission: User Authenticated.');
            // Authentication successful
            const existingUser = authenticationResult.user;

            // Get the assignment by ID
            const assignment = await Assignment.findOne({
                where: {
                    id: assignmentId
                }
            });

            // Check if the assignment exists
            if (!assignment) {
                logger.error(`POST/v1/assignments/${assignmentId}/submission: Assignment Not Found`);
                return res.status(404).json({
                    message: 'Assignment Not Found'
                });
            }

            // Check if the deadline has passed
            const currentDateTime = new Date();
            const assignmentDeadline = new Date(assignment.deadline);

            // Check the number of attempts
            const submission_attempts = await Submission.count({
                where: {
                    assignment_id: assignmentId,
                    email: existingUser.email,
                },
                // logging: console.log
            });

            console.log(submission_attempts);

            if (currentDateTime > assignmentDeadline || submission_attempts >= assignment.attempts) {
                const rejectionReason = submission_attempts >= assignment.attempts ? 'Exceeded allowed attempts' : 'Deadline for the assignment has passed';
                logger.error(`POST/v1/assignments/${assignmentId}/submission: ${rejectionReason}.`);
                const rejectionInfo = {
                    userEmail: existingUser.email, // Assuming existingUser has the email
                    assignmentId,
                    rejectionReason,
                };
              
                return res.status(400).json({message:'Submission rejected. REASON: ' + rejectionInfo.rejectionReason});
            } else {
                const submission = await Submission.create({
                    assignment_id: assignmentId,
                    submission_url: req.body.submission_url,
                    submission_date: new Date(),
                    email: existingUser.email,
                    submission_updated: new Date(),
                });

                const submissionInfo = {
                    userEmail: existingUser.email,
                    assignmentId,
                    githubRepoUrl: req.body.submission_url,
                };

                const snsSuccessMessage = {
                    Message: JSON.stringify(submissionInfo),
                    TopicArn: process.env.SNS_TOPIC_ARN,
                };

                sns.publish(snsSuccessMessage, (err, data) => {
                    if (err) {
                        console.error('Error publishing to SNS:', err);
                        logger.error(`POST/v1/assignments/${assignmentId}/submission: Error: `, err);
                        return res.status(500).json({message:'Error occurred while processing submission'});
                    } else {
                        client.increment('POSTAssignmentSubmission', 1);
                        logger.info(`POST/v1/assignments/${assignmentId}/submission: Assignment submitted successfully`);
                        return res.status(200).json({
                            message: 'Assignment submitted successfully',
                            submissionDetails: submissionInfo,
                            remaining_attempts: assignment.attempts - submission_attempts - 1,
                        });
                    }
                });
            }
        } else {
            return res.status(401).json({
                message: 'Unauthorized Access'
            });
        }
    } catch (error) {
        logger.error('POST/v1/assignments/ ' + assignmentId + ' : Unauthorized Access.', error);
        return res.status(401).json({
            message: 'Unauthorized Access'
        });
    }
},

  updateAssignmentPatch: async (req, res) => {
    return res.status(405).json();
  },

  headRequest: async (req, res) => {
    return res.status(405).json();
  },

  optionRequest: async (req, res) => {
    return res.status(405).json();
  }
};


module.exports = AssignmentController;

