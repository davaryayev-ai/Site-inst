import React from "react";
import { Zap, MessageSquare, Shield, CheckCircle, Database, Settings } from "lucide-react";

export default function Solutions() {
  const solutions = [
    {
      icon: <Zap className="text-zinc-700" size={24} />,
      title: "Отвечает за 3 секунды",
      subtitle: "24/7 без выходных и сна",
      desc: "ИИ-агент моментально перехватывает лида, пока он находится на пике интереса. Даже если родитель оставил заявку в 3 часа ночи в воскресенье, он получит теплый, экспертный ответ уже через 3 секунды.",
    },
    {
      icon: <MessageSquare className="text-zinc-700" size={24} />,
      title: "Отрабатывает возражения",
      subtitle: "Скрипты лучших менеджеров",
      desc: "В отличие от обычных ботов-автоответчиков, наш ассистент понимает живой человеческий язык. Он филигранно отвечает на каверзные вопросы про высокие цены, неудобный адрес, плохую мотивацию или страхи родителей.",
    },
    {
      icon: <CheckCircle className="text-zinc-700" size={24} />,
      title: "Прямая запись на урок в CRM",
      subtitle: "Автоматическое создание сделки",
      desc: "Как только родитель подтверждает удобный день и время (например, суббота в 11:30), ИИ автоматически передает информацию в CRM (amoCRM, Битрикс24) и бронирует время.",
    },
    {
      icon: <Shield className="text-zinc-700" size={24} />,
      title: "Защита от выдумок (галлюцинаций)",
      subtitle: "Строго по вашей базе знаний",
      desc: "ИИ обучается исключительно по вашим прайс-листам, адресам и регламентам. Он никогда не выдумает несуществующую скидку или курс, а при сложном вопросе вежливо пообещает позвать директора.",
    },
    {
      icon: <Database className="text-zinc-700" size={24} />,
      title: "WhatsApp, Instagram & Telegram",
      subtitle: "Работа во всех каналах",
      desc: "Мы подключаем ассистента ко всем мессенджерам и соцсетям детского центра. Родитель может начать диалог в Instagram Direct, а получить подтверждение записи прямо в WhatsApp.",
    },
    {
      icon: <Settings className="text-zinc-700" size={24} />,
      title: "Разгрузка администраторов",
      subtitle: "Освобождение 80% времени от рутины",
      desc: "Более 80% заявок — это типовые вопросы о ценах, адресах, расписании и пробных уроках. Наш ИИ-ассистент заберет эту рутину на себя, высвободив часы менеджеров для личной заботы об учениках.",
    }
  ];

  return (
    <div id="solutions-section" className="space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-mono text-zinc-650 uppercase tracking-widest bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full">
          Возможности интеграции
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-zinc-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Умный ИИ-администратор, который не пропускает ни одного родителя
        </h2>
        <p className="text-zinc-500 font-sans max-w-2xl mx-auto text-sm sm:text-base font-light">
          Мы берем на себя связку искусственного интеллекта с вашими бизнес-процессами. Вы получаете полностью автономного помощника, обученного продавать обучение именно в вашем центре в Астане.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((sol, idx) => (
          <div
            key={idx}
            className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-xs transition duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-xl w-fit text-zinc-800 group-hover:bg-zinc-200 transition duration-300">
                {sol.icon}
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-display font-semibold text-zinc-900 leading-snug">
                  {sol.title}
                </h3>
                <span className="text-xs text-zinc-500 font-mono font-medium block mt-0.5">
                  {sol.subtitle}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed font-light">
                {sol.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
