module.exports = function(telegram, slack) {
  var slackBot = slack.spawn({ 
     incoming_webhook: {
       url: process.env.slack_webhook_url
  }
})
 telegram.on('message_received', function(bot, message) {
   console.log(message)
   var slack_message = {
     text: message.text,
     username: message.profile.fn + message.profile.ln,
     
   }
   slack_message.username = slack_message.username.toLowerCase()
   console.log(slack_message)
   
   
   slackBot.sendWebhook(slack_message, function(err, res) {
     if (err) console.log('Uh oh!\n', err)
   })
 })
  
}