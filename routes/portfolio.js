var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var request = require("request")
var express = require('express');
var fs = require("fs")
var path = require("path")
var router = express.Router();
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();


var download = function(url, filename, callback) {
  request.head(url, function(err, res, body) {
    request(url)
      .pipe(
        fs.createWriteStream(
          path.resolve(__dirname, "../data/img/" + filename)
        )
      )
      .on("close", callback);
  });
};


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
  const {
    url,
    name,
    alt,
    category,
    header,
    description
  } = req.body;

  // Validation
  if (
    typeof url !== "string" ||
    typeof name !== "string" ||
    typeof alt !== "string" ||
    typeof category !== "string" ||
    typeof header !== "string" ||
    typeof description !== "string" ||
    url.trim() === "" ||
    name.trim() === "" ||
    alt.trim() === "" ||
    category.trim() === "" ||
    header.trim() === "" ||
    description.trim() === ""
  ) {
    return res.status(400).send("Invalid request data");
  }

  let rawData = fs.readFileSync(
    path.resolve(__dirname, "../data/portfolio.json")
  );

  let array = JSON.parse(rawData);

  // Prevent duplicate filename
  if (array.filter(e => e.name === name).length > 0) {
    return res.send("Object already exists");
  }

  // Download image
  download(url, name, function() {
    console.log(name + " downloaded");
  });

  let newArray = array.concat(req.body);

  fs.writeFileSync(
    path.resolve(__dirname, "../data/portfolio.json"),
    JSON.stringify(newArray)
  );

  res.end();
});


router.delete("/", jsonParser, ensureLoggedIn, function(req, res, next) {
  const { name } = req.body;

  // Validation
  if (
    typeof name !== "string" ||
    name.trim() === ""
  ) {
    return res.status(400).send("Invalid request data");
  }

  let rawData = fs.readFileSync(
    path.resolve(__dirname, "../data/portfolio.json")
  );

  let array = JSON.parse(rawData);

  let newArray = array.filter(e => e.name !== name);

  if (newArray.length === array.length) {
    return res.send("Nothing to delete was found");
  }

  // Delete actual image file
  fs.unlink(
    path.resolve(__dirname, "../data/img/" + name),
    function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log(name + " deleted");
      }
    }
  );

  // Delete metadata
  fs.writeFileSync(
    path.resolve(__dirname, "../data/portfolio.json"),
    JSON.stringify(newArray)
  );

  res.end();
});

module.exports = router;