import React, { useState } from "react";
import { Check, Clipboard, Clock, MessageSquare, Tag, Users, ShieldCheck } from "lucide-react";

export default function CrmShowcase() {
  const [activeTab, setActiveTab] = useState<"lead_card" | "kanban">("lead_card");

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xs">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Texts explaining CRM Integration */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full">
            amoCRM & Битрикс24
          </span>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 leading-tight">
            Полная автоматизация воронки — от лида до записи в Астане
          </h3>
          <p className="text-sm sm:text-base text-zinc-500 font-sans leading-relaxed font-light">
            Как только родитель в Астане пишет в WhatsApp, Instagram или Telegram, наш ИИ-агент подхватывает диалог и самостоятельно ведет сделку по вашей воронке. Без задержек, без ошибок человеческого фактора.
          </p>

          <ul className="space-y-3 pt-2 font-sans text-xs sm:text-sm text-zinc-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-zinc-900 shrink-0">📊</span>
              <span><strong>Мгновенное создание сделки:</strong> Бот автоматически заводит карточку в CRM в нужной воронке со всеми метками рекламы (UTM tags).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-zinc-900 shrink-0">🤖</span>
              <span><strong>Умный парсинг сущностей:</strong> Записывает имя мамы, имя ребенка, возраст и выбранный курс в соответствующие поля CRM.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-zinc-900 shrink-0">📅</span>
              <span><strong>Запись в календарь:</strong> Интегрируется со свободным расписанием педагогов прямо в вашей CRM и высылает подтверждения на WhatsApp.</span>
            </li>
          </ul>

          <div className="flex gap-2 bg-zinc-100 border border-zinc-200 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("lead_card")}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${activeTab === "lead_card" ? "bg-zinc-900 text-white font-semibold shadow-2xs" : "text-zinc-600 hover:text-zinc-900"}`}
            >
              Карточка Сделки
            </button>
            <button
              onClick={() => setActiveTab("kanban")}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${activeTab === "kanban" ? "bg-zinc-900 text-white font-semibold shadow-2xs" : "text-zinc-640 hover:text-zinc-900"}`}
            >
              Канбан Воронки
            </button>
          </div>
        </div>

        {/* Visual CRM Mock Panel */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl overflow-hidden font-sans shadow-md">
          
          {/* CRM Bar */}
          <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-zinc-700 rounded-full" />
              <span className="font-mono uppercase tracking-widest text-[10px] text-zinc-800 font-semibold">CRM INTEGRATION DASHBOARD (КАЗАХСТАН • ASTANA)</span>
            </div>
            <span className="bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded text-[10px] font-mono">SECURE_API_KZT</span>
          </div>

          <div className="p-4 sm:p-6 text-sm">
            
            {activeTab === "lead_card" ? (
              /* CARD TYPE VIEW */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-400 block">Карточка #KZ-7724</span>
                    <h4 className="text-zinc-900 text-base font-semibold">Сделка: Заявка на Робототехнику</h4>
                  </div>
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded text-xs font-bold font-mono uppercase flex items-center gap-1">
                    <Check size={12} /> Записан на пробный
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left params */}
                  <div className="space-y-3 text-xs bg-zinc-50/50 p-3 rounded-lg border border-zinc-200">
                    <p className="font-semibold text-zinc-700 border-b border-zinc-150 pb-1.5 flex items-center gap-1.5 font-sans">
                      <Clipboard size={12} className="text-zinc-500" /> Основная информация
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Имя мамы:</span>
                        <span className="text-zinc-800 font-medium">Айгерим Нурланова</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Имя ребенка:</span>
                        <span className="text-zinc-800 font-medium font-sans">Алан</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Возраст ребёнка:</span>
                        <span className="text-zinc-800">8 лет</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Контакты (Астана):</span>
                        <span className="text-zinc-700 font-mono">+7 (701) ***-55-**</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Params */}
                  <div className="space-y-3 text-xs bg-zinc-50/50 p-3 rounded-lg border border-zinc-200">
                    <p className="font-semibold text-zinc-700 border-b border-zinc-150 pb-1.5 flex items-center gap-1.5 font-sans">
                      <Tag size={12} className="text-zinc-500" /> ИИ-Анализ из диалога
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Направление:</span>
                        <span className="bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded text-[11px] border border-zinc-200 font-sans font-medium">Робототехника</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Боль клиента:</span>
                        <span className="text-amber-800 font-sans font-medium">Возражение: Далеко ехать 🗺️</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Время на ответ:</span>
                        <span className="text-emerald-700 font-mono font-bold">3 сек (ИИ мгновенно)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Назначенный урок:</span>
                        <span className="text-emerald-700 font-bold font-sans">Суббота, 14:00 (Астана)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Conversation Log snippet inside CRM */}
                <div className="space-y-2">
                  <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MessageSquare size={12} /> Запись WhatsApp диалога ИИ в CRM:
                  </p>
                  <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200 text-xs font-mono space-y-2 text-zinc-700">
                    <div className="flex items-start gap-1">
                      <span className="text-zinc-900 font-bold uppercase text-[9px] w-12 shrink-0 bg-zinc-200 px-1 py-0.5 rounded text-center">ИИ-Бот:</span>
                      <p className="text-[11px] leading-relaxed">Айгерим, мы понимаем, что возить ребенка с проспекта Мангилик Ел на Правый берег в часы пик неудобно. Но у нас как раз открылась группа выходного дня в субботу в 14:00. Пробок нет вовсе! Записать Алана?</p>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-zinc-500 font-bold uppercase text-[9px] w-12 shrink-0 bg-zinc-200/50 px-1 py-0.5 rounded text-center">Родитель:</span>
                      <p className="text-[11px] leading-relaxed">О, по субботам в 14:00 на Мәңгілік Ел — это отличный вариант! Давайте запишемся на пробный урок.</p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* KANBAN BOARD TYPE VIEW */
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
                  
                  {/* Column 1 */}
                  <div className="space-y-2 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                    <span className="font-semibold text-zinc-500 block border-b border-zinc-200 pb-1 text-[10px]">НОВЫЙ ЛИД (5)</span>
                    <div className="bg-white p-2 rounded border border-zinc-200 space-y-1 shadow-xs">
                      <span className="text-[9px] text-zinc-700 font-bold">WhatsApp • 1 мин назад</span>
                      <p className="text-zinc-900 font-medium truncate text-[10px]">Лид #7721 (Зарина)</p>
                      <div className="flex gap-1 justify-between text-[9px] text-zinc-450">
                        <span>Абонемент: 40к ₸</span>
                        <span>Парсинг..⏳</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-2 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                    <span className="font-semibold text-zinc-650 block border-b border-zinc-200 pb-1 text-[10px]">ДИАЛОГ ИИ (3)</span>
                    <div className="bg-white p-2 rounded border border-amber-350 space-y-1 shadow-xs animate-pulse">
                      <span className="text-[9px] text-amber-700 font-bold flex items-center gap-1">💬 Отработка боли</span>
                      <p className="text-zinc-900 font-medium truncate text-[10px]">Робототехника (Алия)</p>
                      <div className="flex gap-1 justify-between text-[9px] text-zinc-500">
                        <span>Ребёнок: 6 лет</span>
                        <span className="text-zinc-800 font-bold text-[8px]">Парсит «Дорого»</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-2 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                    <span className="font-semibold text-emerald-800 block border-b border-zinc-200 pb-1 text-[10px]">ЗАПИСАН! (12)</span>
                    <div className="bg-emerald-50/45 p-2 rounded border border-emerald-200 space-y-1 shadow-xs">
                      <span className="text-[9px] text-emerald-800 font-bold flex items-center gap-1">⭐ Авто-Слот в CRM</span>
                      <p className="text-zinc-900 font-semibold truncate text-[10px]">Алан (Айгерим)</p>
                      <div className="flex gap-1 justify-between text-[9px] text-zinc-500">
                        <span>Сб 14:00 (Астана)</span>
                        <span className="text-emerald-700 font-bold">Ждем визита!</span>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="bg-zinc-50 p-3 rounded-lg text-xs leading-relaxed text-zinc-600 font-light text-center border border-zinc-200 flex items-center justify-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
                  <span>Менеджеру остается только прийти в центр в назначенное время и провести качественное занятие! Лид полностью прогрет и записан.</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
