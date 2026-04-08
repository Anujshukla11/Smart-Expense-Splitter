import { GoogleGenerativeAI } from "@google/generative-ai";

export async function categorizeExpense(description: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "Other";
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Categorize the following expense description into exactly one of these categories: Food, Travel, Rent, Entertainment, Shopping, Groceries, or Other. Respond ONLY with the category name, nothing else. Description: "${description}"`;
    
    const result = await model.generateContent(prompt);
    const category = result.response.text().trim();
    return category;
  } catch (error) {
    console.error("AI Categorization failed:", error);
    return "Other";
  }
}

export async function getSpendingInsights(expenses: any[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || expenses.length === 0) return "Add some expenses to get AI insights!";
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are a helpful AI financial assistant. Here is a list of shared group expenses (amount, description, category):
    ${JSON.stringify(expenses.map(e => ({desc: e.description, amount: e.amount, cat: e.category})))}
    
    Provide a very short, friendly 1-2 sentence insight about their spending pattern. Make it punchy (e.g. "You guys spent 40% of the budget on Food. Time to cook at home!").`;
    
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error: any) {
    console.error("AI Insights failed:", error?.message || error);
    return "Insights are currently unavailable due to high API demand.";
  }
}
