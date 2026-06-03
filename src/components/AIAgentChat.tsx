import React, { useState, useEffect, useRef } from "react";
import { Message } from "../types";
import { Send, Sparkles, MessageSquare, Bot, User, CheckCircle, Smartphone, HelpCircle } from "lucide-react";

export default function AIAgentChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulated CRM database state extracted by the AI from conversation
  const [crmData, setCrmData] = useState({
    parentName: "Ожидание диалога...",
    childName: "Не указано",
    childAge: "Не указан",
    detectedObjection: "Нет",
    bookingStatus: "В диалоге ⏳",
    leadChannel: "WhatsApp Интеграция",
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Suggested prompts customized for Astana / Kazakhstan
  const suggestions = [
    { text: "Почему абонемент стоит целых 45 000 тенге?", label: "Возражение: Дорого" },
    { text: "Нам далеко добираться с Левого берега в Астане.", label: "Возражение: Адрес" },
    { text: "Ребёнку ничего не интересно, он ленится.", label: "Возражение: Мотивация" },
    { text: "Я подумаю и напишу позже в WhatsApp.", label: "Возражение: Подумаю" },
  ];

  // Prefill initial system message on load
  useEffect(() => {
    setErrorMessage(null);
    setMessages([
      {
        id: "welcome-parent",
        sender: "model",
        text: "Сәлеметсіз бе! 👋 Я — ИИ-ассистент детского образовательного центра развития в Астане. Вижу, вы интересовались нашими курсами подготовки и робототехники. Подскажите, пожалуйста, по какому направлению вы хотели бы узнать подробности, или у вас возникли вопросы по ценам и расписанию?",
        timestamp: new Date(),
      }
    ]);
    setCrmData({
      parentName: "В процессе определения...",
      childName: "Не указано",
      childAge: "Не указан",
      detectedObjection: "Нет",
      bookingStatus: "В диалоге ⏳",
      leadChannel: "WhatsApp Клиент",
    });
  }, []);

  // Handle autoscroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const logSentRef = useRef(false);

  // Send completed chat logs to Telegram when user is booked
  useEffect(() => {
    if (crmData.bookingStatus === "Записан на пробный! ✅" && !logSentRef.current && messages.length > 1) {
      logSentRef.current = true;
      
      // Determine direction (programming, robotics, english) from USER messages only
      // (bot's welcome message mentions all directions, so scanning it would always match "робот" first)
      let direction = "Не определено";
      const userText = messages.filter(m => m.sender === "user").map(m => m.text).join(" ").toLowerCase();
      if (userText.includes("английск") || userText.includes("english") || userText.includes("англ")) {
        direction = "Английский язык";
      } else if (userText.includes("программиров") || userText.includes("код") || userText.includes("scratch") || userText.includes("python")) {
        direction = "Программирование";
      } else if (userText.includes("робот") || userText.includes("робототехник")) {
        direction = "Робототехника";
      } else if (userText.includes("подготовк") || userText.includes("школ")) {
        direction = "Подготовка к школе";
      }

      fetch("/api/chat-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentName: crmData.parentName,
          childName: crmData.childName,
          childAge: crmData.childAge,
          bookingStatus: crmData.bookingStatus,
          direction: direction,
          messages: messages.map(m => ({ sender: m.sender, text: m.text })),
        }),
      }).catch(err => console.error("Error sending chat log:", err));
    }
    
    // Reset the ref if messages are cleared or reset to initial welcome message
    if (messages.length <= 1) {
      logSentRef.current = false;
    }
  }, [crmData.bookingStatus, messages]);

  // Analyze conversation on message changes to simulate CRM extraction
  useEffect(() => {
    if (messages.length <= 1) return;

    const lastUserMsg = [...messages].reverse().find(m => m.sender === "user")?.text.toLowerCase() || "";

    let name = crmData.parentName;
    let childName = crmData.childName || "Не указано";
    let age = crmData.childAge;
    let objection = crmData.detectedObjection;
    let status = crmData.bookingStatus;

    // Detect prompt/question context from previous model message before user's response
    const reversedMessages = [...messages].reverse();
    const lastUserMsgIndex = reversedMessages.findIndex(m => m.sender === "user");
    let questionText = "";
    if (lastUserMsgIndex !== -1) {
      const priorModelMsg = reversedMessages.slice(lastUserMsgIndex + 1).find(m => m.sender === "model");
      if (priorModelMsg) {
        questionText = priorModelMsg.text.toLowerCase();
      }
    }

    // Single-word context-aware parsing
    const cleanMsg = lastUserMsg.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    const isSingleWord = /^[a-zа-яё\-]+$/i.test(cleanMsg);
    const isAskingParentName = questionText.includes("как вас зовут") || questionText.includes("как зовут вас") || questionText.includes("ваше имя") || questionText.includes("представиться");
    const isAskingChildName = (questionText.includes("как зовут") || questionText.includes("имя")) && !isAskingParentName;
    
    const commonExclusions = ["давайте", "да", "нет", "хочу", "запишите", "будние", "выходные", "субботу", "воскресенье", "завтра", "сегодня", "наверное", "пожалуй"];
    const nameExclusions = [
      ...commonExclusions,
      "англ", "английский", "английскому", "английским", 
      "робот", "робототехника", "робототехнику",
      "программирование", "программированию",
      "подготовка", "подготовку",
      "школа", "школе", "школу",
      "курс", "курсы", "курсах",
      "лет", "года", "год",
      "меня", "тебя", "его", "ее", "её", "было", "будет",
      "мама", "папа", "дочь", "дочка", "дочку", "сын", "сына", "ребенок", "ребенка",
      "здравствуйте", "привет", "добрый", "день", "вечер", "утро", "салем", "салемсуз", "здравствуй", "приветик",
      "добрыйдень", "добрыйвечер", "доброеутро", "сәлем"
    ];

    if (isSingleWord && !nameExclusions.includes(cleanMsg.toLowerCase())) {
      const capitalized = cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1).toLowerCase();
      if (isAskingParentName) {
        name = capitalized;
      } else if (isAskingChildName) {
        childName = capitalized;
      }
    }

    // Detect child name and age together like "Данияр 10 лет"
    const childMatch = lastUserMsg.match(/([а-яёa-z]+)\s+(\d+)\s*(?:лет|года|мес)/i);
    if (childMatch && childMatch[1] && childMatch[2]) {
      childName = childMatch[1].charAt(0).toUpperCase() + childMatch[1].slice(1);
      age = `${childMatch[2]} лет`;
    }

    // Detect parent's name FIRST (must run before child name detection)
    const parentKeywords = /(?:меня зовут|мое имя|я\s+[-—]\s*|я\s+)([а-яёa-z]+)/i;
    const parentMatch = lastUserMsg.match(parentKeywords);
    if (parentMatch && parentMatch[1]) {
      const nameCand = parentMatch[1].toLowerCase();
      if (!nameExclusions.includes(nameCand)) {
        name = parentMatch[1].charAt(0).toUpperCase() + parentMatch[1].slice(1);
      }
    }

    // Detect child name in text if mentioned with child-specific keywords
    // IMPORTANT: Skip if the message is about the parent ("меня зовут", "я [name]") 
    const isParentIntro = /(?:меня зовут|мое имя|я\s+[-—])/i.test(lastUserMsg);
    if (!isParentIntro) {
      const nameKeywords = /(?:зовут|имя|сын|сына|доч(?:ь|ка|ку)|ребен(?:ок|ка))\s+([а-яёa-z]+)/i;
      const nameMatch = lastUserMsg.match(nameKeywords);
      if (nameMatch && nameMatch[1]) {
        const childCand = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
        // Don't set child name to be the same as parent name
        if (childCand.toLowerCase() !== name.toLowerCase() || name === "В процессе определения...") {
          childName = childCand;
        }
      }
    }

    // Generic short-message name parser fallback (e.g. "Настя, англ")
    if ((name === "В процессе определения..." || childName === "Не указано") && !isParentIntro && !parentMatch) {
      const words = lastUserMsg.split(/[^a-zа-яё\-]+/i).filter(w => w.length >= 2);
      const potentialName = words.find(w => !nameExclusions.includes(w.toLowerCase()));
      if (potentialName) {
        const capitalized = potentialName.charAt(0).toUpperCase() + potentialName.slice(1).toLowerCase();
        if (isAskingParentName && name === "В процессе определения...") {
          name = capitalized;
        } else if (isAskingChildName && childName === "Не указано") {
          childName = capitalized;
        }
      }
    }

    // First user message single word detection (e.g. user just starts by sending "Давид")
    const userMsgsList = messages.filter(m => m.sender === "user");
    if ((name === "В процессе определения..." || name === "Ожидание диалога...") && userMsgsList.length <= 1 && isSingleWord && !nameExclusions.includes(cleanMsg.toLowerCase())) {
      name = cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1).toLowerCase();
    }

    // Scan all model messages in history for name addressing patterns (e.g. "Спасибо, Давид!" or "Отлично, Давид!")
    // IMPORTANT: Skip if the detected name matches the child's name (prevents AI mistake of addressing parent by child's name)
    for (const msg of messages) {
      if (msg.sender === "model") {
        const addressMatch = msg.text.match(/(?:Спасибо|Отлично|Здравствуйте|Привет|Очень приятно|Рад познакомить|Рада познакомить|Приветствую),\s+([А-ЯЁA-Zа-яёa-z\-]+)/i);
        if (addressMatch && addressMatch[1]) {
          const cand = addressMatch[1].trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
          if (cand.length >= 2 && !nameExclusions.includes(cand.toLowerCase())) {
            const candNormalized = cand.charAt(0).toUpperCase() + cand.slice(1).toLowerCase();
            // Don't set parent name if it matches the child's name (AI may have confused them)
            if (childName !== "Не указано" && candNormalized.toLowerCase() === childName.toLowerCase()) {
              continue;
            }
            name = candNormalized;
            break;
          }
        }
      }
    }

    // Detect child age (supports both digits and Russian number words)
    const numberWords: Record<string, number> = {
      "один": 1, "одного": 1, "два": 2, "двух": 2, "три": 3, "трёх": 3, "трех": 3,
      "четыре": 4, "четырёх": 4, "четырех": 4, "пять": 5, "пяти": 5,
      "шесть": 6, "шести": 6, "семь": 7, "семи": 7, "восемь": 8, "восьми": 8,
      "девять": 9, "девяти": 9, "десять": 10, "десяти": 10,
      "одиннадцать": 11, "одиннадцати": 11, "двенадцать": 12, "двенадцати": 12,
      "тринадцать": 13, "тринадцати": 13, "четырнадцать": 14, "четырнадцати": 14,
      "пятнадцать": 15, "пятнадцати": 15, "шестнадцать": 16, "семнадцать": 17,
      "восемнадцать": 18
    };

    // Try digit-based age detection first
    const ageMatch = lastUserMsg.match(/(\d+)\s*(?:лет|года|мес)/i);
    if (ageMatch) {
      age = `${ageMatch[1]} лет`;
    } else if (questionText.includes("сколько лет") || questionText.includes("возраст") || questionText.includes("сколько ему") || questionText.includes("сколько ей")) {
      const numMatch = lastUserMsg.match(/\b(\d{1,2})\b/);
      if (numMatch) {
        age = `${numMatch[1]} лет`;
      } else {
        // Try word-based age detection (e.g. "десять", "семь")
        const lowerMsg = lastUserMsg.toLowerCase().trim();
        for (const [word, num] of Object.entries(numberWords)) {
          if (lowerMsg.includes(word)) {
            age = `${num} лет`;
            break;
          }
        }
      }
    } else {
      // Even without context question, try to detect standalone word numbers as age
      const lowerMsg = lastUserMsg.toLowerCase().trim();
      const singleWordMsg = lowerMsg.replace(/[^а-яёa-z0-9]/gi, "");
      if (numberWords[singleWordMsg] !== undefined) {
        age = `${numberWords[singleWordMsg]} лет`;
      }
    }

    // Detect core objection
    if (lastUserMsg.includes("дорог") || lastUserMsg.includes("тенге") || lastUserMsg.includes("тг") || lastUserMsg.includes("цена") || lastUserMsg.includes("стоит")) {
      objection = "Высокая цена 💸";
    } else if (lastUserMsg.includes("далек") || lastUserMsg.includes("адрес") || lastUserMsg.includes("берег") || lastUserMsg.includes("район") || lastUserMsg.includes("астан")) {
      objection = "Локация / Далеко 🗺️";
    } else if (lastUserMsg.includes("ленит") || lastUserMsg.includes("не хочет") || lastUserMsg.includes("интересно") || lastUserMsg.includes("нравит")) {
      objection = "Мотивация ребенка 🧸";
    } else if (lastUserMsg.includes("подума") || lastUserMsg.includes("советов")) {
      objection = "Сомнения / Подумаю 🧠";
    } else if (lastUserMsg.includes("робот") || lastUserMsg.includes("ии") || lastUserMsg.includes("глюч") || lastUserMsg.includes("галлюцина")) {
      objection = "Страх технологий 🤖";
    }

    const lastModelResponse = [...messages].reverse().find(m => m.sender === "model")?.text.toLowerCase() || "";
    const confirmationKeywords = [
      "записали", "запишем", "записал", "записала", "записан", "записаны",
      "забронировал", "забронировали", "забронируем", "забронировано",
      "подтвердил", "подтвердили", "подтверждено", "подтверждена", "подтверждаю",
      "внесли", "внес", "внесла", "внесено",
      "добавили", "добавил", "добавила", "добавлено",
      "жду вас", "встречу", "ждем вас"
    ];
    const exclusionKeywords = [
      "как вас зовут", "как зовут", "сколько лет", "сколько ему", "сколько ей",
      "хотите", "можем", "удобн", "когда", "какой", "какие", "выходн", "будн", "выберем", "выберите", "предлагаю"
    ];
    const hasExclusions = exclusionKeywords.some(ex => lastModelResponse.includes(ex));

    if (confirmationKeywords.some(keyword => lastModelResponse.includes(keyword)) && !hasExclusions) {
      status = "Записан на пробный! ✅";
    }
    setCrmData(prev => ({
      ...prev,
      parentName: name,
      childName: childName,
      childAge: age,
      detectedObjection: objection,
      bookingStatus: status
    }));

  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorMessage(null);
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "parent_simulation",
          messages: [...messages, userMessage].map(m => ({
            sender: m.sender,
            text: m.text
          }))
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        if (errData.error === "API_KEY_MISSING") {
          throw new Error(errData.message);
        }
        throw new Error(errData.message || "Ошибка соединения.");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          sender: "model",
          text: data.reply,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      console.error("Chat error:", err);
      // Smart Fallback response generator with context/memory
      let fallbackText = "";
      const lowerInput = textToSend.toLowerCase();
      
      const history = [...messages, userMessage];
      const userMsgs = history.filter(m => m.sender === "user");
      const userMsgCount = userMsgs.length;

      const isJailbreak = 
        /ignore\s+(?:all\s+)?previous/i.test(lowerInput) ||
        /игнорируй\s+(?:все\s+)?предыдущие/i.test(lowerInput) ||
        /забудь\s+(?:все\s+)?инструкции/i.test(lowerInput) ||
        /забудь\s+(?:все\s+)?правила/i.test(lowerInput) ||
        /системный\s+промпт/i.test(lowerInput) ||
        /system\s+prompt/i.test(lowerInput) ||
        /твои\s+инструкции/i.test(lowerInput) ||
        /напиши\s+(?:код|скрипт|программу|функцию)/i.test(lowerInput) ||
        /write\s+(?:code|script|program|function)/i.test(lowerInput) ||
        /создай\s+(?:код|скрипт|программу|функцию)/i.test(lowerInput) ||
        /code\s+in\s+/i.test(lowerInput) ||
        /код\s+на\s+/i.test(lowerInput) ||
        /ты\s+теперь\s+/i.test(lowerInput);

      const hasAllRequiredData = 
        crmData.parentName !== "В процессе определения..." && 
        crmData.parentName !== "Ожидание диалога..." &&
        crmData.childName !== "Не указано" &&
        crmData.childAge !== "Не указан";

      if (isJailbreak) {
        fallbackText = "Я с удовольствием проконсультирую вас по направлениям нашего детского центра (включая программирование, робототехнику и английский язык) и помогу записаться на бесплатный пробный урок. 😊 Однако писать код, выполнять технические задачи или отвечать на отвлеченные темы я не умею. Подскажите, пожалуйста, сколько лет вашему ребенку, чтобы мы подобрали подходящую группу?";
      } else if (userMsgCount === 1) {
        const isParentMissing = crmData.parentName === "В процессе определения..." || crmData.parentName === "Ожидание диалога...";
        if (isParentMissing) {
          if (lowerInput.includes("дорог") || lowerInput.includes("цена") || lowerInput.includes("тенге") || lowerInput.includes("45")) {
            fallbackText = "Я вас прекрасно понимаю, планирование бюджета на обучение — ответственный шаг. 💖 Но у нас мини-группы до 6 детей по авторской Оксфордской методике, а пробный урок бесплатный — можно прийти, оценить атмосферу. Подскажите, как я могу к вам обращаться?";
          } else if (lowerInput.includes("далек") || lowerInput.includes("берег") || lowerInput.includes("адрес") || lowerInput.includes("пробк")) {
            fallbackText = "Да, пробки в Астане на мостах — это сложно. Но у нас есть утренние группы выходного дня, когда дороги свободны. Подскажите, как я могу к вам обращаться?";
          } else {
            fallbackText = "С удовольствием всё расскажу и помогу подобрать расписание! Подскажите, пожалуйста, как я могу к вам обращаться?";
          }
        } else {
          fallbackText = `Очень приятно! Подскажите, пожалуйста, сколько лет вашему ребенку и интересует ли вас программирование, робототехника или английский?`;
        }
      } else if (lowerInput.includes("дорог") || lowerInput.includes("цена") || lowerInput.includes("тенге") || lowerInput.includes("45")) {
        fallbackText = "Я вас прекрасно понимаю, планирование бюджета на обучение — ответственный шаг. 💖 Но у нас мини-группы до 6 детей по авторской Оксфордской методике, а пробный урок бесплатный — можно прийти, оценить атмосферу и только потом решать. Подскажите, как зовут вас и ребенка, и сколько ему лет? Подберем подходящую группу.";
      } else if (lowerInput.includes("далек") || lowerInput.includes("берег") || lowerInput.includes("адрес") || lowerInput.includes("пробк")) {
        fallbackText = "Да, пробки в Астане на мостах — это сложно. 🗺️ Но для этого у нас есть утренние группы в субботу и воскресенье, когда дороги свободны, а также онлайн-трансляция занятий. Подскажите, на каком проспекте или ЖК вы живете? И как зовут вашего ребенка?";
      } else if (lowerInput.includes("ленит") || lowerInput.includes("не хочет") || lowerInput.includes("интерес")) {
        fallbackText = "Это частая история! Ребята обычно вовлекаются с первых минут благодаря нашей игровой интерактивной методике. Педагог проводит диагностику в игровой форме. Подскажите, сколько лет ребенку и как его зовут?";
      } else if (hasAllRequiredData && userMsgCount >= 2 && (lowerInput.includes("запиш") || lowerInput.includes("давай") || lowerInput.includes("хорош") || lowerInput.includes("удобн") || lowerInput.includes("суббот") || lowerInput.includes("воскрес") || lowerInput.includes("будн") || /\d+/.test(lowerInput))) {
        fallbackText = `Отлично! Записали ${crmData.childName} на пробное занятие на эту субботу в 11:30. Наш администратор свяжется с вами в течение 10 минут в WhatsApp, чтобы подтвердить детали и отправить точный адрес филиала. Будем ждать вас! ✨`;
      } else {
        const missing = [];
        const isParentMissing = crmData.parentName === "В процессе определения..." || crmData.parentName === "Ожидание диалога...";
        if (isParentMissing) missing.push("как зовут вас");
        if (crmData.childName === "Не указано") missing.push("как зовут вашего ребенка");
        if (crmData.childAge === "Не указан") missing.push("сколько ему/ей лет");
        
        if (missing.length > 0) {
          fallbackText = `Поняла вас! Чтобы подобрать идеальную группу и расписание, подскажите, пожалуйста: ${missing.join(" и ")}?`;
        } else {
          fallbackText = "Отлично! Подскажите, когда вам было бы удобнее прийти на пробное занятие — в будни или в выходные?";
        }
      }

      setErrorMessage(err.message || "Используется встроенный офлайн-демо сценарий (Казахстан).");
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            sender: "model",
            text: `[ИИ-Админ] ${fallbackText}`,
            timestamp: new Date(),
          },
        ]);
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="demo-chat-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-stretch">
      
      {/* 1. Technical/CRM Dashboard Monitor (4 Columns) */}
      <div className="lg:col-span-4 bg-zinc-50 border border-zinc-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-700"></span>
            </span>
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-650 font-bold">
              CRM Монитор интеграции
            </h4>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-zinc-200 font-mono text-xs space-y-3 shadow-2xs">
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Интеграция:</span>
                <span className="text-emerald-700 font-bold">Активна (Астана)</span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-zinc-400 block text-[10px]">Канал трафика:</span>
                  <span className="text-zinc-800 text-[13px] font-medium">{crmData.leadChannel}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">Родитель:</span>
                  <span className="text-zinc-800 text-[13px] font-semibold">{crmData.parentName}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">Имя ребёнка:</span>
                  <span className="text-zinc-800 text-[13px] font-semibold">{crmData.childName}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">Возраст ребёнка:</span>
                  <span className="text-zinc-800 text-[13px]">{crmData.childAge}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">Измерено возражение:</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${crmData.detectedObjection !== "Нет" ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-zinc-100 text-zinc-500"}`}>
                    {crmData.detectedObjection}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">Сделка в CRM:</span>
                  <span className={`text-[12px] font-bold ${crmData.bookingStatus.includes("✅") || crmData.bookingStatus.includes("📬") ? "text-emerald-700" : "text-amber-700"}`}>
                    {crmData.bookingStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-zinc-200 text-xs text-zinc-650 leading-relaxed space-y-2 shadow-2xs">
              <div className="flex items-center gap-1.5 text-zinc-800 font-semibold">
                <CheckCircle size={14} className="text-emerald-600" />
                <span>Автоматический парсинг:</span>
              </div>
              <p className="text-[11px] font-light text-zinc-500">
                Интеллектуальный парсер налету вытаскивает имена, адреса и предпочтения, мгновенно забивая карточку клиента в базу без участия администратора.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-200 hidden lg:block">
          <div className="text-center">
            <Smartphone className="mx-auto text-zinc-400 mb-1" size={20} />
            <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
              WhatsApp & CRM API Активно
            </p>
          </div>
        </div>

      </div>

      {/* 2. Interactive Chat Terminal Mockup (8 Columns) - Styled as a premium smartphone with WhatsApp */}
      <div className="lg:col-span-8 flex flex-col items-center justify-center w-full py-4 gap-4">
        <div className="w-full max-w-[360px] h-[640px] bg-zinc-900 p-1.5 rounded-[28px] shadow-2xl border-2 border-zinc-800 flex flex-col relative shrink-0">
          
          {/* Phone Notch & Speaker */}
          <div className="w-16 h-1.5 bg-zinc-800 rounded-b-md mx-auto mb-1 flex items-center justify-center gap-1 shrink-0 select-none">
            <span className="w-4 h-0.5 bg-zinc-700 rounded-full" />
            <span className="w-1 h-1 bg-zinc-900 rounded-full" />
          </div>

          {/* Screen Container */}
          <div className="bg-[#efeae2] rounded-[22px] overflow-hidden flex-1 flex flex-col relative border border-zinc-950/10 shadow-inner">
            
            {/* Mobile Status Bar */}
            <div className="bg-[#075e54] text-white/90 px-4 py-1.5 flex justify-between items-center text-[9px] font-sans tracking-wide shrink-0 select-none">
              <span>20:15</span>
              <div className="flex items-center gap-1">
                <span className="flex gap-0.5 items-end h-1.5">
                  <span className="w-0.5 h-1 bg-white/90 rounded-2xs" />
                  <span className="w-0.5 h-1.5 bg-white/90 rounded-2xs" />
                  <span className="w-0.5 h-2 bg-white/35 rounded-2xs" />
                </span>
                <span className="font-semibold">LTE</span>
                <span className="w-4 h-2 border border-white/60 rounded-xs p-0.5 flex items-center">
                  <span className="w-2.5 h-full bg-white/90 rounded-3xs" />
                </span>
              </div>
            </div>

            {/* WhatsApp Header */}
            <div className="bg-[#075e54] text-white px-3.5 py-2.5 flex items-center justify-between shadow-md shrink-0 select-none">
              <div className="flex items-center gap-2.5">
                {/* Profile Avatar */}
                <div className="relative">
                  <div className="w-8 h-8 bg-emerald-100/90 border border-emerald-200/50 rounded-full flex items-center justify-center text-emerald-800 font-bold text-xs shadow-xs font-display">
                    EE
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-[#075e54] rounded-full" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-tight leading-none">Example Education • ИИ-Админ</h4>
                  <p className="text-[9px] text-emerald-100/90 font-light flex items-center gap-1.5 mt-0.5">
                    {isLoading ? (
                      <span className="animate-pulse font-medium">печатает...</span>
                    ) : (
                      <>
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                        </span>
                        <span>в сети</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Action icons */}
              <div className="flex items-center gap-3 text-white/90">
                <Smartphone size={14} className="opacity-90" />
                <Bot size={14} className="opacity-90" />
              </div>
            </div>

            {/* Warning Indicator (Graceful instructions) */}
            {errorMessage && (
              <div className="bg-zinc-100/95 border-b border-zinc-200 text-zinc-700 text-[9px] px-3.5 py-1.5 font-sans flex items-center gap-1 shrink-0 z-10 shadow-2xs">
                <HelpCircle size={12} className="text-zinc-500 shrink-0" />
                <span className="leading-tight">
                  {errorMessage.includes("OPENAI") || errorMessage.includes("API_KEY_MISSING") ? (
                    <>Работает демо-режим РК. Подключите OPENAI_API_KEY в .env</>
                  ) : (
                    errorMessage
                  )}
                </span>
              </div>
            )}

            {/* Chat Body Scroll */}
            <div 
              ref={chatContainerRef} 
              className="flex-1 p-3 overflow-y-auto scrollbar-none flex flex-col space-y-3.5 bg-[#efeae2] select-text"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex max-w-[85%] ${msg.sender === "user" ? "self-end" : "self-start"}`}
                >
                  <div className="space-y-0.5 relative max-w-full">
                    <div className={`rounded-xl px-3 pb-4.5 pt-1.5 text-xs leading-relaxed whitespace-pre-wrap relative shadow-2xs ${msg.sender === "user" ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-none" : "bg-white text-[#111b21] rounded-tl-none border border-zinc-250/10"}`}>
                      <p className="pr-4">{msg.text}</p>
                      <div className="absolute bottom-0.5 right-2 flex items-center gap-0.5 text-[8px] text-zinc-400 select-none">
                        <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.sender === "user" && (
                          <span className="text-[#34b7f1] font-bold text-[10px] tracking-[-0.15em] ml-1 select-none">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex max-w-[85%] mr-auto">
                  <div className="bg-white border border-zinc-250/20 rounded-xl rounded-tl-none px-3.5 py-2 flex gap-1 items-center shadow-2xs">
                    <span className="w-1 h-1 bg-zinc-550 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-zinc-550 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-zinc-550 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Suggestions / Fast Buttons */}
            <div className="px-3.5 py-2.5 bg-[#efeae2] border-t border-zinc-200/10 shrink-0 select-none">
              <p className="text-[10px] text-zinc-550 uppercase font-mono tracking-widest mb-2 flex items-center gap-1.5 font-bold">
                <MessageSquare size={10} /> Быстрый вопрос:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    id={`suggestion-btn-${i}`}
                    onClick={() => handleSendMessage(sug.text)}
                    disabled={isLoading}
                    className="text-[10px] sm:text-[11px] bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-sans px-2 py-1.5 rounded-full shadow-3xs transition duration-200 active:scale-95 cursor-pointer disabled:opacity-50 w-full text-center truncate"
                  >
                    {sug.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Bottom Send Area */}
            <form
              id="chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="bg-[#efeae2] px-3 pb-3 pt-1 flex items-center gap-1.5 shrink-0"
            >
              <div className="flex-grow bg-white border border-zinc-200/40 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-2xs">
                <span className="text-zinc-400 text-sm select-none cursor-pointer">😊</span>
                <input
                  id="chat-message-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading}
                  placeholder="Сообщение..."
                  className="flex-grow bg-transparent text-[11px] sm:text-xs text-zinc-800 placeholder-zinc-450 focus:outline-none focus:ring-0 focus:border-transparent transition font-sans"
                />
                <span className="text-zinc-400 text-sm select-none cursor-pointer hidden sm:inline">📎</span>
              </div>
              
              <button
                id="chat-send-btn"
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 bg-[#00a884] hover:bg-[#008f72] active:scale-95 text-white rounded-full transition cursor-pointer disabled:opacity-40 shrink-0 shadow-md flex items-center justify-center"
              >
                <Send size={12} />
              </button>
            </form>

          </div>
        </div>
        <p className="text-[10px] text-zinc-400 font-sans italic text-center max-w-[320px] leading-relaxed select-none">
          * Сценарий переписки ИИ-агента, алгоритмы ответов на возражения и интеграция с вашей CRM-системой настраиваются опционально под любые задачи вашего бизнеса.
        </p>
      </div>
    </div>
  );
}
