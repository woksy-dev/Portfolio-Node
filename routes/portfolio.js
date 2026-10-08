var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var express = require('express');
var fs = require("fs")
var path = require("path")
var router = express.Router();


router.get('/', function(req, res, next) {
  var jsonArray = fs.readFileSync(
  path.resolve(__dirname, '../data/portfolio.json'),
  'utf8'
);
  var parsedArray = JSON.parse(jsonArray)
  res.render('portfolio',{
    cakes: parsedArray
  });
});

router.post("/", jsonParser, function(req, res, next) {
  let rawData = fs.readFileSync(
    path.resolve(__dirname, "../data/portfolio.json")
  );
  let array = JSON.parse(rawData);
  let newBody = req.body
  if (array.filter(e => e.name === newBody.name).length > 0) {
  return res.send("Object already exists")
  }
    
  let newArray = array.concat(newBody)
  let jsonArray = JSON.stringify(newArray)
  fs.writeFileSync(
    path.resolve(__dirname, "../data/portfolio.json"), jsonArray
  )
  res.end();
});

router.delete("/", jsonParser, function(req, res, next) {
  let rawData = fs.readFileSync(
    path.resolve(__dirname, "../data/portfolio.json")
  );

  let array = JSON.parse(rawData);
  let newArray = array.filter(e => e.name !== req.body.name)
  if (newArray.length === array.length) {
    return res.send("Nothing to delete was found")
  }
  let jsonArray = JSON.stringify(newArray)
  fs.writeFileSync(
    path.resolve(__dirname, "../data/portfolio.json"), jsonArray
  )
  res.end();
});

module.exports = router;