const express = require('express')
const cors = require('cors')
require('dotenv').config();
const connectDB = require('./config/connectDB')
const route = require('./routes/index')
const cookieParser = require('cookie-parser')
const { app, server } = require('./socket/index')

// const app = express()
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))


app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080

app.get('/', (request, response) => {
  response.json({
    message: "Server is running" + PORT,
    status: true
  })
})

//api endpoints 
app.use('/api', route);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  })
})
