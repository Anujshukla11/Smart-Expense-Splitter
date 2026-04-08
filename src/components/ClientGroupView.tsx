"use client"
import { useState, useTransition } from "react"
import { addMemberToGroup, addExpense, addSettlement } from "@/app/actions"
import confetti from "canvas-confetti"
import { Plus, Users, Receipt, Sparkles, HandCoins, ArrowRight } from "lucide-react"

export default function ClientGroupView({ group, settlements, insights, balances }: any) {
  const [activeTab, setActiveTab] = useState("expenses")
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    await addMemberToGroup(group.id, formData.get("name") as string)
    setIsSubmitting(false)
    setShowMemberModal(false)
  }

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const amount = parseFloat(formData.get("amount") as string)
    const description = formData.get("description") as string
    const paidById = formData.get("paidById") as string
    
    // Default: split equally among all current users
    const splitAmongUserIds = group.users.map((u:any) => u.id)
    
    await addExpense(group.id, { description, amount, paidById, splitAmongUserIds })
    
    setIsSubmitting(false)
    setShowExpenseModal(false)
    
    // Trigger tiny confetti on expense added for cute UI
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.9, x: 0.5 }, colors: ['#0ea5e9'] })
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <Users className="w-4 h-4" /> {group.users.length} Members
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowMemberModal(true)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700">
            + Add Member
          </button>
          {group.users.length > 0 && (
            <button onClick={() => setShowExpenseModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              + Add Expense
            </button>
          )}
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="glass-panel p-5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-1">AI Insights</h3>
            <p className="text-slate-200">{insights}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button onClick={() => setActiveTab("expenses")} className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'expenses' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          Recent Expenses
        </button>
        <button onClick={() => setActiveTab("balances")} className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'balances' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          Balances
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "expenses" && (
        <div className="space-y-4">
          {group.expenses.length === 0 ? (
             <div className="text-center py-12 text-slate-500 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
               No expenses yet. Add one to get started!
             </div>
          ) : (
            group.expenses.map((exp: any) => (
              <div key={exp.id} className="glass-panel p-4 flex justify-between items-center hover:border-indigo-500/30 transition-all hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-xl">
                    {exp.category === 'Food' ? '🍕' : exp.category === 'Travel' ? '🚕' : exp.category === 'Rent' ? '🏠' : '💸'}
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{exp.description}</h4>
                    <p className="text-sm text-slate-400">Paid by {exp.paidBy.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl">₹{exp.amount.toFixed(2)}</div>
                  <div className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded inline-block mt-1">
                    {exp.category || "Uncategorized"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "balances" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settlements.length === 0 ? (
               <div className="col-span-full text-center py-12 text-slate-500 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
                 Everyone is settled up! 🎉
               </div>
            ) : (
              settlements.map((s:any, i:number) => (
                <div key={i} className="glass-panel p-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-200">{s.debtorName}</span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-slate-200">{s.creditorName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-rose-400">₹{s.amount.toFixed(2)}</span>
                    <button 
                      onClick={() => {
                        startTransition(async () => {
                          await addSettlement(group.id, s.debtor, s.creditor, s.amount);
                          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#10b981', '#fbbf24'] });
                        });
                      }}
                      disabled={isPending}
                      className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50" 
                      title="Settle Up"
                    >
                      <HandCoins className={`w-5 h-5 ${isPending ? 'animate-pulse' : ''}`} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel p-6 w-full max-w-sm animate-slide-up">
            <h2 className="text-xl font-bold mb-4">Add Group Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Name</label>
                <input name="name" required autoFocus className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 mt-1 outline-none focus:border-indigo-500" />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setShowMemberModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium">{isSubmitting ? "Adding..." : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel p-6 w-full max-w-md animate-slide-up">
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Description</label>
                <input name="description" placeholder="Dinner at Dominos" required autoFocus className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 mt-1 outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Amount (₹)</label>
                <input name="amount" type="number" step="0.01" min="0.01" placeholder="0.00" required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 mt-1 outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Who Paid?</label>
                <select name="paidById" required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 mt-1 outline-none focus:border-indigo-500">
                  {group.users.map((u:any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium">
                  {isSubmitting ? "Saving..." : <><Sparkles className="w-4 h-4"/> Add with AI</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
// ArrowRight icon logic fix:
// To ensure we get the ArrowRight inside this file, we must import it from lucide-react.
