require("dotenv").config();
const debug = require("debug")("app:startup");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const Joi = require("joi");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled..");
}

app.get("/", (req, res) => {
  res.send("test");
});

// init router
const loginRouter = require("./routes/loginRouter");
const registerRouter = require("./routes/registerRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const chartRouter = require("./routes/chartRouter");
const transactionRouter = require("./routes/transactionRouter");

// use router
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/chart", chartRouter);
app.use("/api/transaction", transactionRouter);

// admin page
// including:
// - ack user
// - set item
// - receive transaction
// - add manual transaction

// Error handling undefined path
app.all("*", (req, res) => {
  res.status(404).send({ error: "Path is not found." });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
