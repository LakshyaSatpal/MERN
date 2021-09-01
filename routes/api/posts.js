const express = require("express");
const router = express.Router();

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  public
router.get("/test", (req, res) => {
  // res.json() is used to send json data to front end
  res.json({
    message: "Posts works",
  });
});

module.exports = router;
