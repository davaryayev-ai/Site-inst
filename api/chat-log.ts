import fetch from "node-fetch";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { parentName, childName, childAge, direction, bookingStatus, messages } = req.body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Telegram configuration is missing.");
      return res.status(200).json({
        success: true,
        message: "Диалог сохранен! (Для отправки лога в Telegram настройте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID)",
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    // Format chat log cleanly in a readable structure
    let logText = "";
    messages.forEach((msg: any) => {
      // Exclude system message prefixes from log if any, clean up formatting
      const cleanText = msg.text.replace(/^\[ИИ-Админ\]\s*/i, "");
      const sender = msg.sender === "user" ? "👤 <b>Клиент</b>" : "🤖 <b>ИИ-Бот</b>";
      logText += `${sender}: ${cleanText}\n───────────────────\n`;
    });

    const text = `💬 <b>Новый диалог с ИИ-ассистентом LearnFlow!</b>\n\n` +
      `👤 <b>Родитель:</b> ${parentName || "Не определено"}\n` +
      `👶 <b>Ребенок:</b> ${childName || "Не указано"}\n` +
      `🎂 <b>Возраст:</b> ${childAge || "Не указан"}\n` +
      `🎯 <b>Направление:</b> ${direction || "Не указано"}\n` +
      `✅ <b>Статус сделки:</b> <b>${bookingStatus || "В диалоге ⏳"}</b>\n\n` +
      `📖 <b>История переписки:</b>\n` +
      `───────────────────\n` +
      logText +
      `🗓 <i>Дата: ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Almaty" })} (Астана)</i>`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send telegram chat log:", errorText);
      return res.status(502).json({ error: "Failed to send chat log to Telegram." });
    }

    return res.status(200).json({ success: true, message: "Лог диалога отправлен в Telegram!" });
  } catch (error: any) {
    console.error("Error in chat-log handler:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
