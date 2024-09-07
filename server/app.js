const express = require("express");
const dbConnection = require("./db");
const userRouter = require("./routes/userRoutes");
const cors = require("cors");
const taskRouter = require("./routes/taskRoutes");

const app = express();

//server middlewares
app.use(express.json()); //parse application/json
app.use(express.urlencoded({ extended: true })); //parse application/x-www-form-urlencoded

//cors options
const corsoptions = {
  origin: [
    "http://localhost:5173/",
    "http://localhost:5173",
    "https://tast-management-application.vercel.app/",
    "https://tast-management-application.vercel.app",
  ], // restrict calls to those this address
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsoptions));

//env variables
const port = process.env.PORT || 3000;

//db connection
dbConnection()
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log({ err });
  });

//routes
app.use("/user", userRouter);
app.use("/task", taskRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
