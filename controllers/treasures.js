const { fetchTreasureData } = require('../models/treasures')

function getTreasures(req, res, next) {
// responds with all treasures, including the shop name and details
// each treasure should have the following keys:
// treasure_id
// treasure_name
// colour
// age
// cost_at_auction
// shop_name
fetchTreasureData();


}

module.exports = { getTreasures };