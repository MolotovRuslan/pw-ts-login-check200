import axios from 'axios';

export const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/';

export async function sendToSlack(message: string) {
  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: message,
    });
  } catch (error) {
    console.error('Failed to send Slack message:', error);
  }
}
