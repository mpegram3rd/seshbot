var Hapi = require("hapi");
var slackToast = require('./slack-toast.js');

var server = new Hapi.Server();
server.connection({port: 8888});

// JSON response from a POST update.
server.route ({
    path: "/slackbeerbot",
    method: "POST",
    config: {
        handler: slackToast.handler
    }
});

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
    console.log("Slackbot listening @ " + server.info.uri);
});

