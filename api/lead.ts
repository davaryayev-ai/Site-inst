import fetch from "node-fetch";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { centerName, ownerName, phone, crmType, leadsCount } = req.body;

    if (!ownerName || !phone) {
      return res.status(400).json({ error: "Name and phone are required fields." });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      // If Telegram is not configured yet, succeed but notify in response
      console.warn("Telegram bot token or chat ID is missing in environment variables.");
      return res.status(200).json({
        success: true,
        message: "Заявка сохранена! (Для отправки в Telegram настройте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в Vercel)",
      });
    }

    // Format a beautiful and readable HTML message for Telegram
    const text = `🔔 <b>Новая заявка на аудит LearnFlow!</b>\n\n` +
      `🏫 <b>Детский центр:</b> ${centerName || "Не указан"}\n` +
      `👤 <b>Руководитель:</b> ${ownerName}\n` +
      `📞 <b>Контакты:</b> <code>${phone}</code>\n` +
      `💻 <b>CRM-система:</b> ${crmType}\n` +
      `📈 <b>Лидов в месяц:</b> ${leadsCount || "Не указано"}\n\n` +
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
      console.error("Failed to send telegram message:", errorText);
      return res.status(502).json({ error: "Failed to send notification to Telegram." });
    }

    return res.status(200).json({ success: true, message: "Заявка успешно отправлена!" });
  } catch (error: any) {
    console.error("Error in lead handler:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
