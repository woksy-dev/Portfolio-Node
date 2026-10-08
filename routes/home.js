var express = require('express');
var fs = require('fs')

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json()

var path = require('path')
var router = express.Router();


router.get('/', function(req, res, next) {
  var jsonArray = fs.readFileSync(
  path.resolve(__dirname, '../data/introductionArray.json'),
  'utf8'
);
  var parsedArray = JSON.parse(jsonArray)
  res.render('home',{
    array: parsedArray
  });
});

router.post("/", jsonParser, function(req, res, next) {
  let rawData = fs.readFileSync(
    path.resolve(__dirname, "../data/introductionArray.json")
  );

  let array = JSON.parse(rawData);
  let newBody = req.body.newText
  let newArray = array.concat(newBody)
  let jsonArray = JSON.stringify(newArray)
  fs.writeFileSync(
    path.resolve(__dirname, "../data/introductionArray.json"), jsonArray
  )
  res.end();
});

router.delete("/", jsonParser, function(req, res, next) {
  let rawData = fs.readFileSync(
    path.resolve(__dirname, "../data/introductionArray.json")
  );

  let array = JSON.parse(rawData);
  let newArray = array.filter(e => e !== req.body.deletedText)
  let jsonArray = JSON.stringify(newArray)
  fs.writeFileSync(
    path.resolve(__dirname, "../data/introductionArray.json"), jsonArray
  )
  res.end();
});





module.exports = router;
