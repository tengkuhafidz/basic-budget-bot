import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { BotCommands, commandDescriptions } from "../constants/botCommands.ts";

export const help = (ctx: Context) => {
    const text = `
🤖 <b>Bot Commands</b>

<b>Manage Budget Categories</b>
/${BotCommands.Add}: ${commandDescriptions[BotCommands.Add]}
/${BotCommands.Remove}: ${commandDescriptions[BotCommands.Remove]}

<b>Update Budget Balance</b>
/${BotCommands.Spent}: ${commandDescriptions[BotCommands.Spent]}
/${BotCommands.Reset}: ${commandDescriptions[BotCommands.Reset]}

<b>View Budget</b>
/${BotCommands.View}: ${commandDescriptions[BotCommands.View]}
`
    ctx.reply(text, { parse_mode: "HTML" })
}