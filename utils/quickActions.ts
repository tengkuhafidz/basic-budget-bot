import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { BotCommands, commandDescriptions } from "../constants/botCommands.ts"
import { delay } from "./delay.ts";

export const displayQuickActions = async (ctx: Context, botCommands: BotCommands[]) => {
    await delay(1000)
    await ctx.reply(formatQuickActions(botCommands), {
        parse_mode: "HTML"
    });
}

const formatQuickActions = (botCommands: BotCommands[]) => {
    return `
⚡️ <b>Quick Actions</b>
${botCommands.map(command => `/${command}: ${commandDescriptions[command]}
`).join('')}`
}