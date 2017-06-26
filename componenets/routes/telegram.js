var debug = require('debug')('botkit:telegram');
var request = require('request')

module.exports = function(webserver, telegram_controller, slack_controller) {

  webserver.get('/test', function(req, res) { res.send('ok')})
  
    debug('Configured POST /telegram/receive url for receiving events');
    webserver.post('/telegram/receive', function(req, res) {
      
      

        // NOTE: we should enforce the token check here
        
        // respond to Slack that the webhook has been received.
        res.status(200);
        res.send('ok');
      
      // log any requests that hit our webhook post route
     // we are hoping to see telegram events there
        console.log('INCOMING REQUEST BODY!', req.body)
        var bot = telegram_controller.spawn({});

        // Now, pass the webhook into be processed
        telegram_controller.handleWebhookPayload(req, bot);

    });

   

}