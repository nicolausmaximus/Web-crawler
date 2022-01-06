var https = require('follow-redirects').https;
require('events').EventEmitter.prototype._maxListeners = 5;
var scrapeData = require('./crawldata')
const url = "https://stackoverflow.com/questions?tab=Active";

var request = https.get(url, function(response) {
    scrapeData(url);
});