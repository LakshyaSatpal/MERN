const express = require("express");
const router = express.Router();

// @route   GET api/users/test
// @desc    Tests users route
// @access  public
router.get("/test", (req, res) => {
  // res.json() is used to send json data to front end
  res.json({
    message: "Users works",
  });
});

module.exports = router;
