/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const express = require('express');
require('dotenv').config();
const {
  Reviews, Photos, Characteristics, Characteristic_reviews,
} = require('./database/db');

// set up the app and use express.json to be able to access the req.body
const app = express();
app.use(express.json());

// TODO: set up routes for the various requests that will come in.
// need a get request to reviews
app.get('/reviews', (req, res) => {
  // Reviews.findAll({
  //   where: {
  //     product_id: 32312,
  //   },
  // }).then((data) => {
  //   res.send(data);
  // });
  if (!req.query.product_id) {
    res.sendStatus(424);
  } else if (req.query.sort !== 'newest' && req.query.sort !== 'helpful' && req.query.sort !== 'relevant') {
    res.sendStatus(424);
  } else {
    const { product_id, sort, page = 1 } = req.query;
    const offset = req.query.page - 1 || 0;
    const count = req.query.count || 5;
    Reviews.findAll({
      where: {
        product_id,
        reported: false,
      },
      attributes: [['id', 'review_id'], 'rating', 'summary', 'recommend', 'response', 'body', 'date', 'reviewer_name', 'helpfulness'],
      include: [{
        model: Photos,
        attributes: ['id', 'url'],
      }],
    }).then((data) => {
      res.send({
        product: product_id,
        page,
        count,
        results: data,
      });
    });
  }
});
// get request for meta data.
app.get('/reviews/meta', (req, res) => {
  if (!req.query.product_id) {
    res.sendStatus(424);
  } else {
    const responseObj = {
      product_id: req.query.product_id,
      ratings: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
      recommended: {
        0: 0,
      },
      characteristics: {

      },
    };
    Characteristics.findAll({
      where: {
        product_id: req.query.product_id,
      },
      include: [{
        model: Characteristic_reviews,
        include: [{
          model: Reviews,
          attributes: ['rating', 'recommend'],
        }],
      }],
    })
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          responseObj.characteristics[data[i].name] = { id: data[i].id };
          let value = 0;
          for (let j = 0; j < data[i].characteristic_reviews.length; j++) {
            value += data[i].characteristic_reviews[j].value;
            responseObj.ratings[data[i].characteristic_reviews[j].review.rating]++;
            if (data[i].characteristic_reviews[j].review.recommend) {
              responseObj.recommended[0]++;
            }
          }
          responseObj.characteristics[data[i].name].value = value / data[i].characteristic_reviews.length;
        }
        res.send(responseObj);
      });
  }
});
// use the provess.env to define the port to listen on.
app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);
