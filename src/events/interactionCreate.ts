import Client from "@/classes/Client";
import Command from "@/classes/Command";
import ContextMenu from "@/classes/ContextMenu";
import EventHandler from "@/classes/EventHandler";
import { log } from "@/log/log";
import { LogTypes } from "@/types";
import { ChatInputCommandInteraction, CommandInteraction, ContextMenuCommandInteraction } from "discord.js";

export default new EventHandler({
    event: "interactionCreate",
    execute: async function (client, [interaction]) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            await executeCommand<Command>(client, command, interaction);
        }
        if (interaction.isContextMenuCommand()) {
            const contextMenu = client.contextMenus.get(interaction.commandName);
            if (!contextMenu) return;

            await executeCommand<ContextMenu>(client, contextMenu, interaction);
        }
    },
});

async function executeCommand<T extends Command | ContextMenu>(
    client: Client, 
    command: T, 
    interaction: T extends Command ? ChatInputCommandInteraction : ContextMenuCommandInteraction,
) {
    try {
        if (command instanceof Command) {
            command.execute(client, interaction as ChatInputCommandInteraction);
        } else if (command instanceof ContextMenu) {
            command.execute(client, interaction as ContextMenuCommandInteraction);
        }
    } catch (error) {
        if (!(error instanceof Error)) return;

        log(error.message, LogTypes.Error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "Er is iets foutgegaan bij het uitvoeren van dit commando!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "Er is iets foutgegaan bij het uitvoeren van dit commando!",
                ephemeral: true,
            });
        }
    }
}