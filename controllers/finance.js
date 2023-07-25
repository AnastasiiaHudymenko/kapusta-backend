const { Finance } = require("../models");
const { ctrlWrapper, handleHttpError } = require("../helpers");

const addFinance = async (req, res) => {
  const { _id: owner } = req.user;

  const addBalance = await Finance.create({ ...req.body, owner });

  res.status(201).json(addBalance);
};

module.exports = {
  addFinance: ctrlWrapper(addFinance),
};
