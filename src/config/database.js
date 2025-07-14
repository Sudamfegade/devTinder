const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sudamfegade:Z0m2Lb56QsyxlgNv@namastenode.4ssb6vr.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
