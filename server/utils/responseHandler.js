const createSuccessResponse = ({ statusCode, message, data }) => {
  return {
    statusCode: 200,
    message: message || "Success",
    status: "SUCCESS",
    data: data,
  };
};

const createErrorResponse = ({ statusCode, message, error }) => {
  return {
    statusCode: statusCode || 400,
    message: message || "Failed",
    status: "ERROR",
    error: error,
  };
};

const createConnectionErrorResponse = ({ message, error }) => {
  return {
    statusCode: 500,
    message: message || "Failed",
    status: "ERROR",
    error: error,
  };
};

module.exports = {
  createSuccessResponse,
  createErrorResponse,
  createConnectionErrorResponse,
};
