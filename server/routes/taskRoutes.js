const express = require("express");
const TaskRouteHandler = require("../handlers/taskRouteHandler");
const isAuth = require("../middlewares/apiAuthentication");

const taskRouter = express.Router();

//creating task
taskRouter.post("/create", isAuth, TaskRouteHandler.createTask);

//editing task
taskRouter.patch("/edit", isAuth, TaskRouteHandler.editingTask);

//deleting task
taskRouter.post("/delete", isAuth, TaskRouteHandler.deletingTask);

//changing status of task
taskRouter.patch("/update-status", isAuth, TaskRouteHandler.changingStatus);

//getting all tasks
taskRouter.get("/all", isAuth, TaskRouteHandler.getAllTasks);

//getting task by id //
taskRouter.get("/get-task/:taskId", isAuth, TaskRouteHandler.getTaskById);

//searching task by name
taskRouter.get("/search", isAuth, TaskRouteHandler.searchTask);

//sorting according to time
taskRouter.post("/sort", isAuth, TaskRouteHandler.sortTask);

module.exports = taskRouter;
