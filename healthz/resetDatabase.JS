const sequelize = require('./dbconnection');
// Replace with the correct path to your User model file

(async () => {
  try {
    // Drop the Users table
  

    // Clear the Sequelize cache
    sequelize.models = {};

    // Synchronize the models to recreate the tables
    await sequelize.sync();

    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    sequelize.close(); // Close the database connection
  }
})();
