const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
  },
  severity: {
    type: String,
    default: "Low",
  },
  taskStatus: {
    type: String,
    default: "TODO",
  },
  expiryDate: {
    type: String,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdByUserId: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
  updatedByUserId: {
    type: String,
  },
  createdAt: {
    type: String,
    default: new Date(),
  },
});

const Task = mongoose.model("task", taskSchema);

module.exports = Task;
