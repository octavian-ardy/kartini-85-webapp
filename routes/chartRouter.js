const router = require("express").Router();

// Chart routes
router.get("/:chartId", (req, res) => {
  res.send("get chart data");
});
router.post("/", (req, res) => {
  res.send("insert item to chart");
});
router.put("/:chartId", (req, res) => {
  res.send("edit item in an chart");
});

module.exports = router;
