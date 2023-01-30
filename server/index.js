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
  if (!req.query.product_id) {
    res.sendStatus(424);
  } else if (req.query.sort !== 'newest' && req.query.sort !== 'helpful' && req.query.sort !== 'relevant') {
    res.sendStatus(424);
  } else {
    const { product_id, sort, page = 1 } = req.query;
    const offset = req.query.page - 1 || 0;
    const count = req.query.count || 5;
    Reviews.findAll({
      limit: count,
      offset,
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
      }],
    })
      .then((data) => {
        let charObj;
        for (let i = 0; i < data.length; i++) {
          charObj = data[i];
          responseObj.characteristics[charObj.name] = { id: charObj.id, value: 0 };
          for (let j = 0; j < charObj.characteristic_reviews.length; j++) {
            responseObj.characteristics[charObj.name].value += charObj.characteristic_reviews[j].value;
          }
        }
        return Reviews.findAll({
          where: {
            product_id: req.query.product_id,
          },
          attributes: ['rating', 'recommend'],
        });
      })
      .then((data) => {
        data.forEach((review) => {
          responseObj.ratings[review.rating]++;
          if (review.recommend) {
            responseObj.recommended[0]++;
          }
        });
        res.send(responseObj);
      });
  }
});

// app.post('/reviews', (req, res) => {
//   if (req.body.product_id && req.body.rating && req.body.summary && req.body.body && req.body.recommend && req.body.name && req.body.email && req.body.photos && req.body.characteristics) {
//     // change the database to add the necessary information.
//     Reviews.create({
//       product_id: req.body.product_id,
//       rating: req.body.rating,
//       summary: req.body.summary,
//       body: req.body.body,
//       recommend: req.body.recommend,
//       reviewer_name: req.body.name,
//       reviewer_email: req.body.email,
//     })
//       .then((data) => {
//         res.sendStatus(204);
//       });
//   } else {
//     res.sendStatus(500);
//   }
// });
app.post('/reviews', (req, res) => {
  // redo this because now it's not working.
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  if (req.params.review_id) {
    Reviews.findOne({
      where: {
        id: 100000,
      },
    })
      .then((val) => Reviews.update({
        helpfulness: val.helpfulness + 1,
      }, {
        where: { id: req.params.review_id },
      })
        .then((response) => {
          res.sendStatus(204);
        }));
  } else {
    res.sendStatus(500);
  }
});

app.put('/reviews/:review_id/report', (req, res) => {
  if (req.params.review_id) {
    Reviews.update(
      {
        reported: true,
      },
      {
        where: { id: req.params.review_id },
      },
    )
      .then((val) => res.sendStatus(204));
  } else {
    res.sendStatus(500);
  }
});
// use the provess.env to define the port to listen on.
app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);
