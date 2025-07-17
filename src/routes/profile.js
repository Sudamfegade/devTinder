const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditData, validateEditPass } = require("../utils/validation");

const profileRouter = express.Router();
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData) {
      throw new Error("Invalid edit request");
    }
    const loggedinUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedinUser[key] = req.body[key]));
    await loggedinUser.save();
    res.json({
      message: `${loggedinUser.firstName}, your profile has been updated successfully.`,
      data: loggedinUser,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validateEditPass) {
      throw new Error("Invalid edit request");
    }
    const loggedinUser = req.user;
    loggedinUser.password = req.body.password;
    await loggedinUser.save();
    res.json({
      message: "Password has been updated.",
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = profileRouter;
