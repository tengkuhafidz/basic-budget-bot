import { DbQueries } from "../db-queries/index.ts";

export const getBudgetCategories = async (chatId: string) => {
    const budget = await DbQueries.getBudget(chatId)
    return Object.keys(budget.budgetItems).map(category => category).sort()
}