const { Income } = require("../models");
const { ctrlWrapper, handleHttpError } = require("../helpers");

const addIncome = async (req, res) => {
  const { _id: owner } = req.user;

  const addIncome = await Income.create({ ...req.body, owner });

  res.status(201).json(addIncome);
};

module.exports = {
  addIncome: ctrlWrapper(addIncome),
};
