import axios from 'axios';

export const TOKEN = '';
export const CHAT_ID = ''; // Replace with actual chat ID or channel name


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


// export async function escapeMarkdown(text: string) {
//   return text
//     .replace(/_/g, '\\_')
//     .replace(/\*/g, '\\*')
//     .replace(/\[/g, '\\[')
//     .replace(/\]/g, '\\]')
//     .replace(/\(/g, '\\(')
//     .replace(/\)/g, '\\)')
//     .replace(/~/g, '\\~')
//     .replace(/`/g, '\\`')
//     .replace(/>/g, '\\>')
//     .replace(/#/g, '\\#')
//     .replace(/\+/g, '\\+')
//     .replace(/-/g, '\\-')
//     .replace(/=/g, '\\=')
//     .replace(/\|/g, '\\|')
//     .replace(/{/g, '\\{')
//     .replace(/}/g, '\\}')
//     .replace(/\./g, '\\.')
//     .replace(/!/g, '\\!');
// }
