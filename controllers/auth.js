const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ctrlWrapper, handleHttpError } = require("../helpers");
const { User, Session } = require("../models"); // add session from models

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

module.exports = {
  register: ctrlWrapper(register),
  // login: ctrlWrapper(login),
  // logout: ctrlWrapper(logout),
  // update: ctrlWrapper(update),
  // avatarUpdate: ctrlWrapper(avatarUpdate),
  // getCurrentUser: ctrlWrapper(getCurrentUser),
  // refreshToken: ctrlWrapper(refreshToken),
  // googleAuth: ctrlWrapper(googleAuth),
  // googleAuthRedirect: ctrlWrapper(googleAuthRedirect),
};
