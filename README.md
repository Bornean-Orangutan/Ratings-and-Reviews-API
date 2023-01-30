# Questions-and-Answers-API
The Ratings and Reviews API is a collection of endpoints that allow users to retreive and post ratings and reviews related to a specific product. The endpoints work in conjunction with the FEC webpage that displays the product information as a commercial website. In total, there are five endpoints for getting data, posting data, and marking helpful and reported values on the data.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Endpoints](#end-points)
- [Peformance](#performance)
- [Installation](#installation)
- [Contributors](#contributors)

## Tech Stack
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node](https://img.shields.io/badge/-Node-9ACD32?logo=node.js&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/-Express-DCDCDC?logo=express&logoColor=black&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## End Points
* Get Reviews
  * Given a product ID and optional page count information, this endpoint will return a list of reviews for the associated product.
* Get Meta Data
  * Given a product ID, this endpoint will return the associated reviews meta data for a particular product.
* Post Reviews
  * Given a body, name, email, product ID, summary, recommended boolean, and photos this endpoint will create a review and add it to the database.
* Mark Review as Helpful
  * This endpoint will increment the helpful value of a review, whose total can be viewed directly from the webpgage.
* Report Review
  * This will mark a review as reported. Reported reviews are not return by the get request.

## Performance
To allow for 1000 RPS, this API was deployed over 4 different instances: a load balancer instance, and three server and database handling instances. Below are key metric improvements compared to running the endpoints on a single instance. All utilize a throughput of 1000 RPS for 60 seconds.
* Get Reviews
  * 46% to 0% Error Rate
  * 5263 ms to 3 ms Latency
* Get Meta Data
  * 44% to 0% Error Rate
  * 3926 ms to 1 ms Latency
* Post Reviews
  * 39% to 0% Error Rate
  * 3128 ms to 5 ms Latency
* Mark Review as Helpful
  * 25% to 0% Error Rate
  * 2032 ms to 8 ms Latency
* Report Review
  * 32% to 0% Error Rate
  * 2568 ms to 20 ms Latency

## Installation Details

### How to install and use PostgreSQL
#### Installation
* Utilizing Homebrew to install:
```bash
brew install postgresql
```
* Start postgresql service:
```bash
brew services start postegresql
```
* Stop:
```bash
brew services stop postgres
```
* Connect to postgresql: 
```bash
psql postgres
```
* Install dependencies in Repo:
```bash
npm install
```
#### Utilization
* Create a database:
```bash
CREATE DATABASE dbname;
```
* Connect to database
```bash
\c dbname
```
* Read currrent database:
```bash
SELECT current_database();
```
* List all tables:
```bash
\dt
```

## Contributors
<a href="https://github.com/Bornean-Orangutan/Ratings-and-Reviews-API/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Bornean-Orangutan/Ratings-and-Reviews-API" />
</a>
