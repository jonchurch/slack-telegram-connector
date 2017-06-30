module.exports = function(telegram, slack) {
  var slackBot = slack.spawn({ 
     incoming_webhook: {
       url: process.env.slack_webhook_url
  }
})
  var telegramBot = telegram.spawn({})
 telegram.on('message_received', function(bot, message) {
   console.log(message)
   var name = message.profile.fn + ' ' + message.profile.ln
   name = name.toLowerCase() 
   var slack_message = {
      text: message.text,
     username: name,
     footer: '_sent from telegram_'
   }
//    var slack_message = {
//       "attachments": [
//         {
//             "fallback": "Required plain-text summary of the attachment.",
            
//             "author_name": message.profile.fn + message.profile.ln,
//             // "title": name,
//             text: message.text,
//         }
//     ]
//    }
   // console.log(slack_message)
   
   
   slackBot.sendWebhook(slack_message, function(err, res) {
     if (err) console.log('Uh oh!\n', err)
   })
 })
  
  
  slack.on('ambient', function(bot, message) {
    console.log('ambien!')
    // I need to get slack user name to post into telegram
    console.log(message)
    if (!message.username) {
      slack.storage.teams.get(message.team, function(err, team) {
        if (err) {
          console.log('err getting team from db:', err)
          return
        }else if(!team) {
          console.log('team is not setup!')
          return
        } else if (team) {
          console.log('TEAM:', team)
          bot.api.users.info({token: team.access_token, user: message.user}, function(err, res) {
        if (err) {
          console.log('err getting user info:', slack.config)
        } else {
          var user = {
                      id: res.id,
                      username: res.name,
                      is_bot: res.is_bot,
                      real_name: res.profile.real_name
                    }
          var tel_message = {
      channel: process.env.telegram_channel,
      text: '*' + user.username + '*' + ': ' + message.text,
      parse_mode: 'Markdown'
    } 
    telegramBot.say(tel_message)
          slack.storage.users.save(user, function(err) {
            if (err) {console.log(err)}
          })
        }
      })
        }
      })
      
      
    }
    
    var tel_message = {
      channel: process.env.telegram_channel,
      text: '*' + message.username + '*' + ': ' + message.text,
      parse_mode: 'Markdown'
    } 
    telegramBot.say(tel_message)
  })
}