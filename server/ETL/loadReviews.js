/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
const nReadlines = require('n-readlines');
const { Reviews } = require('../database/db');
require('dotenv').config();

const data = [];
let dataIndex = 0;
const chunkSize = process.env.CHUNKSIZE;
console.log(process.env.CHUNKSIZE);
let line;

const reviewsLines = new nReadlines('./server/ETL/ETLdata/reviews.csv');

line = reviewsLines.next();

async function lineLoop() {
  while (line = reviewsLines.next()) {
    const row = line.toString('ascii').split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    data[dataIndex] = {
      id: Number(row[0]),
      product_id: Number(row[1]),
      rating: Number(row[2]),
      date: Date(row[3]),
      summary: row[4].slice(1, row[4].length - 1),
      body: row[5].slice(1, row[5].length - 1),
      recommend: Boolean(Number(row[6])),
      reported: Boolean(Number(row[7])),
      reviewer_name: row[8].slice(1, row[8].length - 1),
      reviewer_email: row[9].slice(1, row[9].length - 1),
      response: row[10].slice(1, row[10].length - 1),
      helpfulness: Number(row[11]),
    };
    dataIndex++;
    if (dataIndex >= chunkSize) {
      await saveData(data);
      console.log('chunk');
      dataIndex = 0;
    }
  }
  await saveData(data.splice(0, dataIndex));
}

async function saveData(data) {
  const chunk = data.slice(0, chunkSize);
  await Reviews.bulkCreate(chunk);
}

lineLoop();
