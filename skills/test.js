module.exports = function(telegram_controller, slack_controller) {
  
  telegram_controller.on('message_received', function(bot, message) {
    bot.reply(message, 'Hello')
  })
  
}