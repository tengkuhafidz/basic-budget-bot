import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { viewBudget } from "../bot-triggers/viewBudget.ts";
import { delay } from "./delay.ts";

export const displayBudgetAfterDelay = async (ctx: Context) => {
    await delay(3500)
    await viewBudget(ctx)
}