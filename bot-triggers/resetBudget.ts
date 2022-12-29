import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { CallbackQueryKeywords } from "../constants/callbackQuery.ts";
import { Gifs } from "../constants/gifs.ts";
import { DbQueries } from "../db-queries/index.ts";
import { displayNoExistingBudget, getBudgetCategories } from "../utils/budget.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { delay } from "../utils/delay.ts";
import { getRandom } from "../utils/getRandom.ts";
import { displayQuickActions } from "../utils/quickActions.ts";
import { displayBudget } from "./viewBudget.ts";

export const resetBudget = async (ctx: Context) => {
    const confirmKeyboard = new InlineKeyboard().text("Yes, reset", "reset-yes").text("No, cancel!", "reset-no")

    await ctx.reply("Are you sure you want to reset all spending to $0?", {
        reply_markup: confirmKeyboard,
    });
}

// =============================================================================
// Catch-all Callback
// =============================================================================

export const confirmReset = async (ctx: Context, callbackQueryValue: string) => {
    const isConfirmReset = callbackQueryValue.substring(CallbackQueryKeywords.Reset.length) === "yes"
    if (!isConfirmReset) {
        await ctx.editMessageText(`Reset Cancelled 🥸`)
        return
    }

    const ctxDetails = new CtxDetails(ctx)
    const { chatId } = ctxDetails

    const budgetCategories = await getBudgetCategories(chatId!)
    if (!budgetCategories) {
        displayNoExistingBudget(ctx)
        return
    }
    await DbQueries.resetBudget(chatId!, budgetCategories)

    await ctx.editMessageText(`Woohoo, spending reset! 🤑`)
    ctx.replyWithAnimation(getRandom(Gifs.reset))
    await delay(3500)

    await displayBudget(ctx)
    await displayQuickActions(ctx, [BotCommands.Spent])
}