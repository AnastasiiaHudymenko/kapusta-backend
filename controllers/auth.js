const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ctrlWrapper, handleHttpError } = require("../helpers");
const { User, Session, Finance, Expense } = require("../models");

const register = async (req, res) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw handleHttpError(409, "Email is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    ...req.body,
    password: hashedPassword,
  });

  const user = await User.findOne({ email });

  const newSession = await Session.create({ userId: user._id });

  const token = jwt.sign(
    { id: user._id, sid: newSession._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "25m",
    }
  ); // adding session id to token

  const refreshToken = jwt.sign(
    { id: user._id, sid: newSession._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  ); // creating refresh token
  await User.findByIdAndUpdate(user._id, { token });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/users/refreshToken",
  }); // sending refresh token to client

  res.status(201).json({
    name: user.name,
    email: user.email,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw handleHttpError(401, "Email or password is wrong");

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword)
    throw handleHttpError(401, "Email or password is wrong");

  const newSession = await Session.create({ userId: user._id });

  const token = jwt.sign(
    { id: user._id, sid: newSession._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  const refreshToken = jwt.sign(
    { id: user._id, sid: newSession._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  await User.findByIdAndUpdate(user._id, { token });

  // res.cookie("refreshToken", refreshToken, {
  //   httpOnly: true,
  //   path: "/users/refreshToken",
  // });

  const balance = await Finance.find({ owner: user._id });

  const expense = await Expense.find({ owner: user._id });
  res.json({
    name: user.name,
    email: user.email,
    token,
    balance: balance[0]?.balance ?? [],
    expense,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  const sessionToDelete = await Session.findOne({ userId: _id });

  if (sessionToDelete) {
    await Session.findByIdAndDelete(sessionToDelete._id);
  }

  res.status(204).json({});
};

const refreshToken = async (req, res) => {
  // const { refreshToken } = req.cookies;

  // if (!refreshToken) {
  //   throw handleHttpError(403, "Access denied");
  // }

  const { id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const session = await Session.findOne({ userId: id }); // checking if session exists

  if (!session) {
    throw handleHttpError(403, "Access denied");
  }

  const token = jwt.sign({ id: id, sid: session._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  res.json({ token });
};

const getCurrentUser = async (req, res) => {
  const { _id, name, email } = req.user;

  res.json({
    id: _id,
    name,
    email,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  // update: ctrlWrapper(update),
  // avatarUpdate: ctrlWrapper(avatarUpdate),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  refreshToken: ctrlWrapper(refreshToken),
  // googleAuth: ctrlWrapper(googleAuth),
  // googleAuthRedirect: ctrlWrapper(googleAuthRedirect),
};
