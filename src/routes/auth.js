const express = require("express");
const { validateSingupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSingupData(req);
    const { firstName, lastName, emailId, password } = new User(req.body);
    const passHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: passHash,
    });
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error : " + err.massege);
  }
});

authRouter.post("/login", async (req, res) => {
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
  } catch (err) {
    res.status(400).send("Error : " + err.massege);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expries: new Date(Date.now) })
    .send("logout successfully");
});

module.exports = authRouter;
