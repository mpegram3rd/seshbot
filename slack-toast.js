var Hapi = require('hapi');
var unirest = require("unirest");
var config = require('./config.js');
var untappd = require('./untappd-api.js');

exports.handler =
    function(req, reply) {
        var toaster = '<@' + req.payload.user_id + '|' + req.payload.user_name + '>';
        var toastee= req.payload.text;
        var channel_name = "#" + req.payload.channel_name;
        var untappdId = config.usermap[req.payload.text];
        untappd.pickAFavorite(untappdId, function(beerInfo){
            var webhookMessage = {
                text : '*' + toaster + '*'
                + " has toasted *"
                + toastee
                +"*\nHave a nice cold " + beerInfo.beer
                + " by " + beerInfo.brewery,
                channel : channel_name,
                icon_emoji : ":beers:"
            };
            console.log(JSON.stringify(webhookMessage));
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