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
    console.log(page);
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
// use the provess.env to define the port to listen on.
app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);
