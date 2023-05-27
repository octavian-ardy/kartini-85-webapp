const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("get all user transaction");
});
router.get("/:transId", (req, res) => {
  res.send("get user transaction");
});
router.post("/", (req, res) => {
  res.send("checkout chart");
});
router.put("/:transId", (req, res) => {
  res.send("set status of a transaction");
});

module.exports = router;
