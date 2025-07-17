const { default: mongoose } = require("mongoose");
const user = require("./user");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: user,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: user,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "intrested", "accepted", "rejected"],
        message: `{VALUE} is incorrect type`,
      },
    },
  },
  {
    timestamps: true,
  }
);
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestSchema.pre("save", function (next) {
  const connectRequest = this;
  if (connectRequest.fromUserId.equals(connectRequest.toUserId)) {
    throw new Error("we can't send request to yourself");
  }
  next();
});
const ConnectRequestModal = new mongoose.model(
  "ConnectRequest",
  connectionRequestSchema
);

module.exports = ConnectRequestModal;
