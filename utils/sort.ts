import { BudgetItems } from "../types/index.ts";

export const sortBudgetItemsByCategory = (budgetItems: BudgetItems) => {
    return Object.keys(budgetItems).sort().reduce(
        (sortedBudgetItems: BudgetItems, key) => {
            sortedBudgetItems[key] = budgetItems[key];
            return sortedBudgetItems;
        },
        {}
    );
}