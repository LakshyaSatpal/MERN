const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  public
router.get("/test", (req, res) => {
  // res.json() is used to send json data to front end
  res.json({
    message: "Profile works",
  });
});

// @route   GET api/profile
// @desc    Get current user profile
// @access  private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const errors = {};
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        "user",
        ["name", "avatar"]
      );
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    } catch (e) {
      res.status(404).json(e);
    }
  }
);

// @route   GET api/profile
// @desc    Create or update user profile
// @access  private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    // Skills seperated into an array
    if (typeof req.body.skills != undefined) {
      profileFields.skills = req.body.skills
        .split(",")
        .map((item) => item.trim());
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.linkedin;

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update
        const updatedProfile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        res.json(updatedProfile);
      } else {
        // Create
        // Check if handle exists
        const existing = await Profile.findOne({
          handle: profileFields.handle,
        });
        if (existing) {
          errors.handle = "This user handle already exists";
          return res.status(400).json(errors);
        }

        // Save profile
        const newProfile = await new Profile(profileFields);
        await newProfile.save();
        res.json(newProfile);
      }
    } catch (e) {
      console.log(e);
    }
  }
);

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  public
router.get("/handle/:handle", async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({
      handle: req.params.handle,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      errors.noprofile = "There is no profile with this handle";
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (e) {
    console.log(e);
    res.status(404).json(e);
  }
});

// @route   GET api/profile/user/:userid
// @desc    Get profile by userid
// @access  public
router.get("/user/:userid", async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({
      user: req.params.userid,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      errors.noprofile = "There is no profile with this id";
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (e) {
    console.log(e);
    errors.noprofile = "There is no profile with this id";
    res.status(404).json(errors);
  }
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  public
router.get("/all", async (req, res) => {
  const errors = {};
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    if (!profiles) {
      errors.noprofile = "There are no profiles";
      return res.status(404).json(errors);
    }
    res.json(profiles);
  } catch (e) {
    errors.noprofile = "There are no profiles";
    res.status(404).json(errors);
  }
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const newExp = {};
      if (req.body.title) newExp.title = req.body.title;
      if (req.body.company) newExp.company = req.body.company;
      if (req.body.location) newExp.location = req.body.location;
      if (req.body.from) newExp.from = req.body.from;
      if (req.body.to) newExp.to = req.body.to;
      if (req.body.current) newExp.current = req.body.current;
      if (req.body.description) newExp.description = req.body.description;

      profile.experience.unshift(newExp); // unshift will push the object in the start of the array
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.log(e);
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // Get remove index
      const removeIndex = profile.experience.findIndex(
        (item) => item.id == req.params.exp_id
      );

      profile.experience.splice(removeIndex, 1);

      await profile.save();
      res.json(profile);
    } catch (e) {
      console.log(e);
      res.status(404).json(e);
    }
  }
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const newEducation = {};
      if (req.body.school) newExp.school = req.body.school;
      if (req.body.degree) newExp.degree = req.body.degree;
      if (req.body.fieldofstudy) newExp.fieldofstudy = req.body.fieldofstudy;
      if (req.body.from) newExp.from = req.body.from;
      if (req.body.to) newExp.to = req.body.to;
      if (req.body.current) newExp.current = req.body.current;
      if (req.body.description) newExp.description = req.body.description;

      profile.education.unshift(newEducation); // unshift will push the object in the start of the array
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.log(e);
    }
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // Get remove index
      const removeIndex = profile.education.findIndex(
        (item) => item.id == req.params.edu_id
      );

      profile.education.splice(removeIndex, 1);

      await profile.save();
      res.json(profile);
    } catch (e) {
      console.log(e);
      res.status(404).json(e);
    }
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Profile.findOneAndRemove({ user: req.user.id });
      await User.findOneAndRemove({ _id: req.user.id });
      res.json({ success: true });
    } catch (e) {
      res.status(404).json(e);
    }
  }
);
module.exports = router;
