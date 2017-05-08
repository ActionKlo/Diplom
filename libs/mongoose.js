var config = require('../config');
var mongoose = require('mongoose');

mongoose.connect(config.get("mongoose:url"));

module.exports = mongoose;