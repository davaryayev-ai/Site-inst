import React, { useState } from "react";
import { motion } from "motion/react";
import PainPoints from "./components/PainPoints";
import LossCalculator from "./components/LossCalculator";
import AIAgentChat from "./components/AIAgentChat";
import Solutions from "./components/Solutions";
import CrmShowcase from "./components/CrmShowcase";
import CtaSection from "./components/CtaSection";
import { 
  Bot, 
  ChevronDown, 
  Compass, 
  HelpCircle, 
  ArrowUpRight, 
  Network, 
  TrendingUp, 
  ShieldAlert,
  Zap,
  CheckCircle,
  Menu,
  X 
} from "lucide-react";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqData = [
    {
      q: "Как ИИ понимает, какие услуги оказывает именно наш детский центр?",
      a: "Мы формируем жесткую Базу Знаний (регламент) на основе ваших текущих прайс-листов, адресов филиалов в Астане или других городах РК, актуального расписания и скриптов лучших методистов. Бот отвечает строго в рамках этих границ и физически не может придумывать несуществующие скидки или придумывать условия."
    },
    {
      q: "Что если родитель напишет сложный или некорректный вопрос на казахском?",
      a: "Наш ИИ-агент невероятно гибок и понимает как русский, так и казахский язык. В случае сложного обращения или жалобы, ассистент вежливо зафиксирует контакты и напишет: «Сейчас я уточню этот вопрос у руководителя и вернусь к вам!», после чего сделка мгновенно подсветится в вашей CRM."
    },
    {
      q: "Какие CRM-системы и мессенджеры вы поддерживаете в Казахстане?",
      a: "Мы настраиваем интеграцию «под ключ» с amoCRM, Битрикс24 и Мой Класс. Рабочие каналы включают WhatsApp (через официальные шлюзы White/Green API), Instagram Direct и Telegram (через обычные номера или ботов)."
    },
    {
      q: "Родителям не будет неприятно общаться с роботом?",
      a: "Современные модели ИИ общаются плавно, вежливо и пишут структурированно. Опыт показывает, что 91% родителей даже не догадываются, что общаются с ИИ-системой, радуясь мгновенному ответу за 3 секунды вместо томительного ожидания администратора."
    },
    {
      q: "Сколько стоит содержание такого ИИ-агента на самом деле?",
      a: "Вы абсолютно правы, итоговые затраты масштабируются вместе с вашим трафиком. Затраты на ИИ-запросы и хостинг для небольшого центра получаются крайне незначительными благодаря сверхнизкой стоимости токенов у современных моделей вроде Gemini 1.5 Flash. При росте потока клиентов бюджет складывается из трёх частей: 1) Копеечные API-токены ИИ, 2) WhatsApp-транспорт — либо безлимитный неофициальный шлюз (около 9 000 – 15 000 ₸/мес), либо официальный WABA с оплатой около 30–40 ₸ за каждую начатую 24-часовую сессию с родителем, 3) Наша техническая поддержка. Даже если ваш центр получает сотни лидов и тратит на обслуживание 30 000 ₸ в месяц, окупаемость наступает при спасении всего одного клиента, ведь LTV регулярного обучения ребенка в Астане превышает 140 000 ₸."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans relative antialiased">
      
      {/* Nav Header */}
      <header className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bot className="text-emerald-600 stroke-[2.2] shrink-0" size={28} />
            <div>
              <span className="font-display font-bold text-base tracking-tight text-zinc-950 block">
                LeadFlow
              </span>
              <span className="text-[10px] text-zinc-550 uppercase font-mono tracking-widest block -mt-1 font-bold">
                детские центры в РК • 24/7
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#pain-points" className="text-zinc-600 hover:text-zinc-950 transition font-medium">Боли</a>
            <a href="#calculator" className="text-zinc-600 hover:text-zinc-950 transition font-medium">Калькулятор упущенной прибыли</a>
            <a href="#demo-chat" className="text-zinc-600 hover:text-zinc-950 transition font-medium">Тест-Драйв</a>
            <a href="#solutions" className="text-zinc-600 hover:text-zinc-950 transition font-medium">Преимущества</a>
            <a href="#crm" className="text-zinc-600 hover:text-zinc-950 transition font-medium">CRM</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="#calculator" 
              className="text-xs font-mono text-zinc-900 hover:text-zinc-700 border border-zinc-300 hover:bg-zinc-50 px-4 py-2 rounded-xl transition duration-200 font-semibold"
            >
              Рассчитать потери (₸)
            </a>
            <a 
              href="#cta-section" 
              className="text-xs bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-4 py-2 rounded-xl transition duration-200 shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Записаться</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-1.5 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-700 hover:text-zinc-950"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-zinc-200 px-4 py-6 space-y-4 animate-fade-in">
            <nav className="flex flex-col gap-3 text-sm">
              <a href="#pain-points" onClick={() => setMobileMenuOpen(false)} className="text-zinc-700 hover:text-zinc-950 transition font-semibold">Боли владельцев</a>
              <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="text-zinc-700 hover:text-zinc-950 transition font-semibold">Калькулятор упущенной прибыли</a>
              <a href="#demo-chat" onClick={() => setMobileMenuOpen(false)} className="text-zinc-700 hover:text-zinc-950 transition font-semibold">Интерактивный Чат-Симулятор</a>
              <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="text-zinc-700 hover:text-zinc-950 transition font-semibold">Как это работает</a>
              <a href="#crm" onClick={() => setMobileMenuOpen(false)} className="text-zinc-700 hover:text-zinc-950 transition font-semibold">Интеграция с CRM</a>
            </nav>
            <div className="pt-4 border-t border-zinc-200 flex flex-col gap-3">
              <a 
                href="#calculator" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-xs font-mono text-zinc-800 border border-zinc-200 px-4 py-2 rounded-xl font-semibold"
              >
                Рассчитать потери филиала (₸)
              </a>
              <a 
                href="#cta-section" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-xs bg-zinc-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs"
              >
                Получить бесплатный аудит
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section 
        className="relative pt-12 pb-20 sm:pb-28 bg-[#faf8f5]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-650 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-800"></span>
            </span>
            <span className="text-[11px] font-mono text-zinc-700 uppercase tracking-wider font-semibold">
              LeadFlow • Продажи обучения 24/7
            </span>
          </div>

          <div className="space-y-4 max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-zinc-900 tracking-tight leading-[1.08] text-balance">
              ИИ-Агент, который дожимает <br className="hidden sm:inline" />
              <span className="text-zinc-700">
                родителей на запись на пробный урок
              </span> <br />
              пока ваши администраторы в Астане спят
            </h1>
            <p className="text-zinc-500 font-sans max-w-3xl mx-auto text-base sm:text-lg font-light leading-relaxed">
              Умный виртуальный ассистент отвечает за <strong>3 секунды</strong> в WhatsApp и Telegram, обрабатывает 100% возражений по ценам или локации, квалифицирует лида и сам записывает его в CRM-систему.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a 
              href="#calculator" 
              className="w-full sm:w-auto text-sm bg-zinc-900 hover:bg-zinc-850 active:scale-98 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xs transition-all duration-205 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Запустить расчет упущенной выгоды (₸)</span>
              <TrendingUp size={16} className="group-hover:translate-y-[-1px] group-hover:translate-x-[1px] transition-transform" />
            </a>
            <a 
              href="#demo-chat" 
              className="w-full sm:w-auto text-sm bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 font-semibold px-6 py-3.5 rounded-2xl shadow-2xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Пройти Тест-Драйв ассистента</span>
              <Bot size={16} className="text-zinc-600" />
            </a>
          </div>

          {/* Core high level bullet anchors */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-zinc-200 font-mono text-xs text-zinc-500">
            <div className="space-y-1">
              <span className="text-zinc-900 text-lg sm:text-xl font-bold font-display block">~3 сек</span>
              <span>Скорость ответа ИИ</span>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-900 text-lg sm:text-xl font-bold font-display block">100%</span>
              <span>Охват ночного трафика</span>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-900 text-lg sm:text-xl font-bold font-display block">&lt; 3 суток</span>
              <span>Интеграция с вашей CRM</span>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-900 text-lg sm:text-xl font-bold font-display block">24/7</span>
              <span>Работа без сна и выходных</span>
            </div>
          </div>

        </div>
      </section>

      {/* Pain Points Section Anchor */}
      <section 
        id="pain-points" 
        className="py-16 sm:py-24 border-t border-zinc-200 bg-[#faf8f5]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PainPoints />
        </div>
      </section>

      {/* Calculator Section Anchor */}
      <section 
        id="calculator" 
        className="py-16 sm:py-24 border-t border-zinc-220 bg-[#f5f3ef]/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LossCalculator />
        </div>
      </section>

      {/* Interactive Chat Playground Anchor */}
      <section 
        id="demo-chat" 
        className="py-16 sm:py-24 bg-[#f5f3ef]/30 border-t border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-xs font-mono text-zinc-650 uppercase tracking-widest bg-white border border-zinc-200 px-3 py-1 rounded-full">
              Живой Стенд Тестирования
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-zinc-900 tracking-tight leading-tight max-w-4xl mx-auto text-balance">
              Протестируйте ИИ-Агента в реальном времени
            </h2>
            <p className="text-zinc-500 font-sans max-w-2xl mx-auto text-sm sm:text-base font-light">
              Проверьте, как ИИ-ассистент мгновенно отвечает в мессенджере от лица администратора образовательного центра, отрабатывает возражения и закрывает сделку.
            </p>
          </div>

          <AIAgentChat />
        </div>
      </section>

      {/* Solutions Grid */}
      <section 
        id="solutions" 
        className="py-16 sm:py-24 border-t border-zinc-200 bg-[#faf8f5]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Solutions />
        </div>
      </section>

      {/* CRM Integration Section Anchor */}
      <section 
        id="crm" 
        className="py-16 sm:py-24 bg-[#f5f3ef]/50 border-t border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrmShowcase />
        </div>
      </section>

      {/* Consulting Booking */}
      <section 
        id="cta-section"
        className="py-16 sm:py-24 border-t border-zinc-200 bg-[#faf8f5]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CtaSection />
        </div>
      </section>

      {/* FAQs accordion */}
      <section 
        className="py-16 sm:py-24 bg-[#f5f3ef]/30 border-t border-zinc-200"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-zinc-650 uppercase tracking-widest bg-white border border-zinc-200 px-3 py-1 rounded-full">
              Популярные вопросы
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900">
              Отвечаем на сомнения владельцев центров
            </h3>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-sans text-zinc-800 hover:text-zinc-950 font-semibold cursor-pointer"
                >
                  <span className="text-xs sm:text-sm md:text-base">{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-zinc-400 transition-transform duration-300 shrink-0 ${activeFaq === idx ? "rotate-180 text-zinc-800" : ""}`} 
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-zinc-650 text-xs sm:text-sm font-sans font-light leading-relaxed border-t border-zinc-150">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-50 py-12 border-t border-zinc-200 text-xs text-zinc-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Bot className="text-zinc-800" size={14} />
              <span className="text-zinc-900 font-display font-bold text-sm tracking-tight">LeadFlow</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">АВТОНОМНЫЕ СИСТЕМЫ ПРОДАЖ ДЛЯ СФЕРЫ ОБРАЗОВАНИЯ В КАЗАХСТАНЕ</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-500 text-[11px]">
            <a href="#pain-points" className="hover:text-zinc-900 transition">Боли</a>
            <a href="#calculator" className="hover:text-zinc-900 transition">Калькулятор потерь</a>
            <a href="#demo-chat" className="hover:text-zinc-900 transition">Тест-Драйв ИИ</a>
            <a href="#solutions" className="hover:text-zinc-900 transition">Решения</a>
            <a href="#crm" className="hover:text-zinc-900 transition">Интеграции</a>
          </div>

          <p className="text-[10px] text-zinc-400 font-mono text-center md:text-right">
            © 2026 LeadFlow. Все права защищены.<br />
            Настроено в Астане &middot; Интеграция под ключ за 3 суток
          </p>
        </div>
      </footer>

    </div>
  );
}
