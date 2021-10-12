const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  public
router.get("/test", (req, res) => {
  // res.json() is used to send json data to front end
  res.json({
    message: "Posts works",
  });
});

// @route   POST api/posts
// @desc    Create post
// @access  private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    try {
      const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
      });
      const result = await newPost.save();
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Kuch to gadbad h" });
    }
  }
);

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (e) {
    res.status(404).json(e);
  }
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (e) {
    res.status(404).json(e);
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }); // Logged in User
      const post = await Post.findById(req.params.id); // Contains info of post owner
      // Check for post owner
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ unauthorized: "User not authorized" });
      }

      await post.remove();
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }); // Logged in User
      const post = await Post.findById(req.params.id); // Contains info of post owner

      const isLiked = post.likes.findIndex(
        (item) => item.user.toString() === req.user.id
      );

      if (isLiked === -1) {
        post.likes.push({ user: req.user.id });

        await post.save();

        res.json(post);
      } else {
        return res
          .status(400)
          .json({ alreadyLiked: "User already liked this post" });
      }
    } catch (e) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }); // Logged in User
      const post = await Post.findById(req.params.id); // Contains info of post owner

      const isLiked = post.likes.findIndex(
        (item) => item.user.toString() === req.user.id
      );

      if (isLiked === -1) {
        return res.status(400).json({ notLiked: "Not liked" });
      } else {
        post.likes.splice(isLiked, 1);

        await post.save();

        res.json(post);
      }
    } catch (e) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

// @route   POST api/posts/comment/:id
// @desc    Comment on post
// @access  private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    try {
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save().then((post) => res.json(post));
    } catch {
      res.status(404).json({ nopost: "No post found" });
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a Comment on post
// @access  private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const removeIndex = post.comments.findIndex(
        (item) => item._id.toString() === req.params.comment_id
      );
      if (removeIndex !== -1) {
        post.comments.splice(removeIndex, 1);
        await post.save().then((post) => res.json(post));
      } else {
        return res
          .status(404)
          .json({ nocomment: "No comment exists with this id" });
      }
    } catch {
      res.status(404).json({ nopost: "No post found" });
    }
  }
);

module.exports = router;
