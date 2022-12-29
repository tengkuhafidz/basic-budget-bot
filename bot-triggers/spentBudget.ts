import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { CallbackQueryKeywords } from "../constants/callbackQuery.ts";
import { Gifs } from "../constants/gifs.ts";
import { DbQueries } from "../db-queries/index.ts";
import { displayAmountErrorMessage, displayNoExistingBudget, getBudgetCategories } from "../utils/budget.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { delay } from "../utils/delay.ts";
import { getRandom } from "../utils/getRandom.ts";
import { displayBudget } from "./viewBudget.ts";

export const spentBudget = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { chatId } = ctxDetails

    const budgetCategories = await getBudgetCategories(chatId!)
    if (!budgetCategories) {
        displayNoExistingBudget(ctx)
        return
    }

    const budgetItemsKeyboard = budgetCategories.reduce((res, category) => res.text(category, `spent-${category}`).row(), new InlineKeyboard())
    budgetItemsKeyboard.text("CANCEL", "spent-cancel").row()

    await ctx.reply("Which budget category does the spending affect?", {
        reply_markup: budgetItemsKeyboard,
    });
}

// =============================================================================
// Catch-all Callback
// =============================================================================

let budgetCategory: string

export const promptSpentAmount = async (ctx: Context, callbackQueryValue: string) => {
    budgetCategory = callbackQueryValue.substring(CallbackQueryKeywords.Spent.length)

    if (budgetCategory === "cancel") {
        await ctx.editMessageText(`Budget category spending cancelled 🥸`)
    }

    await ctx.editMessageText(`Updating budget balance for ${budgetCategory}...`)
    const spentAmountPrompt = await ctx.reply("how much did you spend?", {
        reply_markup: { force_reply: true },
    });

    return spentAmountPrompt?.message_id
}

// =============================================================================
// Catch-all Message Reply
// =============================================================================

export const updateBudgetBalance = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { messageText: spentAmount, chatId } = ctxDetails
    if (!spentAmount || !chatId) {
        return
    }

    if (isNaN(Number(spentAmount))) {
        displayAmountErrorMessage(ctx)
        return
    }

    DbQueries.updateSpent(chatId, budgetCategory, Number(spentAmount))

    const replyText = `<i>💸 Spent $${spentAmount} on ${budgetCategory} 💸</i>`
    await ctx.reply(replyText, {
        parse_mode: "HTML",
        reply_markup: { remove_keyboard: true }
    });

    ctx.replyWithAnimation(getRandom(Gifs.spent))
    await delay(3500)

    await displayBudget(ctx)

    await delay(1500)
    await ctx.reply(`💡 <b>Tip:</b> Use /${BotCommands.Spent} with negative amount to simulate budget top-up`, {
        parse_mode: "HTML",
    });
}