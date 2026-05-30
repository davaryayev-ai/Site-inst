export interface Message {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ChatMode = 'parent_simulation' | 'owner_objections';

export interface CalculatorInputs {
  monthlyLeads: number;       // Average monthly leads
  leadCost: number;           // Cost of one lead (CPL) in tenge
  avgResponseTime: number;    // In minutes
  coursePrice: number;        // Course price per month in tenge
  avgLifetimeMonths: number;  // How many months a pupil stays
  nightLeadsPercent: number;  // % of leads coming during weekends/evenings/nights (usually 30-40%)
}

export interface CalculatorOutputs {
  missedLeadsNight: number;      // Leads missed because of offline hours
  missedLeadsDelayed: number;    // Leads cold because of delayed response
  totalMissedLeads: number;      // Combined lost opportunities
  lostCashMonthly: number;       // Direct immediate cash loss in first month (in KZT)
  lostRevenueMonthly: number;    // Long-term LTV lost revenue per month
  lostRevenueYearly: number;     // Lost revenue in tenge per year
  savedWithAIAgent: number;      // Estimate of LTV revenue saved with AI Agent per month
  savedCashMonthly: number;      // Estimate of immediate cash saved with AI Agent per month
}


