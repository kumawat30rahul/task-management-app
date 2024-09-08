const request = require("supertest");
const express = require("express");
const userRoutes = require("../../routes/userRoutes.js");
const User = require("../../modals/userModal.js");
const idFieldCreator = require("../../utils/idCreator.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use("/user", userRoutes);

jest.mock("../../modals/userModal.js");
jest.mock("../../utils/idCreator.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

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

    it("should return a 400 status code if full name is less than 3 characters", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "th",
        lastName: "Thakur",
        email: "nikhil.thakur19@gmail.com",
        password: "NikhilT@2023",
        confirmedPassword: "NikhilT@2023",
      });
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe(
        "Firstname should be more that 2 characters"
      );
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    }, 30000);

    it("should return a 400 status code if full name is invalid", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "    ",
        lastName: "Thakur",
        email: "nikhil.thakur19@gmail.com",
        password: "NikhilT@2023",
        confirmedPassword: "NikhilT@2023",
      });
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Provide Proper First Name");
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

    it("should return a 400 status code if password is too short", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "Nikhil",
        lastName: "Thakur",
        email: "nikhil.thakur19@gmail.com",
        password: "short1", // Too short password
        confirmedPassword: "short1",
      });

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe(
        "Password should be atleast 8 characters long"
      );
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });

    it("should return a 400 status code if password contains invalid characters", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "Nikhil",
        lastName: "Thakur",
        email: "nikhil.thakur19@gmail.com",
        password: "Inva<>{{}(", // Invalid characters
        confirmedPassword: "Invalid<>Pass",
      });

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Invalid Password");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    }, 30000);

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
    it("should return a 400 status code if confirm password and password does not match", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "Nikhil",
        lastName: "Thakur",
        email: "nikhil.thakur19@gmail.com",
        password: "NikhilT@2023",
        confirmedPassword: "NikhilT@223",
      });
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Passwords do not match");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });

    it("should create user successfully", async () => {
      const mockUser = {
        _id: { $oid: "669b5649ccd3633d77ee4c43" },
        userId: "U00001",
        email: "rahul005kumawat@gmail.com",
        firstName: "Rahul",
        lastName: "Kumawat",
        password:
          "$2b$13$pnUGcryfozBaxQL3GNo4EOyC18Dwj8UgSW9Cg7DlNC67kW./LIgBu",
        __v: { $numberInt: "0" },
        createdAt: "Sun Jul 21 2024 19:02:52 GMT+0530 (India Standard Time)",
        logo: "https://lh3.googleusercontent.com/a/ACg8ocK80F3KAx9RBKJp-ke0w3aFaX1PjG9xhboOJ1WlH-OTC7FLBQDy=s96-c",
      };

      // Mock the User.create method
      User.create.mockResolvedValue(mockUser);
      idFieldCreator.mockResolvedValue("U00001");
      const saveMock = jest.fn().mockResolvedValue(mockUser);
      User.mockImplementation(() => ({
        save: saveMock,
      }));

      const response = await request(app).post("/user/register").send({
        email: "rahul005kumawat@gmail.com",
        firstName: "Rahul",
        lastName: "Kumawat",
        password: "NikhilT@2023",
        confirmedPassword: "NikhilT@2023",
      });

      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBe("User created successfully");
      expect(response.body.status).toBe("SUCCESS");
    }, 50000);
  });

  describe("POST /user/login", () => {
    it("should return a 400 status code if fields are missing", async () => {
      const response = await request(app).post("/user/login");
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("All fields are required");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });

    it("should return a 400 status code if email is missing", async () => {
      const response = await request(app).post("/user/login").send({
        email: "",
        password: "NikhilT@2023",
      });
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe("Email is required");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid request data");
    });

    it("should return 401 if password does not match", async () => {
      const mockUser = {
        _id: { $oid: "669b5649ccd3633d77ee4c43" },
        userId: "U00001",
        email: "rahul005kumawat@gmail.com",
        firstName: "Rahul",
        lastName: "Kumawat",
        password:
          "$2b$13$pnUGcryfozBaxQL3GNo4EOyC18Dwj8UgSW9Cg7DlNC67kW./LIgBu",
        __v: { $numberInt: "0" },
        createdAt: "Sun Jul 21 2024 19:02:52 GMT+0530 (India Standard Time)",
        logo: "https://lh3.googleusercontent.com/a/ACg8ocK80F3KAx9RBKJp-ke0w3aFaX1PjG9xhboOJ1WlH-OTC7FLBQDy=s96-c",
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      // Act
      const response = await request(app).post("/user/login").send({
        email: "rahul005kumawat@gmail.com",
        password: "incorrectPassword",
      });

      // Assert
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBe("Wrong Password");
      expect(response.body.status).toBe("ERROR");
      expect(response.body.error).toBe("Invalid Credentials");
    });

    it("POST /user/login should log in user successfully", async () => {
      const mockUser = {
        _id: { $oid: "669b5649ccd3633d77ee4c43" },
        userId: "U00001",
        email: "rahul005kumawat@gmail.com",
        firstName: "Rahul",
        lastName: "Kumawat",
        password:
          "$2b$13$pnUGcryfozBaxQL3GNo4EOyC18Dwj8UgSW9Cg7DlNC67kW./LIgBu",
        __v: { $numberInt: "0" },
        createdAt: "Sun Jul 21 2024 19:02:52 GMT+0530 (India Standard Time)",
        logo: "https://lh3.googleusercontent.com/a/ACg8ocK80F3KAx9RBKJp-ke0w3aFaX1PjG9xhboOJ1WlH-OTC7FLBQDy=s96-c",
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const mockToken = "mocked.jwt.token";
      jwt.sign.mockReturnValue(mockToken);

      const response = await request(app).post("/user/login").send({
        email: "rahul005kumawat@gmail.com",
        password: "UIdsf @199",
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User logged in successfully");
      expect(response.body.status).toBe("SUCCESS");
      expect(response.body.data).toEqual({
        user: {
          userName: "Rahul Kumawat",
          email: "rahul005kumawat@gmail.com",
          userId: "U00001",
        },
        at: mockToken,
      });
    });
  });
});
