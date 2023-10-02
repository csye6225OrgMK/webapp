const sequelize = require('../dbconnection'); // Import your Sequelize instance


(async () => {
  try {
    await sequelize.query('Drop TABLE Assigments;');
    console.log('Table renamed successfully.');
  } catch (error) {
    console.error('Error renaming table:', error);
  } finally {
    // Close the Sequelize connection when done (optional)
    await sequelize.close();
  }
})();
