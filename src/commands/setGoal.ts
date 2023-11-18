import Command from "@/classes/Command";
import Guild from "@/classes/Guild";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("setgoal")
        .setDescription("Stel het doel van deze server in.")
        .addIntegerOption((option) => option.setName("goal").setDescription("Het doel").setRequired(true)),
    execute: async function (client, interaction) {
        if (!interaction.guildId) return;
        const goal = interaction.options.getInteger("goal");
        if (goal === null) return;

        await new Guild(interaction.guildId).setGoal(goal);
        await interaction.reply({ content: `Doel succesvol ingesteld op ${goal}.` });
    },
});
