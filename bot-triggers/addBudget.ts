import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { DbQueries } from "../db-queries/index.ts";
import { displayAmountErrorMessage } from "../utils/budget.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { formatAmount } from "../utils/formatAmount.ts";
import { displayQuickActions } from "../utils/quickActions.ts";
import { displayBudget } from "./viewBudget.ts";

export const addBudget = async (ctx: Context) => {
    const addBudgetPrompt = await ctx.reply("What budget would you like to track? (e.g. Groceries)", {
        reply_markup: { force_reply: true },
    });

    return addBudgetPrompt?.message_id
}

// =============================================================================
// Catch-all Message Reply
// =============================================================================

let budgetCategory: string

export const promptAddBudgetCategoryLimit = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { messageText } = ctxDetails
    budgetCategory = messageText!
    if (!budgetCategory) {
        return
    }

    const replyText = `What is the budget amount for <b>${budgetCategory}</b>?`
    const budgetLimitPrompt = await ctx.reply(replyText, {
        parse_mode: "HTML",
        reply_markup: { force_reply: true },
    });

    return budgetLimitPrompt?.message_id
}

export const saveBudgetCategory = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { messageText: budgetLimit, chatId } = ctxDetails
    if (!budgetLimit || !chatId) {
        return
    }

    if (isNaN(Number(budgetLimit))) {
        displayAmountErrorMessage(ctx)
        return
    }
    DbQueries.addBudgetItem(chatId, budgetCategory, Number(budgetLimit))
    const replyText = `Added new budget: <b>${budgetCategory} ($${formatAmount(Number(budgetLimit))}</b>`

    await ctx.reply(replyText, {
        parse_mode: "HTML",
        reply_markup: { remove_keyboard: true },
    });

    await displayBudget(ctx);
    await displayQuickActions(ctx, [BotCommands.Add, BotCommands.Remove])
}
