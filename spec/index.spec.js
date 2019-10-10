process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const { mapItems } = require('../utils/map-items');
const request = require('supertest');
const { app } = require('../app');
const chai_sorted = require('chai-sorted');
chai.use(chai_sorted);

describe('util functions', () => {
  describe('mapItems', () => {
    it('returns an empty array when given an empty array', () => {
      expect(mapItems([])).to.eql([]);
    });
    it('returns one object in an array with the owner name changed to id, when passed one object', () => {
      const shopData = [
        { shop_name: 'shop-b', owner: 'firstname-b', slogan: 'slogan-b' }
      ];
      const ownerData = [{ owner_id: '1', forename: 'firstname-b' }];
      const output = [
        { shop_name: 'shop-b', slogan: 'slogan-b', owner_id: '1' }
      ];
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
    it('should not mutate the original data', () => {
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
      mapItems(shops, treasures, 'shop_id', 'shop_name', 'shop');

      expect(treasures).to.eql([
        { treasure_name: 'treasure-b', shop: 'shop-b', treasure_weight: '400' },
        {
          treasure_name: 'treasure-c',
          shop: 'shop-c'
        }
      ]);
    });
  });
});
describe('endpoints', () => {
  describe('/api', () => {
    describe('/treasures', () => {
      describe('GET', () => {
        it('Status 200: should successfully connect to endpoint', () => {
          return request(app)
            .get('/api/treasures')
            .expect(200);
        });
        it('Status 200: should return an array of treasures', () => {
          return request(app)
            .get('/api/treasures')
            .expect(200)
            .then(({ body }) => {
              expect(body.treasures).to.be.an('array');
              expect(body.treasures[0]).to.be.an('object');
            });
        });
        it('Status 200: should contain necessary keys', () => {
          return request(app)
            .get('/api/treasures')
            .expect(200)
            .then(({ body }) => {
              expect(body.treasures[0]).to.contain.keys(
                'treasure_id',
                'treasure_name',
                'colour',
                'age',
                'cost_at_auction'
              );
            });
        });
        it('Status 200: should NOT have a shop_id key, and instead, a shop_name key', () => {
          return request(app)
            .get('/api/treasures')
            .expect(200)
            .then(({ body }) => {
              expect(body.treasures[0]).to.not.contain.key('shop_id');
              expect(body.treasures[0]).to.contain.key('shop_name');
            });
        });
        it('Status 200: should sort by auction cost ASC by default', () => {
          return request(app)
            .get('/api/treasures')
            .expect(200)
            .then(({ body }) => {
              expect(body.treasures).to.be.sortedBy('cost_at_auction');
            });
        });
        it('Status 200: should accept a user-provided sort-key', () => {
          return request(app)
            .get('/api/treasures?sort_by=age')
            .expect(200)
            .then(({ body }) => {
              expect(body.treasures).to.be.sortedBy('age');
            });
        });
        it('Status 200: should be able to pick asc or desc', () => {
          return request(app)
            .get('/api/treasures?order_by=desc')
            .expect(200)
            .then(({ body }) => {
              expect(body.treasures).to.be.sortedBy('cost_at_auction', {
                descending: true
              });
            });
        });
      });
    });
  });
});
