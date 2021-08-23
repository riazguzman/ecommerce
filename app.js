const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// server
const app = express();

// Routes
const userRouter = require("./routes/user");

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"));

// Routes
app.use("/api", userRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
