var Botkit = require(__dirname + '/CoreBot.js');
var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');

function Telegrambot(configuration) {

    // Create a core botkit bot
    var telegram_botkit = Botkit(configuration || {});

    // customize the bot definition, which will be used when new connections
    // spawn!
    telegram_botkit.defineBot(function(botkit, config) {

        var bot = {
            botkit: botkit,
            config: config || {},
            utterances: botkit.utterances,
        };

        bot.startConversation = function(message, cb) {
            botkit.startConversation(this, message, cb);
        };

        bot.send = function(message, cb) {

            var telegram_message = {
                chat_id: {},
                text: {}
            };

            telegram_message.chat_id = message.channel;

            if (message.text) {
                telegram_message.text = message.text;
            }

            if (message.parse_mode) {
                telegram_message.parse_mode = message.parse_mode;
            }

            if (message.disable_web_preview) {
                telegram_message.disable_web_preview = message.disable_web_preview;
            }

            if (message.disable_notification) {
                telegram_message.disable_notification = message.disable_notification;
            }

            if (message.reply_message_id) {
                telegram_message.reply_message_id = message.reply_message_id;
            }

            if (message.reply_markup) {
                telegram_message.reply_markup = message.reply_markup;
            }


            request({
                    method: 'POST',
                    json: true,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: telegram_message,
                    uri: 'https://api.telegram.org/bot' + configuration.access_token + '/sendMessage'
                },
                function(err, res, body) {


                    if (err) {
                        botkit.debug('WEBHOOK ERROR', err);
                        return cb && cb(err);
                    }

                    if (body.error) {
                        botkit.debug('API ERROR', body.error);
                        return cb && cb(body.error.message);
                    }

                    botkit.debug('WEBHOOK SUCCESS', body);
                    cb && cb(null, body);
                });
        };

        bot.reply = function(src, resp, cb) {
            var msg = {};

            if (typeof(resp) == 'string') {
                msg.text = resp;
            } else {
                msg = resp;
            }

            msg.channel = src.channel;
            bot.say(msg, cb);
        };

        bot.findConversation = function(message, cb) {
            botkit.debug('CUSTOM FIND CONVO', message.user, message.channel);
            for (var t = 0; t < botkit.tasks.length; t++) {
                for (var c = 0; c < botkit.tasks[t].convos.length; c++) {
                    if (
                        botkit.tasks[t].convos[c].isActive() &&
                        botkit.tasks[t].convos[c].source_message.user == message.user
                    ) {
                        botkit.debug('FOUND EXISTING CONVO!');
                        cb(botkit.tasks[t].convos[c]);
                        return;
                    }
                }
            }

            cb();
        };

        bot.editMessageText = function(message, cb) {
            var telegram_message = {
                chat_id: message.chat_id,
                text: message.text
            };

            if (message.message_id) {
                telegram_message.message_id = message.message_id;
            }

            if (message.inline_message_id) {
                telegram_message.inline_message_id = message.inline_message_id;
            }

            if (message.parse_mode) {
                telegram_message.parse_mode = message.parse_mode;
            }

            if (message.disable_web_preview) {
                telegram_message.disable_web_preview = message.disable_web_preview;
            }

            if (message.reply_markup) {
                telegram_message.reply_markup = message.reply_markup;
            }

            request({
                method: 'POST',
                json: true,
                headers: {
                    'content-type': 'application/json',
                },
                body: telegram_message,
                uri: 'https://api.telegram.org/bot' + configuration.access_token + '/editMessageText'
            },
            function(err, res, body) {


                if (err) {
                    botkit.debug('WEBHOOK ERROR', err);
                    return cb && cb(err);
                }

                if (body.error) {
                    botkit.debug('API ERROR', body.error);
                    return cb && cb(body.error.message);
                }

                botkit.debug('WEBHOOK SUCCESS - EDITED MESSAGE', body);
                cb && cb(null, body);
            });

        };

        bot.answerCallbackQuery = function(message, cb) {
          var telegram_message = {
              callback_query_id: message.callback_query_id
          };

          if (message.text) {
            telegram_message.text = message.text;
          }

          if (message.show_alert) {
              telegram_message.show_alert = message.show_alert;
          }

          if (message.url) {
              telegram_message.url = message.url;
          }

          request({
              method: 'POST',
              json: true,
              headers: {
                  'content-type': 'application/json',
              },
              body: telegram_message,
              uri: 'https://api.telegram.org/bot' + configuration.access_token + '/answerCallbackQuery'
          },
          function(err, res, body) {


              if (err) {
                  botkit.debug('WEBHOOK ERROR', err);
                  return cb && cb(err);
              }

              if (body.error) {
                  botkit.debug('API ERROR', body.error);
                  return cb && cb(body.error.message);
              }

              botkit.debug('WEBHOOK SUCCESS - ANSWER CALLBACK QUERY SENT', body);
              cb && cb(null, body);
          });

        }



        // Need to specify recipient of game, either a single user's id or the chat_id of target conversation
        bot.sendGame = function(message, cb) {
            var telegram_message = {
                chat_id: message.chat_id,
                game_short_name: message.game_short_name
            };

            if (message.reply_to_message_id) {
              telegram_message.reply_to_message_id = message.reply_to_message_id;
            }

            if (message.disable_notification) {
                telegram_message.disable_notification = message.disable_notification;
            }

            if (message.reply_markup) {
                telegram_message.reply_markup = message.reply_markup;
            }

            request({
                method: 'POST',
                json: true,
                headers: {
                    'content-type': 'application/json',
                },
                body: telegram_message,
                uri: 'https://api.telegram.org/bot' + configuration.access_token + '/sendGame'
            },
            function(err, res, body) {


                if (err) {
                    botkit.debug('WEBHOOK ERROR', err);
                    return cb && cb(err);
                }

                if (body.error) {
                    botkit.debug('API ERROR', body.error);
                    return cb && cb(body.error.message);
                }

                botkit.debug('WEBHOOK SUCCESS - GAME SENT', body);
                cb && cb(null, body);
            });

        };

        return bot;

    });



	
telegram_botkit.handleWebhookPayload = function(req, bot) {
            telegram_botkit.debug('GOT A MESSAGE HOOK');
            var telegram_message = req.body;
            if (telegram_message.message) {

                var message = {
                    text: telegram_message.message.text,
                    user: telegram_message.message.from.id,
                    channel: telegram_message.message.from.id,
                    timestamp: telegram_message.message.date,
                };

                if (telegram_message.update_id) {
                    message.update_id = telegram_message.update_id;
                }

                if (telegram_message.message.message_id) {
                    message.message_id = telegram_message.message.message_id;
                }

                if (telegram_message.message.forward_from) {
                    message.forward_from = telegram_message.message.forward_from;
                }

                if (telegram_message.message.forward_from_chat) {
                    message.forward_from_chat = telegram_message.message.forward_from_chat;
                }

                if (telegram_message.message.forward_from_date) {
                    message.forward_from_date = telegram_message.message.forward_from_date;
                }

                if (telegram_message.message.reply_to_message) {
                    message.reply_to_message = telegram_message.message.reply_to_message;
                }

                if (telegram_message.message.entities) {
                    message.entities = telegram_message.message.entities;
                }

                if (telegram_message.message.document) {
                    message.document = telegram_message.message.document;
                }

                if (telegram_message.message.photo) {
                    message.photo = telegram_message.message.photo;
                }

                if (telegram_message.message.sticker) {
                    message.sticker = telegram_message.message.sticker;
                }

                if (telegram_message.message.video) {
                    message.video = telegram_message.message.video;
                }

                if (telegram_message.message.voice) {
                    message.voice = telegram_message.message.voice;
                }

                if (telegram_message.message.caption) {
                    message.caption = telegram_message.message.caption;
                }

                if (telegram_message.message.contact) {
                    message.contact = telegram_message.message.contact;
                }

                if (telegram_message.message.location) {
                    message.location = telegram_message.message.location;
                }

                if (telegram_message.message.venue) {
                    message.venue = telegram_message.message.venue;
                }

                telegram_botkit.receiveMessage(bot, message);

            } else if (telegram_message.callback_query) {

                var message = {
                    // Telegram uses a field called data not payload
                    // Default to the way facebook messenger names it
                    payload: telegram_message.callback_query.data,
                    user: telegram_message.callback_query.from.id,
                    channel: telegram_message.callback_query.from.id,
                    callback_id: telegram_message.callback_query.id,
                    parent_message: telegram_message.callback_query.message,
                };

                telegram_botkit.trigger('telegram_postback', [bot, message]);

                var message = {
                    text: telegram_message.callback_query.data,
                    user: telegram_message.callback_query.from.id,
                    channel: telegram_message.callback_query.from.id,
                    timestamp: telegram_message.callback_query.message.date,
                    callback_id: telegram_message.callback_query.id,
                    parent_message: telegram_message.callback_query.message
                };

                telegram_botkit.receiveMessage(bot, message);

            } else {
                telegram_botkit.log('Got an unexpected message from Telegram: ', telegram_message);
            }

            res.send('ok');
}
    // set up a web route for receiving outgoing webhooks and/or slash commands
    telegram_botkit.createWebhookEndpoints = function(webserver, bot, cb) {

        telegram_botkit.log(
            '** Serving webhook endpoints for Slash commands and outgoing ' +
            'webhooks at: http://MY_HOST:' + telegram_botkit.config.port + '/telegram/receive');
        webserver.post('/telegram/receive', function(req, res) {
        
		telegram_botkit.handleWebhookPayload(req)	
			res.status(200).send('ok')
		});

        if (cb) {
            cb();
        }

        return telegram_botkit;
    };

    telegram_botkit.setupWebserver = function(port, cb) {

        if (!port) {
            throw new Error('Cannot start webserver without a port');
        }
        if (isNaN(port)) {
            throw new Error('Specified port is not a valid number');
        }

        telegram_botkit.config.port = port;

        telegram_botkit.webserver = express();
        telegram_botkit.webserver.use(bodyParser.json());
        telegram_botkit.webserver.use(bodyParser.urlencoded({
            extended: true
        }));
        telegram_botkit.webserver.use(express.static(__dirname + '/public'));

        var server = telegram_botkit.webserver.listen(
            telegram_botkit.config.port,
            function() {
                telegram_botkit.log('** Starting webserver on port ' +
                    telegram_botkit.config.port);
                if (cb) {
                    cb(null, telegram_botkit.webserver);
                }
            });


        request.post('https://api.telegram.org/bot' + configuration.access_token + '/setWebhook', {
                form: {
                    url: configuration.webhook_url + 'telegram/receive'
                }
            },
            function(err, res, body) {
                if (err) {
                    telegram_botkit.log('Could not set webhook with Telegram');
                } else {
                    telegram_botkit.debug('Successfully setup Telegram webhook', body);
                    telegram_botkit.startTicking();
                }
            });

        return telegram_botkit;

    };

    return telegram_botkit;
};

module.exports = Telegrambot;
