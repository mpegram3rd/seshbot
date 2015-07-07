var unirest = require("unirest");
var config = require('./config.js');
var _ = require('underscore');

// Creates a beer cache
var beerCache = new Object();
beerCache.ttl = config.favsCacheTTL;

exports.pickAFavorite =
    function (untappdUser, callback) {
        var cachedValue = getCachedValue(untappdUser);

        if (untappdUser && !cachedValue) {
            console.log('Cache Miss... calling Untappd for data');
            unirest.get(config.apiBaseURL + "/user/beers/" + untappdUser)
                .header('Accept', 'application/json')
                .query({
                    'limit': 10,
                    'sort': 'highest_rated_you',
                    'client_id': config.clientId,
                    'client_secret': config.clientSecret
                })
                .end(function (response) {
                    cachedValue = favoritesResponseHandler(response);
                    beerCache[untappdUser] = cachedValue;
                    console.log('[key=' + untappdUser + '] Updated Cached Value = ' + JSON.stringify(cachedValue));
                    callback(beerSelector(cachedValue));
                });
        }
        else {
            callback(beerSelector(cachedValue));
        }
};

// Tries to retrieve a cached value.
function getCachedValue(untappdId) {
    var cachedValue = beerCache[untappdId];
    if (cachedValue) {
        if (Date.now() - cachedValue.lastUpdated > beerCache.ttl)
            cachedValue = null;
    }

    return cachedValue;
}

// Caches and returns the list of favorites.
function favoritesResponseHandler(response) {
    var cachedValue = null;

    if (response.statusCode == 200 && response.body.meta.code == 200) {
        cachedValue = new Object();
        cachedValue.lastUpdated = new Date().getTime();
        var beerItems = response.body.response.beers.items;
        var beerData = _.each(beerItems, function(item) {
            _.pick(item, 'beer', 'brewery')
            return item;
        });

//                        var beerData = response.body.response.
        cachedValue.beers = _.map(beerData, function (element) {
            return {
                'beer': element.beer.beer_name,
                'brewery': element.brewery.brewery_name
            };
        });
    }
    else
        console.log('[Untappd Error Response]: ' + response.body);
    return cachedValue;
}

// Selects a beer from the cached value or returns one from the Crappy Beers list.
function beerSelector (cachedValue) {
    var beers = (cachedValue ? cachedValue.beers : crappyBeers);
    return beers[Math.floor(Math.random() * beers.length)];
}

// Crappy beers to randomly choose from if the user can't be found on Untappd.
var crappyBeers =
    [
        {
            beer : 'Coronoa Light',
            brewery : 'Grupo Modelo S.A. de C.V.'
        },
        {
            beer : "Budweiser",
            brewery : "Anheuser-Busch"
        },
        {
            beer : "Miller Lite",
            brewery : "Miller Brewing Company"
        },
        {
            beer : 'Light Beer',
            brewery : 'Kirkland Signature Beer'
        }
    ];
