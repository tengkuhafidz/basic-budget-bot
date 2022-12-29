import { help } from "./help.ts";
import { addBudget, promptAddBudgetCategoryLimit, saveBudgetCategory } from "./addBudget.ts";
import { viewBudget } from "./viewBudget.ts";
import { resetBudget, confirmReset } from "./resetBudget.ts";
import { removeBudget, promptRemove, confirmRemove } from "./removeBudget.ts";
import { spentBudget, promptSpentAmount, updateBudgetBalance } from "./spentBudget.ts";


export const CommandTriggers = {
    help,
    addBudget,
    viewBudget,
    spentBudget,
    resetBudget,
    removeBudget
};

export const CallbackTriggers = {
    promptSpentAmount,
    confirmReset,
    promptRemove,
    confirmRemove
}

export const ReplyTriggers = {
    promptAddBudgetCategoryLimit,
    saveBudgetCategory,
    updateBudgetBalance
}
