const express = require("express");

const app = express();
app.get("/user", (req, res) => {
  res.send({ firstName: "Sudam" });
});

app.post("/user", (req, res) => {
  res.send("User created.");
});

app.delete("/user", (req, res) => {
  res.send("User deleted.");
});

// app.use("/Hello", (req, res) => {
//   res.send("new helo");
// });
// app.use("/", (req, res) => {
//   res.send("hello");
// });

app.listen(3000, () => console.log("server is listening on port 3000..."));
