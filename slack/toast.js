var unirest = require("unirest");
var config = require('./config.js');
var untappd = require('../untappd/untappd-api.js');

exports.handler =
    function(req, reply) {
        var toaster = '<@' + req.payload.user_id + '|' + req.payload.user_name + '>';
        var toastee= normalizeName(req.payload.text);
        var channel_name = "#" + req.payload.channel_name;
        var untappdUser = config.usermap[toastee];
        untappd.pickAFavorite(untappdUser, function(beerInfo) {
            var webhookMessage = {
                text : '*' + toaster + '*'
                + " has toasted *"
                + toastee
                +"*\nHave a nice cold *" + beerInfo.beer
                + "* by *" + beerInfo.brewery + "*",
                channel : channel_name,
                icon_emoji : ":beers:"
            };
            unirest.post(config.webHookURL)
                .header('Accept', 'application/json')
                .send("payload=" + JSON.stringify(webhookMessage))
                .end(function (response) {
                    // Something went wrong.. log it.
                    if (response.statusCode > 200)
                        console.log("[Slack Error Response]: " + response.body);
                });

        });
        reply();
    };

// Makes sure name is converted to lowercase and starts with '@'
function normalizeName(nameIn) {
    var result = nameIn;
    if (result && result.length > 0) {
        result = result.toLowerCase();
        result = (result.charAt(0) == '@' ? result : '@' + result);
    }

    return result;
}