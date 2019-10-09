const ENV = process.env.NODE_ENV || 'development';

const dbconfig = {
  development: {
    client: 'pg',
    connection: {
      database: 'mitchs_rare_treasures',
      username: 'emilychaplais',
      password: 'password'
    },
    seeds: {
      directory: './db'
    }
  },
  test: {
    client: 'pg',
    connection: {
      database: 'mitchs_rare_treasures_test',
      username: 'emilychaplais',
      password: 'password'
    },
    seeds: {
      directory: './db'
    }
  }
};

module.exports = dbconfig[ENV];
