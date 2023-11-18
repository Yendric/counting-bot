import Command from "@/classes/Command";
import Guild from "@/classes/Guild";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
    data: new SlashCommandBuilder().setName("getcount").setDescription("Verkrijg de huidige count."),
    execute: async function (client, interaction) {
        if (!interaction.guildId) return;

        const { currentCount, goal } = await new Guild(interaction.guildId).fetch();

        await interaction.reply({
            content: `We zitten momenteel aan ${currentCount}. Dit is ${
                goal - currentCount
            } verwijderd van het doel. (${Math.floor((currentCount / goal) * 100)}% voltooid)`,
        });
    },
});
