export async function sendTelegramMessage(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdsStr = process.env.TELEGRAM_CHAT_IDS;
  
  if (!token || !chatIdsStr) return;
  
  const chatIds = chatIdsStr.split(",").map(id => id.trim()).filter(Boolean);
  
  for (const chatId of chatIds) {
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });
    } catch (e) {
      console.error("Failed to send telegram message to", chatId, e);
    }
  }
}
