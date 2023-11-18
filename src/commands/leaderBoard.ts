import Command from "@/classes/Command";
import Guild from "@/classes/Guild";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default new Command({
    data: new SlashCommandBuilder().setName("leaderboard").setDescription("Counting channel leaderboard."),
    execute: async function (client, interaction) {
        if (!interaction.guildId) return;

        const leaderboard = await new Guild(interaction.guildId).fetchLeaderboard();

        const embed = new EmbedBuilder()
            .setTitle("Counting channel leaderboard")
            .setDescription("Top 10 epic counters")
            .setColor(0x00ae86)
            .addFields(
                leaderboard.map((stat, i) => ({
                    name: `#${i + 1}`,
                    value: `<@${stat.userId}>: ${stat.contributedNumbers}`,
                })),
            );

        await interaction.reply({ embeds: [embed] });
    },
});
