const _ = require('lodash');

const mapOwners = (owners, shopData) => {
  if (!owners.length) return [];
  const obj = {};
  owners.forEach((owner, index) => {
    obj[owner.owner_id] = owner.forename;
  });

  const shops = [];
  shopData.forEach(shop => {
    shops.push({ ...shop });
  });

  const invertedOwnerIdObj = _.invert(obj);
  let newShops = shops.map(shop => {
    shop.owner_id = invertedOwnerIdObj[shop.owner];
    delete shop.owner;
    return shop;
  });
  return newShops;
};

module.exports = { mapOwners };
