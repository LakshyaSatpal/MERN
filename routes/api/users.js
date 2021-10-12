const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../../models/User");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route   GET api/users/test
// @desc    Tests users route
// @access  public
router.get("/test", (req, res) => {
  // res.json() is used to send json data to front end
  res.json({
    message: "Users works",
  });
});

// @route   POST api/users/register
// @desc    Registe User
// @access  public
router.post("/register", async (req, res) => {
  // get errors object from function imported
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    // check for user same email
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          await newUser.save();
          res.json(newUser);
        });
      });
    }
  } catch (e) {
    console.log(e);
  }
});

// @route   GET api/users/login
// @desc    Login User / Returning jwt token
// @access  public
router.post("/login", async (req, res) => {
  // get errors object from function imported
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    } else {
      // Check Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // User matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        // Sign token
        const token = await jwt.sign(payload, process.env.JWT_KEY, {
          expiresIn: 3600,
        });
        res.json({
          success: true,
          token: `Bearer ${token}`,
        });
      } else {
        errors.password = "Password is incorrect";
        res.status(400).json(errors);
      }
    }
  } catch (e) {
    console.log(e);
  }
});

// @route   GET api/users/current
// @desc    Return current user
// @access  private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
