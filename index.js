const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

// const authRouter = require("./routes/auth");
// const financeRouter = require("./routes/finance");
// const expenseRouter = require("./routes/expense");
// const incomeRouter = require("./routes/income");

app.use(cors());
app.use(express.json());

// app.use("/api/users", authRouter);
// app.use("/api/users", financeRouter);
// app.use("/api/users", expenseRouter);
// app.use("/api/users", incomeRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
