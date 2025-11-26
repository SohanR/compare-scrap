const express = require("express");
const router = express.Router();
const visitCounterController = require("../controllers/visitCounterController");

router.post("/increment", visitCounterController.increment);
router.get("/", visitCounterController.getCount);

module.exports = router;
