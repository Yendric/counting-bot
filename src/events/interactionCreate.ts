import EventHandler from "@/classes/EventHandler";
import { log } from "@/log/log";
import { LogTypes } from "@/types";

export default new EventHandler({
    event: "interactionCreate",
    execute: async function (client, [interaction]) {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            command.execute(client, interaction);
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
    },
});
