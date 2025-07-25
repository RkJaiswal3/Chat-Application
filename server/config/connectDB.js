const mongoose = require('mongoose')

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL)

    const connection = mongoose.connection

    connection.on('connected', () => {
      console.log("MongoDB Database is connected !");
    })

    connection.on('error', () => {
      console.log("Something is wrong in mongodb", error);

    })
  } catch (error) {
    console.log("Something is wrong", error);
  }
}

module.exports = connectDB