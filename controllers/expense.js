const { Expense } = require("../models");
const { ctrlWrapper, handleHttpError } = require("../helpers");

const addExpense = async (req, res) => {
  const { _id: owner } = req.user;

  const addExpense = await Expense.create({ ...req.body, owner });

  res.status(201).json(addExpense);
};

module.exports = {
  addExpense: ctrlWrapper(addExpense),
};
