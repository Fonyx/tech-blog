const Sequelize = require('sequelize');
require('dotenv').config();
// https://lo-victoria.com/build-a-mysql-nodejs-crud-app-4-deploying-to-heroku-finale
// https://www.bezkoder.com/deploy-node-js-app-heroku-cleardb-mysql/#Deploy_the_app_to_Heroku
let connection;

if (process.env.JAWSDB_URL) {
    connection = new Sequelize(process.env.JAWSDB_URL);
  } else {
    connection = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
      }
    );
  }

module.exports = connection;