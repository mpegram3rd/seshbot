var Hapi = require("hapi");
var slackToast = require('./slack/toast.js');

var server = new Hapi.Server();

server.connection({port: 8888});

// JSON response from a POST update.
server.route ({
    path: "/seshbot/toast",
    method: "POST",
    config: {
        handler: slackToast.handler
    }
});

// Looks like we're not going to need this... stubbed for now.
server.route ({
    path: "/seshbot/oauth-callback",
    method: "GET",
    handler: function (req, reply) {
        console.log('OAUTH CALLBACK:');
        console.log(JSON.stringify(req.query));
        reply("thanks");
    }
})

// Simple logging
server.on("log", function (event, tags) {
    var tagsJoined = Object.keys(tags).join();
    var message = event.data;
    console.log("Log entry [" + tagsJoined + "] (" + (message || "") + ")");
});

// Log Requests
server.on('request', function (request, event, tags) {
    console.log("Route: " + request.path );

});

// Notify if anything really bad happens
server.on('internalError', function (request, error) {
    console.log ('Internal Error on path: ' + request.path + ' caused by: ' + error.message);
});

// Log the listen URL
server.start(function() {
    console.log("Seshbot listening @ " + server.info.uri);
});

