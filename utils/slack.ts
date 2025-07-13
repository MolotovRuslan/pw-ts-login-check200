import axios from 'axios';

export const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

export async function sendToSlack(message: string) {
  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: message,
    });
  } catch (error) {
    console.error('Failed to send Slack message:', error);
  }
}
