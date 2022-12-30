import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { DbQueries } from "../db-queries/index.ts";
import { Budget, BudgetItems, BudgetItemValues } from "../types/index.ts";
import { displayNoExistingBudget } from "../utils/budget.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { delay } from "../utils/delay.ts";
import { sortBudgetItemsByCategory } from "../utils/sort.ts";

export const viewBudget = async (ctx: Context) => {
    await displayBudget(ctx)
    await delay(1000)
    await ctx.reply(`💡 <b>Tip:</b> Use /${BotCommands.Help} to view available bot commands`, {
        parse_mode: "HTML",
    });
}

export const displayBudget = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { chatId } = ctxDetails

    const userBudget = await DbQueries.getBudget(chatId!)

    if (!isBudgetExist(userBudget)) {
        displayNoExistingBudget(ctx)
        return
    }

    const { budgetItems: unsortedBudgetItems, lastResetAt } = userBudget!
    const sortedBudgetItems = sortBudgetItemsByCategory(unsortedBudgetItems)
    const formattedText = constructViewBudgetText(sortedBudgetItems, lastResetAt)

    await ctx.reply(formattedText, {
        parse_mode: "HTML",
    });
}

const isBudgetExist = (budget?: Budget) => {
    if (budget && budget?.budgetItems && Object.keys(budget?.budgetItems)?.length > 0) {
        return true
    }
    return false
}

const constructViewBudgetText = (budgetItems: BudgetItems, lastResetAt?: string) => {
    const lastResetAtText = !lastResetAt ? "" : `Last reset: ${lastResetAt}
` // intentional new line for message formatting

    return `🏦 <b>BUDGET BALANCE</b>
${lastResetAtText}${constructBudgetBalances(budgetItems)}
`
}

const constructBudgetBalances = (budgetItems: BudgetItems) => {
    let totalSpent = 0
    let totalLimit = 0
    return `${Object.entries(budgetItems).map(([budgetCategory, budgetValues]) => {
        totalSpent += budgetValues.spent
        totalLimit += budgetValues.limit
        return formatBudgetBalance(budgetCategory, budgetValues)
    }).join('')}
=====
${formatBudgetBalance("Overall Total", { spent: totalSpent, limit: totalLimit })}
`
}

const formatBudgetBalance = (budgetCategory: string, { limit, spent }: BudgetItemValues) => {
    const percentageSpent = spent === 0 ? "0%" : ((spent / limit) * 100).toFixed(0) + "%"
    return `
<b>${budgetCategory}</b>
💸 $${spent} / $${limit} (${percentageSpent})
💰 $${limit - spent}
`
}