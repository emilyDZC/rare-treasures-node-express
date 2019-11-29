const { connection } = require("../db/connection");

function fetchTreasureData({ sort_by = "cost_at_auction", order_by }) {
  const order = { asc: "asc", desc: "desc" };
  return connection
    .select(
      "treasures.treasure_id",
      "treasures.treasure_name",
      "treasures.colour",
      "treasures.age",
      "treasures.cost_at_auction",
      "shops.shop_name"
    )
    .from("treasures")
    .join("shops", "treasures.shop_id", "=", "shops.shop_id")
    .orderBy(sort_by, order[order_by])
    .then(result => {
      return result.map(treasure => {
        treasure.cost_at_auction = Number(treasure.cost_at_auction);
        return treasure;
      });
    });
}

function insertTreasure(body) {
  return connection
    .insert(body)
    .into("treasures")
    .returning("*")
    .then(([treasure]) => {
      return treasure;
    });
}

function updateTreasure(id, body) {
  return connection("treasures")
    .where("treasure_id", "=", id)
    .update(body)
    .returning("*")
    .then(([treasure]) => {
      return treasure;
    });
}

function removeTreasure(id) {
  return connection("treasures")
    .where("treasure_id", "=", id)
    .del()
}

module.exports = {
  fetchTreasureData,
  insertTreasure,
  updateTreasure,
  removeTreasure
};
