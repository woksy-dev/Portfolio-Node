var express = require('express');
var fs = require('fs')

var path = require('path')
var router = express.Router();


router.get('/', function(req, res, next) {
var jsonArray = fs.readFileSync(
  path.resolve(__dirname, '../data/introductionArray.json'),
  'utf8'
);
var jsonRecommendations = fs.readFileSync(
  path.resolve(__dirname, '../data/recommendations.json'),
  'utf8'
);
var jsonPortfolio = fs.readFileSync(
  path.resolve(__dirname, '../data/portfolio.json'),
  'utf8'
);
  var parsedArray = JSON.parse(jsonArray)
  var parsedRecommendations = JSON.parse(jsonRecommendations)
  var parsedPortfolio = JSON.parse(jsonPortfolio)
  res.render('index',{
    array: parsedArray,
    recommendations: parsedRecommendations,
    portfolio: parsedPortfolio
  });
});

module.exports = router;
