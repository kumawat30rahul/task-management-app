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

  if (firstName?.length < 3) {
    return createErrorResponse({
      statusCode: 400,
      message: "Firstname should be more that 2 characters",
      error: "Invalid request data",
    });
  }

  if (firstName.trim() === "") {
    return createErrorResponse({
      statusCode: 400,
      message: "Provide Proper First Name",
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

  if (lastName.trim() === "") {
    return createErrorResponse({
      statusCode: 400,
      message: "Provide Proper Last Name",
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

  if (!validateEmail(email)) {
    return createErrorResponse({
      statusCode: 400,
      message: "Invalid Email",
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

  if (password?.length < 7) {
    return createErrorResponse({
      statusCode: 400,
      message: "Password should be atleast 8 characters long",
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

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = { validateUserRegistrationFields, validateLoginFields };
