const express = require("express");
const router = express.Router();

const {
  schemas: { registerSchema, loginSchema },
} = require("../models/user");
const { validateSchema, authenticate } = require("../middlewares");
const {
  register,
  login,
  logout,
  // update,
  // avatarUpdate,
  // getCurrentUser,
  // refreshToken,
  // googleAuth,
  // googleAuthRedirect,
} = require("../controllers/auth");

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
// router.get("/current", authenticate, getCurrentUser);
router.post("/logout", authenticate, logout);

// router.patch("/", authenticate, validateSchema(updateSchema), update);
// router.patch(
//   "/avatar",
//   authenticate,
//   uploadCloud.single("avatarImage"),
//   avatarUpdate
// );

// router.post("/refreshToken", authenticate, refreshToken);

// router.get("/google", googleAuth);
// router.get("/google-redirect", googleAuthRedirect);

module.exports = router;
