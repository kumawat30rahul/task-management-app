const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;

const dbConnection = async () => {
  try {
    await mongoose.connect(mongoUri);
  } catch (err) {
    console.log("Error connecting to MongoDB", err);
  }
};

module.exports = dbConnection;
