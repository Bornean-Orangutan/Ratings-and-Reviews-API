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
    unique: false,
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: false,
  },
  date: {
    type: Sequelize.TEXT,
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
    defaultValue: null,
  },
  helpfulness: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    unique: false,
  },
}, { timestamps: false, indexes: [{ fields: ['product_id'] }] });

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
}, { timestamps: false, indexes: [{ fields: ['review_id'] }] });
Photos.belongsTo(Reviews, {
  foreignKey: 'review_id',
});
Reviews.hasMany(Photos, {
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
    unique: false,
  },
  name: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
}, { timestamps: false, indexes: [{ fields: ['product_id'] }] });

const Characteristic_reviews = sequelize.define('characteristic_reviews', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  value: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: false,
  },
}, { timestamps: false, indexes: [{ fields: ['characteristic_id'] }] });
Characteristic_reviews.belongsTo(Characteristics, {
  foreignKey: 'characteristic_id',
});
Characteristics.hasMany(Characteristic_reviews, {
  foreignKey: 'characteristic_id',
});
Characteristic_reviews.belongsTo(Reviews, {
  foreignKey: 'review_id',
});
Reviews.hasMany(Characteristic_reviews, {
  foreignKey: 'review_id',
});

sequelize.sync();

module.exports = {
  Reviews, Photos, Characteristics, Characteristic_reviews,
};
