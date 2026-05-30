import React from "react";
import { Clock, Moon, ShieldAlert, BadgePercent, ArrowRight } from "lucide-react";

export default function PainPoints() {
  const pains = [
    {
      icon: <Clock className="text-zinc-700" size={24} />,
      title: "Паралич ожидания ответа",
      metric: "-53%",
      metricDesc: "конверсии уходит конкурентам из-за задержек",
      desc: "Родители ищут кружки и курсы в Астане, оставляя заявки сразу в несколько мест. Кто первый ответил, тот и забрал клиента. Опоздание на 15 минут уничтожает конверсию в запись.",
    },
    {
      icon: <Moon className="text-zinc-700" size={24} />,
      title: "Слитый ночной трафик",
      metric: "35% - 40%",
      metricDesc: "лидов приходят после 21:00 и на выходных",
      desc: "Уставшие мамы выбирают занятия детям после 21:00 и на выходных. Менеджеры спят до 09:00 утра. За 12 часов ожидания лид полностью остывает или находит другой центр.",
    },
    {
      icon: <ShieldAlert className="text-zinc-700" size={24} />,
      title: "Слитый рекламный бюджет",
      metric: "6 000 ₸+",
      metricDesc: "цена привлечения одного лида в Астане",
      desc: "При затратах до 10 000 ₸ на привлечение одной заявки, менеджеры часто забывают перезвонить или делают это нехотя. Рекламный бюджет сливается прямо на этапе квалификации.",
    }
  ];

  return (
    <div id="pain-points-section" className="space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-mono text-zinc-655 uppercase tracking-widest bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full">
          Суровая реальность детских центров
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-zinc-900 tracking-tight leading-tight max-w-4xl mx-auto text-balance">
          Каждую минуту, пока менеджер молчит, ваши конкуренты забирают учеников
        </h2>
        <p className="text-zinc-500 font-sans max-w-2xl mx-auto text-sm sm:text-base font-light">
          Рекламные агентства в Казахстане приводят заявки дорого, но медленная работа превращает их в регулярный слив бюджета. Посмотрите на главные дыры в вашей воронке.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pains.map((pain, idx) => (
          <div
            key={idx}
            className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-350 hover:shadow-sm transition duration-300 relative group overflow-hidden"
          >
            <div className="space-y-4">
              <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-xl w-fit">
                {pain.icon}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-display font-semibold text-zinc-900 group-hover:text-zinc-850 transition duration-200">
                  {pain.title}
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Главная боль #{idx + 1}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-650 font-sans leading-relaxed font-light">
                {pain.desc}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-100 flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 tracking-tight block">
                  {pain.metric}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono uppercase block mt-0.5">
                  {pain.metricDesc}
                </span>
              </div>
              <BadgePercent className="text-zinc-305 group-hover:text-zinc-450 transition-colors duration-300 pointer-events-none" size={32} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-sans">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-zinc-200 text-zinc-800 rounded-lg shrink-0 text-xs">
            💡
          </span>
          <p className="text-zinc-700 text-xs sm:text-sm">
            <strong>Как это исправить?</strong> ИИ-Агент отвечает родителю за <strong>3 секунды</strong> в WhatsApp и Telegram, в любое время суток, закрывая сделку.
          </p>
        </div>
        <a href="#demo-chat" className="text-zinc-900 hover:text-zinc-700 transition-colors duration-200 flex items-center gap-1.5 font-semibold shrink-0 group">
          Проверить в демо-чате
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}
