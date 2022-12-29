export interface Budget {
    budgetItems: BudgetItems
}

export interface BudgetItems {
    [key: string]: {
        limit: number,
        spent: number
    }
}