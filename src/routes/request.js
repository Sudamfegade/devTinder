const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectRequestModal = require("../models/connection");
const user = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId.trim();
      const status = req.params.status;
      const allowedStatus = ["intrested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.json({
          message: "Invalid Status Type: " + status,
        });
      }
      const existingconnection = await ConnectRequestModal.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingconnection) {
        return res
          .status(400)
          .json({ message: "connection request already exist" });
      }
      const toUser = await user.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "user is not exist" });
      }
      const connectRequest = new ConnectRequestModal({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectRequest.save();
      res.json({
        message: req.user.firstName + status + "in" + toUserId.firstName,
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedinUser = req.user;
      const { status, requestId } = req.params;
      console.log(loggedinUser, status, requestId);
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).send({ message: "Status not allowed" });
      }
      const connectionRequest = await ConnectRequestModal.findOne({
        _id: requestId,
        toUserId: loggedinUser._id,
        status: "intrested",
      });
      console.log(connectionRequest);
      if (!connectionRequest) {
        return res.status(400).json({
          message: "connection request not found.",
        });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "connection request " + status, data: data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);
module.exports = requestRouter;
