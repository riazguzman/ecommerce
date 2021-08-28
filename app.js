// Express
const express = require("express");

// morgan (Middleware that prints nicer errors on the console)
const morgan = require("morgan");

// body-parser (Middleware that parses HTTP Request body so that it can be accessed).
const bodyParser = require("body-parser");

// cookie-parser (Middleware that parses HTTP Request cookie field so that it can be accessed).
const cookieParser = require("cookie-parser");

// express-validator (Middleware that wraps app.js in functions that can be used to validate inputs).
const expressValidator = require("express-validator");

// Saves the variables in .env file to process.env.
require("dotenv").config();

// Instance of express() which includes all the functions such as .get, .use, .post etc. for creating a server.
const app = express();

// Routes which is abstracted to another folder.
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");

// db connects to db using db.connect()
require("./config/db");

// Middlewars
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// Routes
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);

const port = process.env.PORT || 8000;

// Server now continues to listen on PORT 8000.
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
