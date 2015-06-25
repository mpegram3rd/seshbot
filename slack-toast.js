var Hapi = require('hapi');
var unirest = require("unirest");
var config = require('./config.js');

exports.handler = 
    function(req, reply) {
        var toaster = '<@' + req.payload.user_id + '|' + req.payload.user_name + '>';
        var toastee= req.payload.text;
        var channel_name = "#" + req.payload.channel_name;
        var webhookMessage = {
            text : '*' + toaster + '*'
                    + " has toasted *" 
                    + toastee 
                    +"*\nHave a nice cold _{insert one of your favorite beers from Untappd}_",
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
        reply();
    };


