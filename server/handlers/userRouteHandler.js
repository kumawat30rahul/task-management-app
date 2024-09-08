const {
  createSuccessResponse,
  createErrorResponse,
  createConnectionErrorResponse,
} = require("../utils/responseHandler");
const UserManger = require("../managers/UserManager");
const {
  validateUserRegistrationFields,
  validateLoginFields,
} = require("../utils/validation");

const UserRouteHandler = {
  async createUser(req, res) {
    try {
      const validationResult = validateUserRegistrationFields(req?.body); //validate user registration fields
      if (validationResult) return res.send(validationResult);
      const user = await UserManger.createUser(req.body);
      if (user) {
        return res.send(
          createSuccessResponse({
            statusCode: 201,
            message: "User created successfully",
            status: "SUCCESS",
            data: {},
          })
        );
      }
    } catch (error) {
      return res.send(
        createErrorResponse({
          statusCode: 500,
          message: error?.message,
          status: "ERROR",
          error: error,
        })
      );
    }
  },

  async loginUser(req, res) {
    const validationResult = validateLoginFields(req?.body); //validate user fields
    if (validationResult) return res.send(validationResult);
    try {
      const user = await UserManger.loginUser(req.body);
      if (user) {
        return res.send(
          createSuccessResponse({
            message: "User logged in successfully",
            data: user,
          })
        );
      }
    } catch (error) {
      return res.send(
        createErrorResponse({
          statusCode: error?.statusCode || 500,
          message: error?.message || "Failed to login user",
          status: error?.status || "ERROR",
          error: error?.error || error,
        })
      );
    }
  },

  async googleLogin(req, res) {
    try {
      const user = await UserManger.googleLogin(req.body);
      if (user) {
        return res.send(
          createSuccessResponse({
            statusCode: 200,
            message: "User logged in successfully",
            status: "SUCCESS",
            data: user,
          })
        );
      }
    } catch (error) {
      return res.send(
        createErrorResponse({
          statusCode: error?.statusCode || 500,
          message: error?.message || "Failed to login user",
          status: error?.status || "ERROR",
          error: error?.error,
        })
      );
    }
  },

  async getUserById(req, res) {
    const { userId } = req.params;
    if (!userId) {
      return res.send(
        createErrorResponse({
          statusCode: 400,
          message: "User Id is required",
          status: "ERROR",
          error: {},
        })
      );
    }
    try {
      const user = await UserManger.getUserById(userId);
      if (user) {
        return res.send(
          createSuccessResponse({
            statusCode: 200,
            message: "User fetched successfully",
            status: "SUCCESS",
            data: user,
          })
        );
      }
    } catch (error) {
      return res.send(
        createErrorResponse({
          statusCode: 500,
          message: "Failed to get user",
          status: "ERROR",
          error: error,
        })
      );
    }
  },

  async updateLogo(req, res) {
    const { userId } = req.body;
    const imagFile = req.file;
    console.log({ imagFile });

    if (!userId || !imagFile) {
      return res.send(
        createErrorResponse({
          statusCode: 400,
          message: "User Id and Image is required",
          status: "ERROR",
          error: "Invalid Request Data",
        })
      );
    }
    try {
      console.log("entered");

      const user = await UserManger.updateLogo(userId, imagFile);
      console.log("finished");

      if (user) {
        return res.send(
          createSuccessResponse({
            statusCode: 200,
            message: "User logo updated successfully",
            status: "SUCCESS",
            data: user,
          })
        );
      }
    } catch (error) {
      return res.send(
        createErrorResponse({
          statusCode: 500,
          message: "Failed to update user logo",
          status: "ERROR",
          error: error,
        })
      );
    }
  },
};

module.exports = UserRouteHandler;
