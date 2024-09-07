const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const isAuth = require("../../middlewares/apiAuthentication");

jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.use("/protected", isAuth, (req, res) => {
  res.status(200).json({ message: "Success" });
});

describe("isAuth Middleware", () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/protected");
    expect(res.body.statusCode).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  it("should return 401 if token is invalid", async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"), null);
    });

    const res = await request(app)
      .get("/protected")
      .set("access_token", "invalid_token");
    expect(res.body.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized Access_token");
  });

  it("should call next if token is valid", async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: "user_id" });
    });

    const next = jest.fn();

    const req = {
      headers: {
        access_token: "valid_token",
      },
    };
    const res = {};

    await isAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
