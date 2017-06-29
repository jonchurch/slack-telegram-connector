  var express = require('express');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var debug = require('debug')('botkit:webserver');

module.exports = function(telegram_controller, slack_controller, bot) {


    var webserver = express();
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));

    webserver.use(express.static('public'));


    webserver.listen(process.env.PORT || 3000, null, function() {

        console.log('Express webserver configured and listening at http://localhost:' + process.env.PORT || 3000);

    });
  webserver.use(function(req, res, next) {
    if (req.body && req.body.event && req.body.event.user) {
      console.log('user ',req.body.event.user)
      slack_controller.storage.users.get(req.body.event.user, function(err, user) {
        if (err) {
          console.log('storage error getting user!', err)
          next(err)
        } else if (!user) {
          //api call to get user from slack
          next()
        } else {
          console.log('=========user' ,user)
        }
        next()
      })
    }
  })
  
  webserver.use(function(req, res, next) {
    if (req.body && req.body.event && req.body.event.user) {
      if (! req.body.event.username) {
        slack_controller.
      }
    }
  })

    // import all the pre-defined routes that are present in /components/routes
    var normalizedPath = require("path").join(__dirname, "routes");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
      require("./routes/" + file)(webserver, telegram_controller, slack_controller);
    });

  telegram_controller.webserver = webserver;
  slack_controller.webserver = webserver

    return webserver;

}
