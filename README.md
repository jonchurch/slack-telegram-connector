First remix this project!

Then you will need to create a slack app. Make sure that you are signed into your slack team on the website

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
