const express = require("express");
const router = express.Router();
const { aiSearch } = require("../controllers/aiPropertyController");

router.post("/ai-search", aiSearch);

module.exports = router;
