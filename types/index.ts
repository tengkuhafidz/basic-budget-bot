export interface Budget {
    budgetItems: BudgetItems
}

export interface BudgetItems {
    [key: string]: BudgetItemValues
}

export interface BudgetItemValues {
    limit: number,
    spent: number
}