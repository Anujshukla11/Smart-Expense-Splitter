import { createOrJoinGroup } from "./actions";
import { ArrowRight, Wallet } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-slide-up">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)] animate-coin border border-indigo-500/30">
          <Wallet className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Split <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Smarts</span>, <br />
          Stay Friends.
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto font-light">
          Manage shared expenses for trips, roommates, or dates completely automatically with AI. No complex sign-ups.
        </p>
      </div>

      <div className="glass-panel p-8 w-full max-w-md mt-8">
        <form action={createOrJoinGroup} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-slate-300 text-left">
            Start a new group or join existing
          </label>
          <div className="relative">
            <input 
              name="name" 
              type="text" 
              placeholder="e.g. Goa Trip 2026" 
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-500 text-white"
            />
          </div>
          <button 
            type="submit" 
            className="group relative flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium transition-all active:scale-[0.98]"
          >
            Let's Go
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
