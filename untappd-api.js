var unirest = require("unirest");
var config = require('./config.js');

exports.pickAFavorite =
    function (untappdId, callback) {
        var beers = untappd_user_info[untappdId];
        if (!beers) {
            beers = untappd_user_info['UNDEFINED'];
        }
        var selectedBeer = Math.floor(Math.random() * beers.length);
        callback(beers[selectedBeer]);
    };

var untappd_user_info = config.beerInfo;
