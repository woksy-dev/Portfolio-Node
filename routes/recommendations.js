var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('recommendations');
});

module.exports = router;