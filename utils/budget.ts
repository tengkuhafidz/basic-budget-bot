import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { DbQueries } from "../db-queries/index.ts";

export const displayNoExistingBudget = (ctx: Context) => {
    const noBudgetExistText = `<b>No Existing Budget</b>
    Add budget to be tracked with /${BotCommands.Add}`
    ctx.reply(noBudgetExistText, {
        parse_mode: "HTML",
    });
}

export const displayAmountErrorMessage = (ctx: Context) => {
    ctx.reply("Amount must be in numbers. Exclude any symbols.", {
        parse_mode: "HTML",
        reply_markup: { remove_keyboard: true },
    });
}

export const getBudgetCategories = async (chatId: string) => {
    const budget = await DbQueries.getBudget(chatId)
    if (!budget?.budgetItems || budget.budgetItems.length < 1) {
        return null
    }
    return Object.keys(budget.budgetItems).map(category => category).sort()
}