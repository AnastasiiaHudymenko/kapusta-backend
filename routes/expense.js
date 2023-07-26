const express = require("express");
const router = express.Router();
const { validateSchema, authenticate } = require("../middlewares");
const { addExpense } = require("../controllers/expense");
const { expenseSchemaJoi } = require("../models");

router.post(
  "/expense",
  authenticate,
  validateSchema(expenseSchemaJoi),
  addExpense
);

module.exports = router;
