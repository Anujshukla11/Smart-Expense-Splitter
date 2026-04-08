# 💸 SmartSplit - AI-Powered Expense Manager

SmartSplit is an elegant, incredibly fast, and user-friendly web application for sharing expenses among friends, roommates, and teams. Built for high performance and high visual fidelity, this project fully leverages modern web technologies and AI integrations.

## 🌟 Key Features

1. **Intelligent Expense Categorization (AI)**: Powered by Gemini 2.5 Flash, SmartSplit automatically categorizes your raw expenses ("Dinner at Dominos" -> "Food") the millisecond you hit submit.
2. **Spending Insights (AI)**: Analyzes the group's expenses and gives punchy, actionable insights on the dashboard (e.g. "You spent 40% on Food. Time to cook at home!").
3. **Debt Simplification Engine**: The robust balancing algorithm mathematically minimizes the number of transactions required for everyone to be settled up.
4. **Beautiful Glassmorphism UI**: Uses TailwindCSS to achieve a modern, vibrant dark-mode theme with micro-animations, confetti drops when settling up, and native-feeling dialogs.
5. **Instant Server Actions**: Built natively with Next.js App Router for instant form submissions without heavy client-side REST setup.

---

## 🛠️ Tech Architecture

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Vanilla CSS variables)
- **Database**: Prisma ORM + Local SQLite
- **AI Integration**: `@google/generative-ai` (Gemini 2.5 Flash) for Language Processing
- **UX Libraries**: `canvas-confetti` (interactions), `lucide-react` (icons)

---

## 🚀 Getting Started

Since it's built with local SQLite for development speed, you don't need any complex Docker or database setup!

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Your Environment
In the root directory, create a `.env.local` file with your Gemini API key:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
```
*(Also, the SQLite URL is hardcoded as `file:./dev.db` in `prisma/schema.prisma` for zero-setup convenience).*

### 3. Initialize the Database
Generate the Prisma engine and push the schema to SQLite:
```bash
npx prisma db push
```

### 4. Run the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

Enjoy staying friends without fighting over the bill!
