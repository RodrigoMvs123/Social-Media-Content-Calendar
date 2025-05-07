const { App, ExpressReceiver } = require('@slack/bolt');
require('dotenv').config();
const axios = require('axios');

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver
});

// Listen for App Home opened event
app.event('app_home_opened', async ({ event, client }) => {
  try {
    const userId = event.user;

    // Fetch mock data from backend
    const response = await axios.get('http://localhost:5000/api/calendar');
    const posts = response.data;

    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `👋 Welcome <@${userId}>! Here's your Social Media Content Calendar:`
        }
      },
      {
        type: 'divider'
      },
      ...posts.map(post => ({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${post.platform}*: ${post.content}\n_Scheduled for: ${new Date(post.scheduledTime).toLocaleString()}_`
        }
      })),
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Add New Post'
            },
            action_id: 'add_new_post'
          }
        ]
      }
    ];

    // Publish view to Home tab
    await client.views.publish({
      user_id: userId,
      view: {
        type: 'home',
        callback_id: 'home_view',
        blocks
      }
    });
  } catch (error) {
    console.error('Error rendering app_home_opened:', error);
  }
});

// Add interaction for Add New Post button
app.action('add_new_post', async ({ body, ack, client }) => {
  await ack();

  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'new_post_modal',
      title: {
        type: 'plain_text',
        text: 'Add New Post'
      },
      submit: {
        type: 'plain_text',
        text: 'Submit'
      },
      close: {
        type: 'plain_text',
        text: 'Cancel'
      },
      blocks: [
        {
          type: 'input',
          block_id: 'content_block',
          label: {
            type: 'plain_text',
            text: 'Post Content'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'content_input'
          }
        },
        {
          type: 'input',
          block_id: 'platform_block',
          label: {
            type: 'plain_text',
            text: 'Platform'
          },
          element: {
            type: 'static_select',
            action_id: 'platform_select',
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: 'Twitter'
                },
                value: 'Twitter'
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'LinkedIn'
                },
                value: 'LinkedIn'
              }
            ]
          }
        }
      ]
    }
  });
});

// Handle modal submission
app.view('new_post_modal', async ({ ack, body, view, client }) => {
  await ack();
  
  const user = body.user.id;
  const content = view.state.values.content_block.content_input.value;
  const platform = view.state.values.platform_block.platform_select.selected_option.value;

  // Mock response
  await client.chat_postMessage({
    channel: user,
    text: `✅ New post scheduled on *${platform}*: ${content}`
  });

  // Optionally: send to Flask API
});

(async () => {
  await app.start();
  console.log('⚡️ Social Media Calendar app is running!');
})();

module.exports = receiver.app;
