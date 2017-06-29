module.exports = function(telegram, slack) {
 telegram.on('message_received', function(bot, message) {
   var slackBot = slack.spawn({})
 })
  
}