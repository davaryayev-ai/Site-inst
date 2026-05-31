import React, { useState } from "react";
import { Send, CheckCircle2, Calendar, Phone, Users, Shield, ArrowUpRight } from "lucide-react";

export default function CtaSection() {
  const [formData, setFormData] = useState({
    centerName: "",
    ownerName: "",
    phone: "",
    crmType: "amoCRM",
    leadsCount: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || !formData.ownerName) return;

    setIsSubmitting(true);
    // Simulate API request persisting the data
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Save locally to simulate persistence
      localStorage.setItem("edubot_audit_request1", JSON.stringify(formData));
    }, 1200);
  };

  return (
    <div id="cta-section" className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xs">
      
      {isSuccess ? (
        /* SUCCESS ANIMATED GRAPHIC */
        <div className="py-12 text-center max-w-xl mx-auto space-y-6 relative z-10 animate-fade-in">
          <div className="mx-auto bg-emerald-50 p-4 rounded-full border border-emerald-200 w-fit text-emerald-850">
            <CheckCircle2 size={48} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900">
              Заявка успешно принята! 🎉
            </h3>
            <p className="text-sm text-zinc-650 font-sans leading-relaxed">
              Рахмет, <strong>{formData.ownerName}</strong>! Ваш запрос на бесплатный технический аудит упущенной выгоды для детского центра <strong>«{formData.centerName}»</strong> зарегистрирован в нашей системе.
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-zinc-200 text-xs font-mono text-left space-y-2 text-zinc-650 shadow-2xs">
            <p className="font-semibold text-zinc-900 border-b border-zinc-100 pb-1.5">📝 План следующих шагов:</p>
            <p>1. Наш ведущий ИИ-интегратор свяжется с вами по номеру <strong className="text-zinc-900">{formData.phone}</strong> (через Telegram/WhatsApp) в течение 15 минут в рабочее время Астаны.</p>
            <p>2. Мы согласуем удобное время для короткого 12-минутного созвона в Google Meet или Zoom.</p>
            <p>3. На встрече мы продемонстрируем индивидуальный демо-сценарий ИИ-ассистента, разработанный конкретно под ваши направления.</p>
          </div>
          <button
            onClick={() => setIsSuccess(false)}
            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg transition"
          >
            Подать еще одну заявку
          </button>
        </div>
      ) : (
        /* STANDARD FORM STATE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 items-center">
          
          {/* Sells Copy columns */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono text-zinc-700 uppercase tracking-widest bg-zinc-200 border border-zinc-300 px-3 py-1 rounded-full">
              Бесплатный Консультация-Аудит
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-zinc-900 leading-tight tracking-tight">
              Спасите упускаемую выгоду в Астане за 3 дня
            </h2>
            <p className="text-sm sm:text-base text-zinc-550 font-sans font-light leading-relaxed">
              Заполните простую форму справа. Наш эксперт проведет полный технический аудит вашей текущей воронки продаж, выявит слепые зоны в WhatsApp и соберет <strong>индивидуальный тестовый сценарий ИИ-Агента</strong> конкретно под специфику вашего детского центра — абсолютно бесплатно.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-sans text-xs">
              <div className="flex items-center gap-2.5 bg-white border border-zinc-200 px-4 py-3 rounded-xl shadow-2xs">
                <Calendar className="text-zinc-700 font-bold" size={18} />
                <div>
                  <p className="text-zinc-900 font-semibold">12 минут созвон</p>
                  <p className="text-zinc-500">Практические рекомендации</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-white border border-zinc-200 px-4 py-3 rounded-xl shadow-2xs">
                <Shield className="text-zinc-700" size={18} />
                <div>
                  <p className="text-zinc-900 font-semibold">Без обязательств</p>
                  <p className="text-zinc-500">Для любой CRM в Казахстане</p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 italic font-sans max-w-md">
              * Мы гарантируем конфиденциальность. Логи переписок с вашими родителями защищены договором NDA.
            </p>
          </div>

          {/* Form container code */}
          <div className="lg:col-span-6 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="font-display font-bold text-zinc-900 text-lg sm:text-xl mb-4 text-center sm:text-left">
              Запись на аудит вашей воронки
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Center Name */}
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 block font-sans">Название центра развития</label>
                  <input
                    type="text"
                    required
                    placeholder="Например: Астана Kids, РобоКласс"
                    value={formData.centerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, centerName: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-250 text-sm text-zinc-800 placeholder-zinc-400 rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-400 transition font-sans"
                  />
                </div>

                {/* 2. Owner Name */}
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 block font-sans">Имя руководителя / контакта</label>
                  <input
                    type="text"
                    required
                    placeholder="Ваше имя"
                    value={formData.ownerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-250 text-sm text-zinc-800 placeholder-zinc-400 rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-400 transition font-sans"
                  />
                </div>
              </div>

              {/* 3. Phone */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 block font-sans">WhatsApp или ник в Telegram</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">
                    <Phone size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="+7 (701) 000-00-00 или @username"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-250 text-sm text-zinc-800 placeholder-zinc-400 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-zinc-400 transition font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 4. CRM Type */}
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 block font-sans">Какую CRM используете?</label>
                  <select
                    value={formData.crmType}
                    onChange={(e) => setFormData(prev => ({ ...prev, crmType: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-250 text-sm text-zinc-800 rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-400 transition font-sans cursor-pointer"
                  >
                    <option value="amoCRM">amoCRM</option>
                    <option value="Bitrix24">Битрикс24</option>
                    <option value="Мой Класс">Мой Класс</option>
                    <option value="Нет CRM">Не используем CRM</option>
                  </select>
                </div>

                {/* 5. Leads Count */}
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 block font-sans">Новых лидов в месяц (примерно)</label>
                  <input
                    type="number"
                    required
                    placeholder="Например: 120"
                    min="1"
                    value={formData.leadsCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, leadsCount: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-250 text-sm text-zinc-800 placeholder-zinc-400 rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-400 transition font-sans"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm py-3 px-4 rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Отправка и проверка...</span>
                ) : (
                  <>
                    <span>Получить бесплатный аудит в Астане</span>
                    <ArrowUpRight size={16} />
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      )}

    </div>
  );
}
