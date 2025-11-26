const express = require("express");
const router = express.Router();
const visitCounterController = require("../controllers/visitCounterController");
const adminAuth = require("../middleware/adminAuth");

router.post("/increment", visitCounterController.increment);
router.get("/", adminAuth, visitCounterController.getCount);

module.exports = router;
