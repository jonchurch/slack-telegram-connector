module.exports = function(telegram_controller, slack_controller) {
  
  telegram_controller.on('message_received', function(bot, message) {
    bot.reply(message, 'Hello')
    bot.reply(message, 'Hello from Sam')
    
    
  })
  
  telegram_controller.hears('^hi$', 'message_received', function(bot, message) {
    
    bot.startConversation(message, function(err, convo) {
      convo.addMessage('Hi there', 'default')
      
      convo.addQuestion('What is your favorite color?', function(convo, res) {
        convo.say('Your favorite color is ', res.text)
        convo.next()
      })
    
    convo.next()
    })
  })
  
}