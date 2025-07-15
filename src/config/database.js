const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sudamfegade:@namastenode.4ssb6vr.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
