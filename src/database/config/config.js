const config = require("../../utils/config");
module.exports = {
  development: {
    username: config.dev_db_username,
    password: config.dev_db_password,
    database: config.dev_db_database,
    host: config.dev_db_host,
    dialect: 'postgres',
    port: config.dev_db_port || 5432,
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false,
    //   },
    // },
  },

  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres',
  },

  production: {
    username: config.prod_db_username,
    password: config.prod_db_password,
    database: config.prod_db_database,
    host: config.prod_db_host,
    dialect: 'postgres',
    port: config.prod_db_port || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
