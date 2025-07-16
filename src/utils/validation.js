const validator = require("validator");

const validateSingupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Nmae is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email is not valid!");
  }
};

module.exports = { validateSingupData };
