/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('reviews', '', '', { dialect: 'postgres' });

sequelize.authenticate()
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Connection failed'));

const Reviews = sequelize.define('reviews', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  summary: {
    type: Sequelize.TEXT,
  },
  body: {
    type: Sequelize.TEXT,
  },
  recommend: {
    type: Sequelize.BOOLEAN,
  },
  reported: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  reviewer_name: {
    type: Sequelize.TEXT,
  },
  reviewer_email: {
    type: Sequelize.TEXT,
  },
  response: {
    type: Sequelize.TEXT,
  },
  helpfulness: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

const Photos = sequelize.define('photos', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  url: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});
Photos.belongsTo(Reviews, {
  foreignKey: 'review_id',
});

const Characteristics = sequelize.define('characteristics', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

const Characteristic_reviews = sequelize.define('characteristic_reviews', {

});

sequelize.sync();
