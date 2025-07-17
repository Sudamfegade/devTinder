const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSingupData } = require("./utils/validation");
const cors = require("cors");
const cookiesparser = require("cookie-parser");

const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookiesparser());
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const { userRouter } = require("./routes/user");

app.use("/", authRouter, profileRouter, requestRouter, userRouter);
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
