const router = require("express").Router();

// Register routes
router.get("/", (req, res) => {
  res.send("register page");
});

module.exports = router;
