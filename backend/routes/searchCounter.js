const express = require("express");
const router = express.Router();
const searchCounterController = require("../controllers/searchCounterController");
const adminAuth = require("../middleware/adminAuth");

router.post("/increment", searchCounterController.increment);
router.get("/", adminAuth, searchCounterController.getCount);

module.exports = router;
