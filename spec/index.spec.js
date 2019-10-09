const { expect } = require('chai');
const { mapItems } = require('../utils/map-items');

describe('mapItems', () => {
  it('returns an empty array when given an empty array', () => {
    expect(mapItems([])).to.eql([]);
  });
  it('returns one object in an array with the owner name changed to id, when passed one object', () => {
    const shopData = [
      { shop_name: 'shop-b', owner: 'firstname-b', slogan: 'slogan-b' }
    ];
    const ownerData = [{ owner_id: '1', forename: 'firstname-b' }];
    const output = [{ shop_name: 'shop-b', slogan: 'slogan-b', owner_id: '1' }];
    expect(
      mapItems(ownerData, shopData, 'owner_id', 'forename', 'owner')
    ).to.eql(output);
  });
  it('returns an array of objects when given multiple objects', () => {
    const shopData = [
      { shop_name: 'shop-b', owner: 'firstname-b' },
      {
        shop_name: 'shop-c',
        owner: 'firstname-c'
      }
    ];
    const ownerData = [
      { owner_id: '1', forename: 'firstname-b' },
      { owner_id: '2', forename: 'firstname-c' }
    ];
    const output = [
      { shop_name: 'shop-b', owner_id: '1' },
      { shop_name: 'shop-c', owner_id: '2' }
    ];
    expect(
      mapItems(ownerData, shopData, 'owner_id', 'forename', 'owner')
    ).to.eql(output);
  });
  it('works for objects other than shops', () => {
    const treasures = [
      { treasure_name: 'treasure-b', shop: 'shop-b', treasure_weight: '400' },
      {
        treasure_name: 'treasure-c',
        shop: 'shop-c'
      }
    ];
    const shops = [
      { shop_id: '1', shop_name: 'shop-b', shop_type: 'butcher' },
      { shop_id: '2', shop_name: 'shop-c' }
    ];
    const output = [
      { treasure_name: 'treasure-b', shop_id: '1', treasure_weight: '400' },
      { treasure_name: 'treasure-c', shop_id: '2' }
    ];
    expect(mapItems(shops, treasures, 'shop_id', 'shop_name', 'shop')).to.eql(
      output
    );
  });
});
