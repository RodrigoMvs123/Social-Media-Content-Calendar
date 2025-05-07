from flask import Flask, request, jsonify
from slack_sdk import WebClient
from slack_sdk.signature import SignatureVerifier
import os
from dotenv import load_dotenv
import requests  # Add this for making HTTP requests

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize Slack clients
client = WebClient(token=os.environ.get("SLACK_BOT_TOKEN"))
signature_verifier = SignatureVerifier(os.environ.get("SLACK_SIGNING_SECRET"))

@app.route("/slack/events", methods=["POST"])
def slack_events():
    # Verify request is from Slack
    if not signature_verifier.is_valid_request(request.get_data(), request.headers):
        return jsonify({"error": "Invalid request"}), 403

    data = request.json
    print("Received Slack event:", data)

    # Handle app_mention events
    if data.get("type") == "event_callback" and data.get("event", {}).get("type") == "app_mention":
        event = data.get("event", {})
        user_id = event.get("user")
        channel = event.get("channel")

        # Respond to the mention
        client.chat_postMessage(
            channel=channel,
            text=f"Hello <@{user_id}>! I'm your Social Media Content Calendar bot.",
            blocks=[
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"Hello <@{user_id}>! I'm your Social Media Content Calendar bot."
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
        )

    # Handle app_home_opened events
    elif data.get("type") == "event_callback" and data.get("event", {}).get("type") == "app_home_opened":
        user_id = data["event"]["user"]

        # Publish a Home tab view
        client.views_publish(
            user_id=user_id,
            view={
                "type": "home",
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": f"👋 Hello <@{user_id}>! Welcome to your Social Media Content Calendar!"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Here's what I can help you with:"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "• View upcoming posts\n• Add new content ideas\n• Check posting schedule\n• Generate content suggestions"
                        }
                    },
                    {
                        "type": "context",
                        "elements": [
                            {
                                "type": "mrkdwn",
                                "text": "🚀 Let’s boost your content game!"
                            }
                        ]
                    }
                ]
            }
        )

    # Handle Slack verification challenge
    if data.get("type") == "url_verification":
        return jsonify({"challenge": data.get("challenge")})

    return jsonify({"status": "ok"})

# Add an endpoint to use the webhook
@app.route("/send-webhook", methods=["POST"])
def send_webhook():
    data = request.json

    if not data or "text" not in data:
        return jsonify({"error": "Missing text parameter"}), 400

    webhook_url = os.environ.get("SLACK_WEBHOOK_URL")
    if not webhook_url:
        return jsonify({"error": "Webhook URL not configured"}), 500

    # Send the message using the webhook
    response = requests.post(
        webhook_url,
        json={"text": data["text"]},
        headers={"Content-Type": "application/json"}
    )

    if response.status_code == 200:
        return jsonify({"status": "Message sent successfully"})
    else:
        return jsonify({"error": f"Failed to send message: {response.text}"}), 500

# Add API endpoint for the frontend to fetch calendar data
@app.route("/api/calendar", methods=["GET"])
def get_calendar():
    # Mock posts data
    mock_posts = [
        {
            "id": "1",
            "content": "Check out our latest product update!",
            "platform": "Twitter",
            "scheduledTime": "2025-05-15T14:30:00Z"
        },
        {
            "id": "2",
            "content": "New blog post: '10 Social Media Tips for 2025'",
            "platform": "LinkedIn",
            "scheduledTime": "2025-05-16T10:00:00Z"
        }
    ]
    return jsonify(mock_posts)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Slack App Backend!"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
