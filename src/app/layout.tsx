import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartSplit - AI Expense Splitter",
  description: "Quick, beautiful, and AI-powered expense splitting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-900 text-slate-50`}>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900 -z-10" />
        
        <header className="px-6 py-4 border-b border-indigo-500/20 flex flex-row items-center gap-3 sticky top-0 z-50 bg-slate-900/60 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <span className="text-xl">💸</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 font-sans tracking-tight">
            SmartSplit
          </h1>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 animate-slide-up">
          {children}
        </main>
      </body>
    </html>
  );
}
