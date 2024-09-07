const Task = require("../../modals/taskModal");
const idFieldCreator = require("../../utils/idCreator");

const TaskManager = {
  async createTask(taskData) {
    const taskId = await idFieldCreator("T", Task, "taskId");
    const {
      taskName,
      taskDescription,
      severity,
      expiryDate,
      createdBy,
      createdByUserId,
    } = taskData;
    try {
      const task = new Task({
        taskId: taskId,
        taskName: taskName,
        taskDescription: taskDescription?.trim(),
        severity: severity,
        expiryDate: expiryDate,
        createdBy: createdBy,
        createdByUserId: createdByUserId,
        createdAt: new Date(),
      });
      await task.save();
      return Promise.resolve(task);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async editTask(taskData) {
    try {
      const {
        taskId,
        taskName,
        taskDescription,
        severity,
        expiryDate,
        updatedAt,
        updatedBy,
        updatedByUserId,
      } = taskData;
      const updateFields = {
        updatedAt: new Date(),
      };
      if (taskName) updateFields.taskName = taskName;
      if (taskDescription) updateFields.taskDescription = taskDescription;
      if (severity) updateFields.severity = severity;
      if (expiryDate) updateFields.expiryDate = expiryDate;
      if (updatedAt) updateFields.updatedAt = updatedAt;
      if (updatedBy) updateFields.updatedBy = updatedBy;
      if (updatedByUserId) updateFields.updatedByUserId = updatedByUserId;

      const task = await Task.findOneAndUpdate({ taskId }, updateFields, {
        new: true,
      });
      return Promise.resolve(task);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteTask(taskId) {
    try {
      const task = await Task.deleteOne({ taskId });
      return Promise.resolve(task);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async changeStatus(taskData) {
    try {
      const { taskId, taskStatus } = taskData;
      const task = await Task.findOneAndUpdate({ taskId }, { taskStatus });
      return Promise.resolve(task);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getTasks() {
    try {
      const task = await Task.find().sort({ createdAt: -1 });
      return Promise.resolve(task);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getTaskById(taskId) {
    try {
      const task = await Task.findOne({ taskId });
      return Promise.resolve(task);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async searchTask(taskName) {
    try {
      const task = await Task.find({
        taskName: { $regex: taskName, $options: "i" },
      });
      return Promise.resolve(task);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async sortTask(sort) {
    try {
      const tasks = await Task.find();
      let severityOrder = {
        Low: 1,
        Medium: 2,
        High: 3,
      };
      if (sort === "Medium") {
        severityOrder = {
          Low: 1,
          Medium: 3,
          High: 2,
        };
      }

      tasks.sort((a, b) => {
        const severityA = severityOrder[a.severity]; // get the order of severity
        const severityB = severityOrder[b.severity]; // get the order of severity

        if (severityA < severityB) {
          return sort === "Low" ? -1 : 1; // sort in ascending order
        }
        if (severityA > severityB) {
          return sort === "Low" ? 1 : -1; // sort in descending order
        }
        return 0;
      });

      return Promise.resolve(tasks);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

module.exports = TaskManager;
