const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectRequestModal = require("../models/connection");
const user = require("../models/user");

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const connectRequest = await ConnectRequestModal.find({
      toUserId: loggedinUser._id,
      status: "intrested",
    }).populate("fromUserId", USER_SAFE_DATA);
    if (connectRequest.length === 0) {
      return res.status(400).send("no request");
    }
    res.json({ data: connectRequest });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/requests/connections", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const connectionRequests = await ConnectRequestModal.find({
      $or: [
        {
          toUserId: loggedinUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedinUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    if (connectionRequests.length === 0) {
      return res.status(400).send("no request");
    }
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedinUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      data: data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectRequestModal.find({
      $or: [
        {
          toUserId: loggedinUser._id,
        },
        {
          fromUserId: loggedinUser._id,
        },
      ],
    }).select("fromUserId toUserId");
    const hideUserFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    const users = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUserFromFeed) } },
          { _id: { $ne: loggedinUser._id } },
        ],
      })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = { userRouter };
