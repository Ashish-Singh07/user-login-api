var express = require("express");
var router = express.Router();

/* Home Page */
router.get("/", (req, res, next) => {
  return res.json({ 'msg': "Not implemented yet" });
});

module.exports = router;
