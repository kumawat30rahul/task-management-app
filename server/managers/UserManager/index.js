const idFieldCreator = require("../../utils/idCreator");
const User = require("../../modals/userModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserManger = {
  async createUser(data) {
    const userId = await idFieldCreator("U", User, "userId");
    try {
      const hashedPassword = await bcrypt.hash(
        data?.password,
        Number(process.env.SALT_ROUNDS)
      );
      const user = User({
        userId: userId,
        email: data?.email,
        firstName: data?.firstName,
        lastName: data?.lastName,
        logo: data?.logo,
        password: hashedPassword,
        createdAt: new Date(),
      });

      await user.save();
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async loginUser(loginData) {
    try {
      const user = await User.findOne({ email: loginData?.email });
      if (!user) {
        const data = {
          statusCode: 400,
          message: "Invalid Email",
          status: "ERROR",
          error: "Invalid request data",
        };
        return Promise.reject(data);
      }

      const isMatch = await bcrypt.compare(loginData?.password, user?.password);
      if (!isMatch) {
        const data = {
          statusCode: 400,
          message: "Wrong Password",
          status: "ERROR",
          error: "Invalid request data",
        };
        return Promise.reject(data);
      }

      const loginToken = jwt.sign(
        {
          loginTime: new Date(),
          userName: user?.firstName + " " + user?.lastName,
          email: user?.email,
          userId: user?.userId,
        },
        process.env.AT_SCECRET_KEY
      );

      const data = {
        user: {
          userName: user?.firstName + " " + user?.lastName,
          email: user?.email,
          userId: user?.userId,
        },
        at: loginToken,
      };
      return Promise.resolve(data);
    } catch (err) {
      const error = {
        statusCode: 500,
        message: "Failed to login user",
        status: "ERROR",
        error: err,
      };
      return Promise.reject(error);
    }
  },

  async googleLogin(data) {
    try {
      const decodeGoogleCredential = jwt.decode(
        data?.googleCredential?.credential
      );
      const user = await User.findOne({ email: decodeGoogleCredential?.email });
      if (user) {
        const loginToken = jwt.sign(
          {
            loginTime: new Date(),
            userName: user?.firstName + " " + user?.lastName,
            email: user?.email,
            userId: user?.userId,
          },
          process.env.AT_SCECRET_KEY
        );

        const data = {
          user: {
            userName: user?.firstName + " " + user?.lastName,
            email: user?.email,
            userId: user?.userId,
          },
          at: loginToken,
        };
        if (user.logo === null || user.logo === undefined || user.logo === "") {
          user.logo = decodeGoogleCredential?.picture;
          await user.save();
        }
        return Promise.resolve(data);
      } else {
        const userId = await idFieldCreator("U", User, "userId");
        const user = User({
          userId: userId,
          email: decodeGoogleCredential?.email,
          firstName: decodeGoogleCredential?.given_name,
          lastName: decodeGoogleCredential?.family_name,
          logo: decodeGoogleCredential?.picture,
          createdAt: new Date(),
        });

        await user.save();

        const loginToken = jwt.sign(
          {
            loginTime: new Date(),
            userName: user?.firstName + " " + user?.lastName,
            email: user?.email,
            userId: user?.userId,
            expiry: decodeGoogleCredential?.exp,
          },
          process.env.AT_SCECRET_KEY
        );

        const data = {
          user: {
            userName: user?.firstName + " " + user?.lastName,
            email: user?.email,
            userId: user?.userId,
            isGoogle: true,
          },
          at: loginToken,
        };
        return Promise.resolve(data);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getUserById(userId) {
    try {
      const user = await User.findOne({ userId });
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async updateLogo(userId, logo) {
    try {
      const user = await User.findOneAndUpdate(
        { userId },
        { logo },
        { new: true }
      );
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

module.exports = UserManger;
