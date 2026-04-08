import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getSpendingInsights } from "@/lib/ai"
import ClientGroupView from "@/components/ClientGroupView"

export default async function GroupPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      users: true,
      expenses: {
        include: {
          paidBy: true,
          splits: true
        },
        orderBy: { date: 'desc' }
      }
    }
  })

  if (!group) return notFound()

  // Calculate balances
  const balances: Record<string, number> = {} // userId -> net balance
  group.users.forEach((u: any) => balances[u.id] = 0)

  group.expenses.forEach((exp: any) => {
    // Credit the payer
    if (balances[exp.paidById] !== undefined) {
      balances[exp.paidById] += exp.amount
    }
    // Debit the splitters
    exp.splits.forEach((split: any) => {
      if (balances[split.userId] !== undefined) {
        balances[split.userId] -= split.amount
      }
    })
  })

  // Simplify debts
  type Debt = { debtor: string, creditor: string, amount: number, debtorName: string, creditorName: string }
  const settlements: Debt[] = []
  
  const debtors = group.users.map((u: any) => ({ ...u, bal: balances[u.id] })).filter((u: any) => u.bal < -0.01).sort((a: any,b: any) => a.bal - b.bal) // most negative first
  const creditors = group.users.map((u: any) => ({ ...u, bal: balances[u.id] })).filter((u: any) => u.bal > 0.01).sort((a: any,b: any) => b.bal - a.bal) // most positive first

  let d = 0, c = 0;
  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d]
    const creditor = creditors[c]
    const amount = Math.min(-debtor.bal, creditor.bal)
    
    // Add settlement record
    settlements.push({
      debtor: debtor.id,
      creditor: creditor.id,
      amount: Number(amount.toFixed(2)),
      debtorName: debtor.name,
      creditorName: creditor.name
    })

    debtor.bal += amount
    creditor.bal -= amount

    if (Math.abs(debtor.bal) < 0.01) d++
    if (Math.abs(creditor.bal) < 0.01) c++
  }

  // Get AI insights
  const insights = await getSpendingInsights(group.expenses)

  return (
    <ClientGroupView 
      group={group} 
      settlements={settlements} 
      insights={insights} 
      balances={balances} 
    />
  )
}
