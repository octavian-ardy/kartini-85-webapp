const router = require("express").Router();

// Product routes
router.get("/", (req, res) => {
  res.send("get all product data");
});
router.get("/:id", (req, res) => {
  res.send("get product data");
});
router.post("/", (req, res) => {
  res.send("insert product data");
});
router.put("/:id", (req, res) => {
  res.send("edit product data");
});

module.exports = router;
