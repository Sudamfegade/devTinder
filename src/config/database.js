const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.BD_CONNECTIONS_URL);
};

module.exports = { connectDB };
