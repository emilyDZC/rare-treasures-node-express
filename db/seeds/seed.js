const data = require('../data');
const { mapItems } = require('../../utils/map-items');

exports.seed = function(connection, Promise) {
  return connection
    .insert(data.ownerData)
    .into('owners')
    .returning('*')
    .then(insertedOwners => {
      const shops = mapItems(
        insertedOwners,
        data.shopData,
        'owner_id',
        'forename',
        'owner'
      );
      return connection
        .insert(shops)
        .into('shops')
        .returning('*');
    })
    .then(shops => {
      const treasures = mapItems(
        shops,
        data.treasureData,
        'shop_id',
        'shop_name',
        'shop'
      );
      return connection
        .insert(treasures)
        .into('treasures')
        .returning('*');
    });
};
