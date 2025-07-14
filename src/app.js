const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());

app.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    console.log(error);
  }
});

app.get("/user", async (req, res) => {
  const emailid = req.body.email;
  try {
    const users = await User.find({ email: emailid });
    res.send(users);
  } catch (err) {
    console.log(err);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("user deleted successfully");
  } catch (error) {
    console.log(error);
  }
});

app.patch("/user", async (req, res) => {
  const userid = req.body.id;
  const data = req.body;
  try {
    const useres = await User.findByIdAndUpdate({ _id: userid }, data);
    res.send(useres);
  } catch (error) {
    console.log(error);
  }
});
connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(3030, () => {
      console.log("Server is successfully listening on port 3030....");
    });
  })
  .catch((err) => {
    console.log("error occured: ", err);
  });
