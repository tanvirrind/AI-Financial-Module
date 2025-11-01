
import { GoogleGenAI } from "@google/genai";
import { Assumptions, FinancialData } from '../types';

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
  }
  return apiKey;
};

// This function formats the complex financial data into a simpler string for the AI prompt
const formatFinancialContext = (data: FinancialData, assumptions: Assumptions): string => {
  const summary = {
    assumptions: {
      initialMRR: assumptions.initialMonthlyRevenue,
      growthRate: `${(assumptions.monthlyGrowthRate * 100).toFixed(1)}%`,
      churnRate: `${(assumptions.churnRate * 100).toFixed(1)}%`,
      cogs: `${(assumptions.cogsPercentage * 100).toFixed(1)}%`,
    },
    latestMonth: data.monthly[data.monthly.length - 1],
    year1Summary: data.annual[0],
    year5Summary: data.annual[4],
    kpis: data.kpis,
  };

  return `
--- FINANCIAL MODEL CONTEXT ---
Here is a summary of the current 5-year financial model. Use this data to answer the user's question.

ASSUMPTIONS:
- Initial MRR: $${summary.assumptions.initialMRR.toLocaleString()}
- Monthly Growth Rate: ${summary.assumptions.growthRate}
- Churn Rate: ${summary.assumptions.churnRate}
- COGS Percentage: ${summary.assumptions.cogs}

KEY PERFORMANCE INDICATORS (KPIs):
- Peak Monthly Burn: $${Math.abs(summary.kpis.peakBurn).toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Current Runway: ${summary.kpis.runwayMonths === Infinity ? 'Infinite' : `${summary.kpis.runwayMonths} months`}

FINANCIAL HIGHLIGHTS:
- Year 1 Revenue: $${summary.year1Summary.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Year 1 Net Income: $${summary.year1Summary.netIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Year 5 Revenue: $${summary.year5Summary.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Year 5 Net Income: $${summary.year5Summary.netIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Cash balance at end of Year 5: $${summary.year5Summary.cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}

LATEST MONTH DATA (Month 60):
- MRR: $${summary.latestMonth.mrr.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Net Income: $${summary.latestMonth.netIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Ending Cash: $${summary.latestMonth.cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}
--- END OF CONTEXT ---
`;
};


export const getAIAssistance = async (
  prompt: string,
  financialData: FinancialData,
  assumptions: Assumptions
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    const financialContext = formatFinancialContext(financialData, assumptions);
    const fullPrompt = `${financialContext}\n\nUser Question: "${prompt}"\n\nAnswer:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: "You are an expert financial analyst providing advice to a startup founder. Be concise, insightful, and use the provided financial context to answer questions. Format your answers clearly, using markdown for lists or emphasis where appropriate.",
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return "There was an issue communicating with the AI. Please check your API key and try again.";
  }
};
