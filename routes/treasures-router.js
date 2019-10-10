const express = require("express");
const treasuresRouter = express.Router();
const { getTreasures } = require("../controllers/treasures");

treasuresRouter.route("/").get(getTreasures);

module.exports = { treasuresRouter };
