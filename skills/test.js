module.exports = function(telegram, slack) {
  var slackBot = slack.spawn({ 
     incoming_webhook: {
       url: process.env.slack_webhook_url
  }
})
 telegram.on('message_received', function(bot, message) {
   
   slackBot.sendWebhook(, function(err, res) {
     if (err) console.log('Uh oh!\n', err)
   })
 })
  
}