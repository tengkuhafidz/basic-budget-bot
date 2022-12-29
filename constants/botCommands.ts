export enum BotCommands {
    Add = "add_budget",
    Remove = "remove_budget",
    View = "view_budget",
    Spent = "spent_budget",
    Reset = "reset_budget",
    Help = "help_budget"
}

export const commandDescriptions = {
    // Manage Budget Categories
    [BotCommands.Add]: "Add new budget",
    [BotCommands.Remove]: "Remove budget",
    // Manage Budget Balance
    [BotCommands.Spent]: "Track expense (use negative amount to simulate top-up)",
    [BotCommands.Reset]: "Reset all spending to $0",
    // View Budget
    [BotCommands.View]: "View budget balance",
    // Commands Help
    [BotCommands.Help]: "Detailed list of commands"
}


