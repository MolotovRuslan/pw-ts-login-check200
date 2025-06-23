import axios from 'axios';

export const TOKEN = '6331809895:AAEAkdLeZZG02JSVMZ3AY7IsQjBlS9jrhtQ';
export const CHAT_ID = '218858759'; // Replace with actual chat ID or channel name


                                      // Send MSG function
                                      
export async function sendToTelegram(message: string) {
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    });
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}
