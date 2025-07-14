const adminAuth = (req, res, next) => {
  console.log("Admin auth is called");
  const token = "xyzi"; //req.body.token
  const isAdminAuth = token === "xyz";
  if (!isAdminAuth) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("user auth is called");
  const token = "xyz"; //req.body.token
  const isAdminAuth = token === "xyz";
  if (!isAdminAuth) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
