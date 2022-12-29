import { delay } from "https://deno.land/std@0.154.0/async/delay.ts";
import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { CallbackQueryKeywords } from "../constants/callbackQuery.ts";
import { Gifs } from "../constants/gifs.ts";
import { DbQueries } from "../db-queries/index.ts";
import { displayNoExistingBudget, getBudgetCategories } from "../utils/budget.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { getRandom } from "../utils/getRandom.ts";
import { displayQuickActions } from "../utils/quickActions.ts";
import { displayBudget } from "./viewBudget.ts";

export const removeBudget = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { chatId } = ctxDetails

    const budgetCategories = await getBudgetCategories(chatId!)
    if (!budgetCategories) {
        displayNoExistingBudget(ctx)
        return
    }

    const budgetItemsKeyboard = budgetCategories.reduce((res, category) => res.text(category, `prompt-remove-${category}`).row(), new InlineKeyboard())
    budgetItemsKeyboard.text("Remove All", "prompt-remove-all").text("Cancel", "prompt-remove-cancel").row()

    await ctx.reply("Which budget category do you want to remove?", {
        reply_markup: budgetItemsKeyboard,
    });
}

// =============================================================================
// Catch-all Callback
// =============================================================================

let budgetCategory: string

export const promptRemove = async (ctx: Context, callbackQueryValue: string) => {
    budgetCategory = callbackQueryValue.substring(CallbackQueryKeywords.PromptRemove.length)

    if (budgetCategory === "cancel") {
        await replyCancelRemove(ctx)
        return
    }

    const confirmKeyboard = new InlineKeyboard().text(`Yes, remove ${budgetCategory}`, "confirm-remove-yes").text("No, cancel!", "confirm-remove-no")
    await ctx.editMessageText(`Are you sure you want to remove ${budgetCategory}?`, {
        reply_markup: confirmKeyboard
    })
}

export const confirmRemove = async (ctx: Context, callbackQueryValue: string) => {
    const isConfirmReset = callbackQueryValue.substring(CallbackQueryKeywords.ConfirmRemove.length) === "yes"
    if (!isConfirmReset) {
        await replyCancelRemove(ctx)
        return
    }

    const ctxDetails = new CtxDetails(ctx)
    const { chatId } = ctxDetails
    if (budgetCategory === "all") {
        await DbQueries.removeAllBudgetCategories(chatId!)
    } else {
        await DbQueries.removeBudgetCategory(chatId!, budgetCategory)
    }

    await ctx.editMessageText(`Removed ${budgetCategory} from budget categories.`)
    ctx.replyWithAnimation(getRandom(Gifs.remove))
    await delay(3500)

    await displayBudget(ctx)
    await displayQuickActions(ctx, [BotCommands.Add, BotCommands.Remove])
}

const replyCancelRemove = async (ctx: Context) => {
    await ctx.editMessageText(`Budget category removal cancelled 🥸`)
}

