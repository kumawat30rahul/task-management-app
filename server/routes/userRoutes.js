const express = require("express");
const UserRouteHandler = require("../handlers/userRouteHandler");
const upload = require("../middlewares/multer");

const userRouter = express.Router();

//register user
userRouter.post("/register", UserRouteHandler.createUser);

//login user
userRouter.post("/login", UserRouteHandler.loginUser);

//google login
userRouter.post("/google-login", UserRouteHandler.googleLogin);

//get user by id
userRouter.get("/:userId", UserRouteHandler.getUserById);

//update logo
userRouter.post(
  "/update-logo",
  upload.single("image"),
  UserRouteHandler.updateLogo
);

module.exports = userRouter;
