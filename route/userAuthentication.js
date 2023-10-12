const bcrypt = require('bcrypt');
const {User} = require('../model/model'); // Importing Sequelize model
//const SALT_ROUNDS = 10;

async function authenticateUser(req,res) {
try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    // Extract the base64-encoded credentials part
    const encodedCredentials = authHeader.split(' ')[1];

    // Decode the base64-encoded credentials
    const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');

    // Extract the username and password from credentials
    const [username, password] = credentials.split(':');
    // console.log('Username:', username);
    // console.log('Password:', password);

    const existingUser = await User.findOne({ where: { email: username } });
    if (existingUser) {
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    //console.log('hashedPassword:', passwordMatch);
    if (passwordMatch) {
         // Authentication successful
        //return existingUser;
        return { statusCode: 200, user: existingUser };
    } else {
        //console.log('User Unauthorised');
        return res.status(401).json({ message: 'Incorrect Password' }); // Incorrect password
    }
}
else{
    return res.status(401).json({ message: 'Incorrect Email' });// incorrect email provided
}
  } catch (error) {
    console.log('Error in handling the request', error)// Handle the error as needed
    return res.status(403).json() //Forbidden
  }
}

async function authResults(req, res){
    const authenticationResult = await authenticateUser(req, res);

if (authenticationResult.statusCode === 200) {
  // Authentication successful, use the user object
  res.status(200).json();
}
}



module.exports = {authResults, authenticateUser}



  