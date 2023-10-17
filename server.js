const express = require('express')
const app = express()
const UserCreation = require('./controller/User')
//require('dotenv').config()

const PORT = process.env.PORT||8080

app.use(express.json())
app.listen(PORT, ()=> console.log(`App listening on port ${PORT}!`))

//User creation by reading file done below by calling importCSVData function from User controller.
UserCreation.importCSVData();

const router = require('./route/route')
app.use('', router)


//User Authorization or Authentication check
const {authResults} = require('./route/userAuthentication');
app.post('/userAuthentication', authResults);

const userrouter = require('./route/userRoute');
app.use('', userrouter);

const assignmentRoutes = require('./route/assignment');
app.use('', assignmentRoutes);
//console.log(assignmentRoutes);


module.exports = app;