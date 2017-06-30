
var request = require('request')

var Botkit = require('./lib/Botkit.js');
var debug = require('debug')('botkit:main');
// var os = require('os');

var telegram_controller = Botkit.telegrambot({
  // debug: true,
    access_token: process.env.telegram_token
});
telegram_controller.startTicking()

var slack_options = {
    json_file_store: './.data/',
    clientId: process.env.slack_client_id,
    clientSecret: process.env.slack_client_secret,
    // debug: true,
    incoming_webhook: process.env.slack_webhook_url,
    scopes: ['channels:history', 'users:read'],
};
var slack_controller = Botkit.slackbot(slack_options)
slack_controller.startTicking()
slack_controller.storage.users.save({id: 'test'}, function(err, res) {
  if (err) {
    console.log(err)
  } else {
    console.log('save res ', res)
  }
})

// Set up a simple storage backend for keeping a record of our
// slack app data
require('./components/user_registration.js')(slack_controller);

var webserver = require('./components/express_webserver.js')(telegram_controller, slack_controller);


// var telegram_bot = telegram_controller.spawn({});
request.post('https://api.telegram.org/bot' + process.env.telegram_token + '/setWebhook', {
                form: {
                    url: process.env.webhook_url
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


