import { Bot } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { CommandTriggers, ReplyTriggers, CallbackTriggers } from "./bot-triggers/index.ts";
import { appConfig } from "./configs/appConfig.ts";
import { CallbackQueryKeywords } from "./constants/callbackQuery.ts";
import { BotCommands, commandDescriptions } from "./constants/botCommands.ts";

export const bot = new Bot(appConfig.botApiKey);

// =============================================================================
// Commands
// =============================================================================

bot.api.setMyCommands([
    { command: BotCommands.Add, description: commandDescriptions[BotCommands.Add] },
    { command: BotCommands.Remove, description: commandDescriptions[BotCommands.Remove] },
    { command: BotCommands.Spent, description: commandDescriptions[BotCommands.Spent] },
    { command: BotCommands.Reset, description: commandDescriptions[BotCommands.Reset] },
    { command: BotCommands.View, description: commandDescriptions[BotCommands.View] },
    { command: BotCommands.Help, description: commandDescriptions[BotCommands.Help] },

]);

let addBudgetPromptId: number
bot.command("start", (ctx) => CommandTriggers.help(ctx));
bot.command(BotCommands.Add, async (ctx) => addBudgetPromptId = await CommandTriggers.addBudget(ctx));
bot.command(BotCommands.Remove, async (ctx) => await CommandTriggers.removeBudget(ctx));
bot.command(BotCommands.Spent, async (ctx) => await CommandTriggers.spentBudget(ctx));
bot.command(BotCommands.Reset, async (ctx) => await CommandTriggers.resetBudget(ctx));
bot.command(BotCommands.View, async (ctx) => await CommandTriggers.viewBudget(ctx));
bot.command(BotCommands.Help, (ctx) => CommandTriggers.help(ctx));

// =============================================================================
// Catch-all Callback
// =============================================================================

let spentAmountPromptId: number | undefined

bot.on("callback_query:data", async (ctx) => {
    const { data } = ctx.callbackQuery

    if (data.startsWith(CallbackQueryKeywords.Spent)) {
        spentAmountPromptId = await CallbackTriggers.promptSpentAmount(ctx, data)
    } else if (data.startsWith(CallbackQueryKeywords.Reset)) {
        await CallbackTriggers.confirmReset(ctx, data)
    } else if (data.startsWith(CallbackQueryKeywords.PromptRemove)) {
        await CallbackTriggers.promptRemove(ctx, data)
    } else if (data.startsWith(CallbackQueryKeywords.ConfirmRemove)) {
        await CallbackTriggers.confirmRemove(ctx, data)
    }

    await ctx.answerCallbackQuery(); // remove loading animation
});


// =============================================================================
// Catch-all Message Reply
// =============================================================================

let budgetLimitPromptId: number | undefined

bot.on("message", async (ctx) => {
    const replyToId = ctx.update?.message?.reply_to_message?.message_id
    if (!replyToId) {
        return
    }

    switch (replyToId) {
        case addBudgetPromptId:
            budgetLimitPromptId = await ReplyTriggers.promptAddBudgetCategoryLimit(ctx)
            return
        case budgetLimitPromptId:
            await ReplyTriggers.saveBudgetCategory(ctx)
            return
        case spentAmountPromptId:
            await ReplyTriggers.updateBudgetBalance(ctx)
            return
    }
});

// =============================================================================

bot.start();

