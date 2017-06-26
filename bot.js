
var request = require('request')

var Botkit = require('./lib/Botkit.js');
var debug = require('debug')('botkit:main');
// var os = require('os');

var telegram_controller = Botkit.telegrambot({
    debug: true,
    access_token: process.env.telegram_token
});

var slack_controller = {}//Botkit.slackbot({})

var webserver = require(__dirname + '/components/express_webserver.js')(telegram_controller, slack_controller);

// var telegram_bot = telegram_controller.spawn({});
request.post('https://api.telegram.org/bot' + process.env.telegram_token + '/setWebhook', {
                form: {
                    url: process.env.webhook_url + 'telegram/receive'
                }
            },
            function(err, res, body) {
                if (err) {
                   console.log('Could not set webhook with Telegram');
                } else {
                    console.log('Successfully setup Telegram webhook', body);
                    
                }
            });


var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(telegram_controller, slack_controller);
});
