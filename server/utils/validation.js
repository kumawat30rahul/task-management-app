const { createErrorResponse } = require("./responseHandler");

const passwordChecker = (password) => {
  const validPattern = /^[a-zA-Z0-9!@#$%^&*.,?{}|<>]+$/;
  if (password.length > 7 && validPattern.test(password)) {
    return true;
  } else {
    return false;
  }
};
const validateUserRegistrationFields = (body) => {
  const { firstName, lastName, email, password, confirmedPassword } = body;
  if (!email && !password && !confirmedPassword && !firstName && !lastName) {
    return createErrorResponse({
      statusCode: 400,
      message: "All fields are required",
      error: "Invalid request data",
    });
  }

  if (!firstName) {
    return createErrorResponse({
      statusCode: 400,
      message: "First Name is required",
      error: "Invalid request data",
    });
  }

  if (firstName?.length < 2) {
    return createErrorResponse({
      statusCode: 400,
      message: "Firstname should be more that 2 letters",
    });
  }

  if (firstName.trim() === "") {
    return createErrorResponse({
      statusCode: 400,
      message: "Provide Proper First Name",
      error: "Invalid request data",
    });
  }

  if (lastName.trim() === "") {
    return createErrorResponse({
      statusCode: 400,
      message: "Provide Proper Last Name",
      error: "Invalid request data",
    });
  }

  if (!lastName) {
    return createErrorResponse({
      statusCode: 400,
      message: "Last Name is required",
      error: "Invalid request data",
    });
  }

  if (!email) {
    return createErrorResponse({
      statusCode: 400,
      message: "Email is required",
      error: "Invalid request data",
    });
  }

  if (!password) {
    return createErrorResponse({
      statusCode: 400,
      message: "Password is required",
      error: "Invalid request data",
    });
  }

  if (!passwordChecker(password)) {
    return createErrorResponse({
      code: 400,
      message: "Invalid Password",
      error: "Invalid request data",
    });
  }

  if (!confirmedPassword) {
    return createErrorResponse({
      statusCode: 400,
      message: "Confirmed Password is required",
      error: "Invalid request data",
    });
  }

  if (password !== confirmedPassword) {
    return createErrorResponse({
      statusCode: 400,
      message: "Passwords do not match",
      error: "Invalid request data",
    });
  }
};

const validateLoginFields = (body) => {
  const { email, password } = body;
  if (!email && !password) {
    return createErrorResponse({
      statusCode: 400,
      message: "All fields are required",
      error: "Invalid request data",
    });
  }

  if (!email) {
    return createErrorResponse({
      statusCode: 400,
      message: "Email is required",
      error: "Invalid request data",
    });
  }

  if (!password) {
    return createErrorResponse({
      statusCode: 400,
      message: "Password is required",
      error: "Invalid request data",
    });
  }
};

module.exports = { validateUserRegistrationFields, validateLoginFields };
