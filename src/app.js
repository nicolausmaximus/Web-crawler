var https = require('follow-redirects').https;
//to maintain maximum 5 concurrent requests
require('events').EventEmitter.prototype._maxListeners = 5;
var scrapeData = require('../public/crawldata')
const url = "https://stackoverflow.com/questions?tab=Active";

var request = https.get(url, function(response) {
    scrapeData(url);
});