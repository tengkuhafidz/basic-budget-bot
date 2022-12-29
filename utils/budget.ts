import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { DbQueries } from "../db-queries/index.ts";

export const displayNoExistingBudget = (ctx: Context) => {
    const noBudgetExistText = `<b>No Existing Budget 😅</b>
Add new budget with /${BotCommands.Add}`
    ctx.reply(noBudgetExistText, {
        parse_mode: "HTML",
    });
}

export const displayAmountErrorMessage = (ctx: Context) => {
    const errorMessage = `⚠️ <b>Amount must be in numbers</b>. 
<i>Note: Exclude dollar symbol</i>.`

    ctx.reply(errorMessage, {
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