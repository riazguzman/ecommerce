const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
require("dotenv").config();

// server
const app = express();

// Routes
const userRouter = require("./routes/user");

// db
require("./config/db");

// Middlewards
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// Routes
app.use("/api", userRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
