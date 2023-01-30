/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
const nReadlines = require('n-readlines');
const { Photos } = require('../database/db');
require('dotenv').config();

const data = [];
let dataIndex = 0;
const chunkSize = process.env.CHUNKSIZE;
console.log(process.env.CHUNKSIZE);
let line;

const reviewsLines = new nReadlines('./server/ETL/ETLdata/reviews_photos.csv');

line = reviewsLines.next();

async function lineLoop() {
  while (line = reviewsLines.next()) {
    const row = line.toString('ascii').split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    data[dataIndex] = {
      id: Number(row[0]),
      review_id: Number(row[1]),
      url: row[2].slice(1, row[2].length - 1),
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
  await Photos.bulkCreate(chunk);
}

lineLoop();
