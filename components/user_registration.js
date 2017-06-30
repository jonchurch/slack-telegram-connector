var debug = require('debug')('botkit:user_registration');

module.exports = function(controller) {

    /* Handle event caused by a user logging in with oauth */
    controller.on('oauth:success', function(payload) {

        debug('Got a successful login!', payload);
        if (!payload.identity.team_id) {
            debug('Error: received an oauth response without a team id', payload);
        }
        controller.storage.teams.get(payload.identity.team_id, function(err, team) {
            if (err) {
                debug('Error: could not load team from storage system:', payload.identity.team_id, err);
            }

            var new_team = false;
            if (team) {
                team = {
                    id: payload.identity.team_id,
                    createdBy: payload.identity.user_id,
                    url: payload.identity.url,
                    name: payload.identity.team,
                    access_token: payload.access_token
                };
                var new_team= true;
              var testbot = controller.spawn(team)
              console.log('payload.token: ',payload.access_token)
              testbot.api.users.list({token: payload.access_token}, function(err, res) {
                if (err) {
                  console.log('ERROR GETTING USER LIST', err)
                  return
                } 
                if (res) {
                  for (var i = 0; i < res.members.length; i += 1) {
                    var element = res.members[i]
                    var user = {
                      id: element.id,
                      username: element.name,
                      is_bot: element.is_bot,
                      real_name: element.profile.real_name
                    }
                    controller.storage.users.save(user, function(err) {
                      if (err) {
                          console.log('error saving user to db!', err)
                               } else {
                                 console.log('User saved')
                               }
                    })
                  }
                }
                
              })
              
              controller.storage.teams.save(team, function(err, id) {
                        if (err) {
                            debug('Error: could not save team record:', err);
                        } else {
                            if (new_team) {
                                // 
                              controller.trigger('create_team', [testbot, team]);
                            } else {
                                // controller.trigger('update_team', [testbot, team]);
                              controller.trigger('create_team', [testbot, team]);
                            }
                        }
                    });
            }


        });
    });


    controller.on('create_team', function(bot, team) {
      bot.api.users.list({}, function(err, res) {
        if (err) console.log('======ERRR',err)
        console.log('========res',res)
      })

        debug('Team created:', team);

        // Trigger an event that will cause this team to receive onboarding messages
        controller.trigger('onboard', [bot, team]);

    });


    controller.on('update_team', function(bot, team) {

        debug('Team updated:', team);
        // Trigger an event that will establish an RTM connection for this bot
        // controller.trigger('rtm:start', [bot]);

    });

}