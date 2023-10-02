const express = require('express')
const app = express()
//require('dotenv').config()

const PORT = process.env.PORT||8080

app.use(express.json())
app.listen(PORT, ()=> console.log(`App listening on port ${PORT}!`))

const router = require('./route/route')
app.use('', router)

// const userRoutes = require('./routes/users');
// const authRoutes = require('./routes/auth');
// const assignmentRoutes = require('./routes/assignments');

// app.use('/api/users', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/assignments', assignmentRoutes);