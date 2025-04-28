// Import required packages
const { App } = require('@slack/bolt');
require('dotenv').config();

// Initialize your Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listen for app_mention events
app.event('app_mention', async ({ event, say }) => {
  try {
    console.log('App mention received:', event);
    
    await say({
      text: `Hello <@${event.user}>! I'm your Social Media Content Calendar bot.`,
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Hello <@${event.user}>! I'm your Social Media Content Calendar bot.`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "I can help you manage your social media calendar. What would you like to do today?"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "• View upcoming posts\n• Add new content ideas\n• Check posting schedule\n• Generate content suggestions"
          }
        }
      ]
    });
  } catch (error) {
    console.error('Error handling app_mention event:', error);
  }
});

// Start the app
(async () => {
  try {
    const port = process.env.PORT || 3000;
    await app.start(port);
    console.log(`⚡️ Social Media Calendar app is running on port ${port}!`);
  } catch (error) {
    console.error('Error starting the app:', error);
    process.exit(1);
  }
})();