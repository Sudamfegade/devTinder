const validator = require("validator");

const validateSingupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Nmae is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email is not valid!");
  }
};

const validateEditData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "photoUrl", "age"];
  const isEditAllowed = Object.keys(req).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const validateEditPass = (req) => {
  const allowedEditFields = ["password"];
  const isEditAllowed = Object.keys(req).every((field) =>
    allowedEditFields.includes(field)
  );
  if (!validator.isStrongPassword(req.body.password)) {
    throw new Error("Enter a Strong Password: " + value);
  }
  return isEditAllowed;
};
module.exports = { validateSingupData, validateEditData, validateEditPass };
