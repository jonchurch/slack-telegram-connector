First remix this project!

Then you will need to create a slack app. Make sure that you are signed into your slack team from the web.

Go [here and create a new slack app](https://api.slack.com/apps?new_app=1).

Name it whatever you want, choose your own team as the development team

Then click on Event Subscriptions from the lefthand menu. Click the button to turn them on.

On the same page, for the request url, enter the url of your glitch project. 
You can copy the url by clicking the dropdown menu in the top left of glitch

Your request url will be `https://<YOUR GLITCH URL>.glitch.me/slack/receive`

Enter your url, and it should say "Verified"

Then we will add team events to listen to. Click Add Team Events and type in `messages.channels`

Click Save Changes

Next, click OAuth and Permissions on the left side menu

Click 'Add new Redirect Ur' and enter your glitch url again but with `/oauth` at the end like `https://<YOUR GLITCH URL>glitch.me/oauth`

Make sure to save the changes!

Then click 'Basic Information' on the left side menu.

Copy Paste your ClientId and ClientSecret into your .env file in your glitch project.

Next, go [here](https://api.slack.com/custom-integrations) and scroll down to click the green 'Setup and Incoming Webhook' button. 

Then click Add Integration. Choose the channel you would like telegram to post in and save the integration. 

Copy Paste the Webhook Url it gives you into your glitch .env file

Now visit your glitch project's url + `/login` like `https:<YOUR GLITCH PROJECT URL>glitch.me/login` and authorize the app with your slack team.

Now you need to setup the telegram bot! After setting your bot up, and turning off privacy mode, copy paste your telegram token into your .env


Enter your telegram webook url in .env with your glitch project url `https://<YOUR GLITCH PROJECT URL>glitch.me/telegram/receive`

Now its a little tricky to get your telegram group id, you need to invite your bot to the group you want it in, and then send a message to the group. You will have to check the logs of your glitch project to see the chat id.

After sending a telegram message to the group, look for this in your logs:

`=====GOT MESSAGE FROM TELEGRAM CHANNEL: -238789099` 

Copy the number (it may or may not be a negative number)

Paste it into your .env, and you should be ready to go!

