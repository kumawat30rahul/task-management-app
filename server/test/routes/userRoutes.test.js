const request = require("supertest");
const express = require("express");
const userRoutes = require("../../routes/userRoutes.js");

const app = express();
app.use(express.json());
app.use("/user", userRoutes);

describe("User Routes", () => {
  describe("POST /user/register", () => {
    it("should return a 400 status code if fields are missing", async () => {
      const response = await request(app).post("/user/register");
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("All fields are required");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });

    it("should return a 400 status code if full name field is missing", async () => {
      const response = await request(app).post("/user/register").send({
        lastName: "Thakur",
        email: "nikhil.thakur19@gmail.com",
        password: "NikhilT@2023",
        confirmedPassword: "NikhilT@2023",
      });
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("First Name is required");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });

    it("should return a 400 status code if last name field is missing", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "Nikhil",
        email: "nikhil.thakur19@gmail.com",
        password: "NikhilT@2023",
        confirmedPassword: "NikhilT@2023",
      });
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Last Name is required");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });
    it("should return a 400 status code if email field is missing", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "Nikhil",
        lastName: "Thakur",
        //   email: "nikhil.thakur19@gmail.com",
        password: "NikhilT@2023",
        confirmedPassword: "NikhilT@2023",
      });
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Email is required");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });
    it("should return a 400 status code if password field is missing", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "Nikhil",
        lastName: "Thakur",
        email: "nikhil.thakur19@gmail.com",
        // password: "NikhilT@2023",
        confirmedPassword: "NikhilT@2023",
      });
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Password is required");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });
    it("should return a 400 status code if confirm password field is missing", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "Nikhil",
        lastName: "Thakur",
        email: "nikhil.thakur19@gmail.com",
        password: "NikhilT@2023",
        //   confirmedPassword: "NikhilT@2023",
      });
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Confirmed Password is required");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });
  });
});
