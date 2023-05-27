const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("login page");
});
router.post("/", (req, res) => {
  res.send("login request");
});

module.exports = router;
