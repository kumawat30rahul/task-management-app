const jwt = require("jsonwebtoken");
const { createErrorResponse } = require("../utils/responseHandler");

const isAuth = (req, res, next) => {
  const token = req.headers["access_token"];

  if (!token) {
    return res.send(
      createErrorResponse({
        statusCode: 401,
        message: "No token provided",
        status: "ERROR",
      })
    );
  }

  jwt.verify(token, process.env.AT_SCECRET_KEY, (err, decoded) => {
    if (err) {
      return res.send(
        createErrorResponse({
          statusCode: 401,
          message: "Unauthorized Access_token",
          status: "ERROR",
          error: err,
        })
      );
    }

    req.user = decoded;
    next();
  });
};

module.exports = isAuth;
