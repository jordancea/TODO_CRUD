const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const users = require("./routes/api/users");
const auth = require("./routes/api/auth")



const app = express()

//connect to DB

connectDB();

// Init Middleware
app.use(express.json({extended: false}))


app.get("/", (req, res) => res.send("Hello World"));

//Define Routes

app.use('/api/users', users)
app.use('/api/auth', auth)



const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('API Running'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));