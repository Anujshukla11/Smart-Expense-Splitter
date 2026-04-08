"use server"
import prisma from "@/lib/prisma"
import { categorizeExpense } from "@/lib/ai"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createOrJoinGroup(formData: FormData) {
  const name = formData.get("name")?.toString().trim()
  if (!name) return

  let group = await prisma.group.findFirst({ where: { name } })
  
  if (!group) {
    group = await prisma.group.create({ data: { name } })
  }
  
  redirect(`/group/${group.id}`)
}

export async function addMemberToGroup(groupId: string, memberName: string) {
  await prisma.user.create({
    data: { name: memberName, groupId }
  });
  revalidatePath(`/group/${groupId}`)
}

export async function addExpense(groupId: string, data: { description: string, amount: number, paidById: string, splitAmongUserIds: string[] }) {
  // Call AI to categorize
  const category = await categorizeExpense(data.description);

  // Save expense
  const expense = await prisma.expense.create({
    data: {
      description: data.description,
      amount: data.amount,
      groupId,
      category,
      paidById: data.paidById,
    }
  });

  // Calculate equal split amount
  const splitAmount = data.amount / data.splitAmongUserIds.length;

  // Add splits
  for (const userId of data.splitAmongUserIds) {
    await prisma.expenseSplit.create({
      data: {
        amount: splitAmount,
        expenseId: expense.id,
        userId: userId
      }
    });
  }

  revalidatePath(`/group/${groupId}`)
  return { success: true };
}

export async function addSettlement(groupId: string, debtorId: string, creditorId: string, amount: number) {
  await prisma.expense.create({
    data: {
      groupId,
      description: "Settlement 💸",
      amount,
      paidById: debtorId,
      category: "Transfer",
      splits: { create: [{ userId: creditorId, amount }] }
    }
  });

  revalidatePath(`/group/${groupId}`);
  return { success: true };
}
