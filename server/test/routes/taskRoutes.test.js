const request = require("supertest");
const express = require("express");
const taskRoutes = require("../../routes/taskRoutes.js");
const Task = require("../../modals/taskModal.js");
const jwt = require("jsonwebtoken");
const idFieldCreator = require("../../utils/idCreator.js");

const app = express();
app.use(express.json());
app.use("/task", taskRoutes);
jest.mock("jsonwebtoken");
jest.mock("../../modals/taskModal.js");
jest.mock("../../utils/idCreator.js");
jest.mock(
  "../../middlewares/apiAuthentication.js",
  () => (req, res, next) => next()
);

describe("Task Routes", () => {
  describe("POST /task/create", () => {
    it("should return a 400 status code if title field is missing", async () => {
      const response = await request(app).post("/task/create").send({
        createdBy: "Rahul Kumawat",
        createdByUserId: "U00001",
      });

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Task Title is required");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });

    it("should return a 400 status code if title is less than 3 character", async () => {
      const response = await request(app).post("/task/create").send({
        taskName: "Th",
        createdBy: "Rahul Kumawat",
        createdByUserId: "U00001",
      });

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe(
        "Task title must be greater than 3 characters"
      );
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });

    it("should return a 400 status code if title is invalid", async () => {
      const response = await request(app).post("/task/create").send({
        taskName: "       ",
        createdBy: "Rahul Kumawat",
        createdByUserId: "U00001",
      });

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Invalid Task Title");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });

    it("should return a 400 status code if createdBy is missing", async () => {
      const response = await request(app).post("/task/create").send({
        taskName: "Something",
        createdByUserId: "U00001",
      });

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Invalid Created User Name");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });
    it("should return a 400 status code if createdById is missing", async () => {
      const response = await request(app).post("/task/create").send({
        taskName: "Somethign",
        createdBy: "Rahul Kumawat",
      });

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Invalid Created User Id");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });

    it("should create tasks", async () => {
      const mockTask = {
        __v: {
          $numberInt: "0",
        },
        _id: {
          $oid: "66dc93c4cd424d9a5460583b",
        },
        taskId: "T00001",
        taskName: "Button ui is not correct",
        taskDescription: "Changed the border radius and color of the button",
        severity: "Low",
        taskStatus: "CLOSED",
        createdBy: "Rahul Kumawat",
        createdByUserId: "U00001",
        createdAt: "Sat Sep 07 2024 23:26:20 GMT+0530 (India Standard Time)",
        // __v: { $numberInt: "0" },
      };

      Task.create.mockResolvedValue(mockTask);
      idFieldCreator.mockResolvedValue("T00001");
      const saveMock = jest.fn().mockResolvedValue(mockTask);
      Task.mockImplementation(() => ({
        save: saveMock,
      }));

      const response = await request(app).post("/task/create").send({
        taskName: "Button ui is not correct",
        taskDescription: "Changed the border radius and color of the button",
        severity: "Low",
        createdBy: "Rahul Kumawat",
        expiryDate: "2024-09-09T18:30:00.000Z",
        createdByUserId: "U00001",
      });

      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBe("Task Successfully Created");
      expect(response.body.status).toBe("SUCCESS");
    }, 50000);
  });
});
