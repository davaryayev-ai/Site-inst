import { useState, useEffect } from "react";
import { CalculatorInputs, CalculatorOutputs } from "../types";
import { AlertCircle, ArrowUpRight, TrendingDown, Users, Award } from "lucide-react";

export default function LossCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyLeads: 60,
    leadCost: 3500, // in Tenge
    avgResponseTime: 30, // in minutes
    coursePrice: 35000, // in Tenge (average monthly subscription in KZT)
    avgLifetimeMonths: 4,
    nightLeadsPercent: 30,
  });

  const [outputs, setOutputs] = useState<CalculatorOutputs>({
    missedLeadsNight: 0,
    missedLeadsDelayed: 0,
    totalMissedLeads: 0,
    lostCashMonthly: 0,
    lostRevenueMonthly: 0,
    lostRevenueYearly: 0,
    savedWithAIAgent: 0,
    savedCashMonthly: 0,
  });

  useEffect(() => {
    const {
      monthlyLeads,
      leadCost,
      avgResponseTime,
      coursePrice,
      avgLifetimeMonths,
      nightLeadsPercent,
    } = inputs;

    const ltv = coursePrice * avgLifetimeMonths;
    const baseCR = 0.11; // 11% average baseline lead-to-enrollment rate in KZT kids centers for fast response

    // Calculate Response Time Multiplier (Efficiency)
    let timeMultiplier = 1.0;
    if (avgResponseTime <= 5) {
      timeMultiplier = 1.0;
    } else if (avgResponseTime <= 15) {
      timeMultiplier = 0.78;
    } else if (avgResponseTime <= 30) {
      timeMultiplier = 0.55;
    } else if (avgResponseTime <= 60) {
      timeMultiplier = 0.38;
    } else if (avgResponseTime <= 180) {
      timeMultiplier = 0.18;
    } else {
      timeMultiplier = 0.04;
    }

    // Leads received during night/weekends
    const nightLeads = monthlyLeads * (nightLeadsPercent / 100);
    // Day leads
    const dayLeads = monthlyLeads * (1 - nightLeadsPercent / 100);

    // Day lead efficiency loss
    const lostDayLeadsEffective = dayLeads * (1 - timeMultiplier);

    // Night lead loss (typically left for > 10 hours, efficiency is 0.04)
    const lostNightLeadsEffective = nightLeads * (1 - 0.04);

    const totalLostLeadsEffective = lostDayLeadsEffective + lostNightLeadsEffective;
    
    // Lost students (enrollments)
    const lostStudents = totalLostLeadsEffective * baseCR;
    
    // Helper to round to nearest 1000 KZT
    const round1000 = (val: number) => Math.round(val / 1000) * 1000;

    // Direct immediate cash loss in first month (in KZT) - rounded to nearest 1000
    const lostCashMonthly = round1000(lostStudents * coursePrice);
    // Long-term LTV lost revenue per month - rounded to nearest 1000
    const lostRevenueMonthly = round1000(lostStudents * ltv);
    const lostRevenueYearly = lostRevenueMonthly * 12;

    // With AI agent, we recover about 85% of these lost leads - rounded to nearest 1000
    const savedWithAIAgent = round1000(lostRevenueMonthly * 0.85);
    const savedCashMonthly = round1000(lostCashMonthly * 0.85);

    setOutputs({
      missedLeadsNight: Math.round(nightLeads),
      missedLeadsDelayed: Math.round(dayLeads * (1 - timeMultiplier)),
      totalMissedLeads: Math.round(totalLostLeadsEffective),
      lostCashMonthly,
      lostRevenueMonthly,
      lostRevenueYearly,
      savedWithAIAgent,
      savedCashMonthly,
    });
  }, [inputs]);

  const formatTenge = (val: number) => {
    return new Intl.NumberFormat("ru-KZ", {
      style: "currency",
      currency: "KZT",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSliderChange = (key: keyof CalculatorInputs, val: number) => {
    setInputs((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  return (
    <div id="calculator-section" className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Sliders Area (7 Columns on large screens) */}
        <div className="lg:col-span-7 space-y-12">
          <div>
            <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full">
              Интерактивный Расчет (Казахстан • KZT)
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold mt-3 text-zinc-900">
              Калькулятор потерь и упущенной прибыли
            </h3>
            <p className="text-sm text-zinc-500 mt-2 font-sans font-light">
              Перетащите ползунки или введите ваши точные числа вручную, чтобы увидеть, сколько чистой прибыли уходит к конкурентам из-за задержек в ответах.
            </p>
          </div>

          <div className="space-y-10 pt-4">
            
            {/* 1. Monthly Leads */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="text-zinc-700 font-medium">Новых заявок (лидов) в месяц</label>
                <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1 text-sm shadow-2xs">
                  <input
                    type="number"
                    value={inputs.monthlyLeads || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number(e.target.value);
                      handleSliderChange("monthlyLeads", val);
                    }}
                    onBlur={() => {
                      const val = Math.max(1, Math.min(10000, inputs.monthlyLeads || 0));
                      handleSliderChange("monthlyLeads", val);
                    }}
                    className="w-16 bg-transparent text-right font-mono font-bold text-zinc-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-zinc-500 font-mono text-xs border-l border-zinc-200 pl-1.5">лидов</span>
                </div>
              </div>
              <input
                id="slider-leads"
                type="range"
                min="5"
                max="1000"
                step="5"
                value={inputs.monthlyLeads}
                onChange={(e) => handleSliderChange("monthlyLeads", Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-700 focus:outline-none"
              />
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>5</span>
                <span>500</span>
                <span>1000+</span>
              </div>
            </div>

            {/* 2. Lead Cost (CPL) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="text-zinc-700 font-medium">Стоимость одного лида (бюджет)</label>
                <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1 text-sm shadow-2xs">
                  <input
                    type="number"
                    value={inputs.leadCost || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number(e.target.value);
                      handleSliderChange("leadCost", val);
                    }}
                    onBlur={() => {
                      const val = Math.max(100, Math.min(100000, inputs.leadCost || 0));
                      handleSliderChange("leadCost", val);
                    }}
                    className="w-20 bg-transparent text-right font-mono font-bold text-zinc-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-zinc-500 font-mono text-xs border-l border-zinc-200 pl-1.5 font-sans font-medium">₸</span>
                </div>
              </div>
              <input
                id="slider-cpl"
                type="range"
                min="500"
                max="25000"
                step="100"
                value={inputs.leadCost}
                onChange={(e) => handleSliderChange("leadCost", Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-700 focus:outline-none"
              />
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>500 ₸</span>
                <span>12 500 ₸</span>
                <span>25 000 ₸+</span>
              </div>
            </div>

            {/* 3. Avg Response Time */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="text-zinc-700 font-medium">Среднее время ответа на заявку</label>
                <div className="flex items-center gap-1.5 bg-amber-50/60 border border-amber-200 rounded-lg px-2.5 py-1 text-sm shadow-2xs">
                  <input
                    type="number"
                    value={inputs.avgResponseTime || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number(e.target.value);
                      handleSliderChange("avgResponseTime", val);
                    }}
                    onBlur={() => {
                      const val = Math.max(1, Math.min(2880, inputs.avgResponseTime || 0));
                      handleSliderChange("avgResponseTime", val);
                    }}
                    className="w-16 bg-transparent text-right font-mono font-bold text-amber-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-amber-700 font-mono text-xs border-l border-amber-200 pl-1.5">минут</span>
                </div>
              </div>
              <input
                id="slider-time"
                type="range"
                min="5"
                max="480"
                step="5"
                value={inputs.avgResponseTime}
                onChange={(e) => handleSliderChange("avgResponseTime", Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-700 focus:outline-none"
              />
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span className="text-emerald-600">5 мин (Оперативно)</span>
                <span>2 часа (120 м)</span>
                <span>8 часов+ (480 м)</span>
              </div>
            </div>

            {/* 4. Course Price */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="text-zinc-700 font-medium">Стоимость абонемента / мес</label>
                <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1 text-sm shadow-2xs">
                  <input
                    type="number"
                    value={inputs.coursePrice || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number(e.target.value);
                      handleSliderChange("coursePrice", val);
                    }}
                    onBlur={() => {
                      const val = Math.max(1000, Math.min(500000, inputs.coursePrice || 0));
                      handleSliderChange("coursePrice", val);
                    }}
                    className="w-16 bg-transparent text-right font-mono font-bold text-zinc-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none opacity-90"
                  />
                  <span className="text-zinc-500 font-mono text-xs border-l border-zinc-200 pl-1.5">₸</span>
                </div>
              </div>
              <input
                id="slider-price"
                type="range"
                min="5000"
                max="120000"
                step="500"
                value={inputs.coursePrice}
                onChange={(e) => handleSliderChange("coursePrice", Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-700 focus:outline-none"
              />
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>5 000 ₸</span>
                <span>62 500 ₸</span>
                <span>120 000 ₸+</span>
              </div>
            </div>

            {/* 5. Lifetime months */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="text-zinc-700 font-medium">LTV (продолжительность обучения)</label>
                <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1 text-sm shadow-2xs">
                  <input
                    type="number"
                    value={inputs.avgLifetimeMonths || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number(e.target.value);
                      handleSliderChange("avgLifetimeMonths", val);
                    }}
                    onBlur={() => {
                      const val = Math.max(1, Math.min(24, inputs.avgLifetimeMonths || 0));
                      handleSliderChange("avgLifetimeMonths", val);
                    }}
                    className="w-10 bg-transparent text-right font-mono font-bold text-zinc-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none opacity-90"
                  />
                  <span className="text-zinc-500 font-mono text-xs border-l border-zinc-200 pl-1.5">мес.</span>
                </div>
              </div>
              <input
                id="slider-ltv"
                type="range"
                min="1"
                max="12"
                step="1"
                value={inputs.avgLifetimeMonths}
                onChange={(e) => handleSliderChange("avgLifetimeMonths", Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-700 focus:outline-none"
              />
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>1 мес</span>
                <span>6 мес</span>
                <span>12 мес</span>
              </div>
            </div>

            {/* 6. Night Leads Percent */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5">
                  <label className="text-zinc-700 font-medium">Ночной трафик (вечер, выходные)</label>
                  <AlertCircle size={14} className="text-zinc-400 hover:text-zinc-650 cursor-help" title="Родители ищут кружки по вечерам после работы и на выходных" />
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1 text-sm shadow-2xs">
                  <input
                    type="number"
                    value={inputs.nightLeadsPercent || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number(e.target.value);
                      handleSliderChange("nightLeadsPercent", val);
                    }}
                    onBlur={() => {
                      const val = Math.max(0, Math.min(100, inputs.nightLeadsPercent || 0));
                      handleSliderChange("nightLeadsPercent", val);
                    }}
                    className="w-10 bg-transparent text-right font-mono font-bold text-zinc-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-zinc-500 font-mono text-xs border-l border-zinc-200 pl-1.5">%</span>
                </div>
              </div>
              <input
                id="slider-night"
                type="range"
                min="0"
                max="100"
                step="5"
                value={inputs.nightLeadsPercent}
                onChange={(e) => handleSliderChange("nightLeadsPercent", Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-700 focus:outline-none"
              />
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>0%</span>
                <span>30% (Среднее по РК)</span>
                <span>100% (Весь трафик ночью)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Dashboard Analysis Output (5 Columns) */}
        <div className="lg:col-span-12 xl:col-span-5 lg:border-t xl:border-t-0 xl:border-l border-zinc-200 lg:pt-8 xl:pt-0 xl:pl-10 flex flex-col justify-between space-y-8">
          
          <div className="space-y-6">
            <h4 className="text-lg font-display font-semibold text-zinc-800 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <TrendingDown className="text-zinc-650" size={18} />
              Канал упущенных продаж
            </h4>

            {/* Big Loss Stat Display */}
            <div className="bg-zinc-50 border border-zinc-250 rounded-2xl p-6 text-center animate-fade-in">
              <p className="text-xs font-mono text-zinc-655 uppercase tracking-widest flex items-center justify-center gap-1.5 font-bold">
                <AlertCircle size={14} className="text-zinc-600" /> Упущенная касса в 1-й месяц
              </p>
              <h5 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-900 mt-2 tracking-tight">
                {formatTenge(outputs.lostCashMonthly)}
              </h5>
              <p className="text-xs text-zinc-500 mt-1">
                непосредственная упущенная выручка за первый месяц обучения
              </p>
            </div>

            {/* Mini stats breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50/55 border border-zinc-200 rounded-xl p-4">
                <p className="text-xs text-zinc-550 font-medium">Упущено лидов</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-mono text-zinc-900 font-bold">{outputs.totalMissedLeads}</span>
                  <span className="text-xs text-zinc-500">/ мес</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 font-light leading-snug">
                  слито в нерабочие часы или из-за задержек
                </p>
              </div>

              <div className="bg-zinc-50/55 border border-zinc-200 rounded-xl p-4">
                <p className="text-xs text-zinc-550 font-medium">Бюджет впустую</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-mono text-zinc-900 font-bold">
                    {formatTenge(outputs.totalMissedLeads * inputs.leadCost)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 font-light leading-snug">
                  рекламный бюджет на лидов, которые просто остыли
                </p>
              </div>
            </div>

            {/* Details list for business */}
            <div className="space-y-3 bg-zinc-50 p-4 border border-zinc-200 rounded-2xl text-xs font-sans text-zinc-700">
              <div className="flex justify-between items-center border-b border-zinc-150 pb-2">
                <span className="text-zinc-555">Упущенный LTV-доход за месяц:</span>
                <span className="text-zinc-900 font-semibold font-mono">{formatTenge(outputs.lostRevenueMonthly)}</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-snug">
                * Упущенный LTV-доход (Lifetime Value) учитывает среднюю продолжительность обучения ученика ({inputs.avgLifetimeMonths} мес.). Это общая прибыль, которую принесли бы потерянные за этот месяц клиенты.
              </p>
            </div>

            {/* Yearly Stat */}
            <div className="flex justify-between items-center bg-zinc-100/80 px-4 py-3 border border-zinc-200 rounded-xl text-sm">
              <span className="text-zinc-650 font-medium">Упущенный LTV-доход за год:</span>
              <span className="text-zinc-900 font-mono font-bold text-base">
                {formatTenge(outputs.lostRevenueYearly)}
              </span>
            </div>
          </div>

          {/* Dynamic Saving ROI Card with AI Agent */}
          <div className="bg-zinc-950 text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
            
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 bg-zinc-800 border border-zinc-750 rounded-lg">
                <Award className="text-zinc-200" size={16} />
              </span>
              <p className="text-xs uppercase tracking-wider font-mono text-zinc-300 font-semibold">
                Решение: Внедрение ИИ-Агента
              </p>
            </div>

            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Автоматический ассистент мгновенно перехватывает родителей в <strong className="font-semibold text-white">WhatsApp, Instagram и Telegram</strong>, детально снимает возражения и вносит сделку в вашу CRM за <strong className="font-semibold text-white">3 секунды</strong>.
            </p>

            <div className="mt-4 pt-3 border-t border-zinc-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-zinc-400">Спасенная касса (1-й месяц):</span>
                <span className="text-sm font-mono font-bold text-white">+{formatTenge(outputs.savedCashMonthly)} / мес.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-zinc-400">Спасенный LTV-доход:</span>
                <span className="text-base font-mono font-bold text-emerald-400">+{formatTenge(outputs.savedWithAIAgent)} / мес.</span>
              </div>
              <div className="pt-2 flex justify-end">
                <a href="#cta-section" className="flex items-center gap-1.5 text-xs bg-white hover:bg-zinc-100 transition text-zinc-950 font-semibold px-3 py-2 rounded-lg cursor-pointer">
                  Спасти маржу
                  <ArrowUpRight size={14} className="text-zinc-950" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


