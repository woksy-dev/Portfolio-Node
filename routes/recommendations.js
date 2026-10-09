var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var express = require('express');
var fs = require("fs")
var path = require("path")
var router = express.Router();
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();


router.get('/', function(req, res, next) {
  var jsonArray = fs.readFileSync(
    path.resolve(__dirname, '../data/recommendations.json'),
    'utf8'
  );

  var parsedArray = JSON.parse(jsonArray);

  res.render('recommendations', {
    array: parsedArray,
    user: req.user || null
  });
});

router.post("/", jsonParser, function(req, res, next) {
  const { avatar, name, role, description } = req.body;

if (
  !Number.isInteger(avatar) ||
  avatar < 1 ||
  avatar > 3 ||
  typeof name !== "string" ||
  typeof role !== "string" ||
  typeof description !== "string"
) {
  return res.status(400).send("Invalid request data");
}
if (name.trim() === "") {
  return res.status(400).send("Invalid request data")
}
if (role.trim() === "") {
  return res.status(400).send("Invalid request data")
}
if (description.trim() === "") {
  return res.status(400).send("Invalid request data")
}
let rawData = fs.readFileSync(
    path.resolve(__dirname, "../data/recommendations.json")
  );
  let array = JSON.parse(rawData);
  let newBody = req.body
  
  if (array.filter(e => e.name === newBody.name).length > 0) {
  return res.send("Object already exists")
  }
  let newArray = array.concat(newBody)
  let jsonArray = JSON.stringify(newArray)
  fs.writeFileSync(
    path.resolve(__dirname, "../data/recommendations.json"), jsonArray
  )
  res.end();
});

router.delete("/", jsonParser, ensureLoggedIn, function(req, res, next) {
  const { name } = req.body;

  if (
    typeof name !== "string" ||
    name.trim() === ""
  ) {
    return res.status(400).send("Invalid request data");
  }

  let rawData = fs.readFileSync(
    path.resolve(__dirname, "../data/recommendations.json")
  );

  let array = JSON.parse(rawData);

  let newArray = array.filter(e => e.name !== name);

  if (newArray.length === array.length) {
    return res.send("Nothing to delete was found");
  }

  fs.writeFileSync(
    path.resolve(__dirname, "../data/recommendations.json"),
    JSON.stringify(newArray)
  );

  res.end();
});

module.exports = router;