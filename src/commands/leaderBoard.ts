import Command from "@/classes/Command";
import Guild from "@/classes/Guild";
import { Contributor } from "@/types";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

const pageSize = 10;

export default new Command({
    data: new SlashCommandBuilder().setName("leaderboard").setDescription("Counting channel leaderboard."),
    execute: async function (client, interaction) {
        if (!interaction.guildId) return;
        const leaderboard: Contributor[] = await new Guild(interaction.guildId).fetchLeaderboard();

        await interaction.reply({ 
            embeds: [
                client.embed()
                .setDescription("Loading leaderboard...")
            ] 
        });
        showPage(interaction, leaderboard, 0);
    },
});

async function showPage(interaction: ChatInputCommandInteraction<CacheType>, leaderboard: Contributor[], page: number) {
    const userIndex = leaderboard.findIndex((stat) => stat.userId === interaction.user.id);
    const contributorsOnPage = leaderboard.slice(page * pageSize, (page + 1) * pageSize);
    const embed = new EmbedBuilder()
        .setTitle("Counting channel leaderboard")
        .setDescription(`Top ${(page + 1) * pageSize} epic counters`)
        .setColor(0x00ae86)
        .addFields(
            contributorsOnPage.map((stat, i) => ({
                name: `#${i + 1 + page * pageSize}`,
                value: `<@${stat.userId}>: ${stat.contributedNumbers}`,
            })),
        );
    let components;
    if (leaderboard.length > pageSize) components = [new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
        .setCustomId("start")
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === 0),
        new ButtonBuilder()
        .setCustomId("prev")
        .setEmoji("◀️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === 0),
        new ButtonBuilder()
        .setCustomId("user")
        .setEmoji("💙")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(userIndex === -1 || (userIndex <= (page + 1) * pageSize && userIndex >= page * pageSize)),
        new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("▶️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === Math.floor(leaderboard.length / pageSize) - 1),
        new ButtonBuilder()
        .setCustomId("end")
        .setEmoji("➡️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === Math.floor(leaderboard.length / pageSize) - 1)
    )]

    const message = await interaction.editReply({ embeds: [embed], components });
    
    if (leaderboard.length > pageSize) {
        const collector = message.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 60000 });

        collector.on("end", (_, reason) => {
            if (reason === "time") {
                message.edit({ components: [] });
            }
        });

        collector.on("collect", async (i) => {
            if (!i.isButton()) return;
            i.deferUpdate();
            collector.stop();
            const button = i as ButtonInteraction;

            if (button.customId === "start") await showPage(interaction, leaderboard, 0);
            if (button.customId === "prev") await showPage(interaction, leaderboard, page - 1);
            if (button.customId === "user") await showPage(interaction, leaderboard, Math.floor(userIndex / pageSize));
            if (button.customId === "next") await showPage(interaction, leaderboard, page + 1);
            if (button.customId === "end") await showPage(interaction, leaderboard, Math.floor(leaderboard.length / pageSize) - 1); 
        });
    }
}