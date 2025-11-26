const express = require("express");
const router = express.Router();
const searchCounterController = require("../controllers/searchCounterController");

router.post("/increment", searchCounterController.increment);
router.get("/", searchCounterController.getCount);

module.exports = router;
