const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSingupData } = require("./utils/validation");

const cookiesparser = require("cookie-parser");

const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookiesparser());

app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSingupData(req);

    // encryption of pass
    const { firstName, lastName, emailId, password } = new User(req.body);
    const passHash = await bcrypt.hash(password, 10);
    //   Creating a new instance of the User model
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: passHash,
    });

    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const ispassword = await user.validatePass(password);
    if (ispassword) {
      // jwt creation
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("login successfully");
    } else {
      throw new Error(" Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("validation error:" + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.post("/sendConnection", userAuth, (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sended");
});
// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    console.log(userEmail);
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }

    // const users = await User.find({ emailId: userEmail });
    // if (users.length === 0) {
    //   res.status(404).send("User not found");
    // } else {
    //   res.send(users);
    // }
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

// Detele a user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    //const user = await User.findByIdAndDelete(userId);

    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

// Update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED:" + err.message);
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
