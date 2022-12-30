export interface Budget {
    budgetItems: BudgetItems,
    lastResetAt: string
}

export interface BudgetItems {
    [key: string]: BudgetItemValues
}

export interface BudgetItemValues {
    limit: number,
    spent: number
}