const express = require("express");
require("dotenv").config();

// server
const app = express();

// Routes
const userRouter = require("./routes/user");

// db
require("./config/db")

// Routes
app.use("/api", userRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
