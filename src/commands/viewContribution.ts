import Command from "@/classes/Command";
import PlayerStats from "@/classes/PlayerStats";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("contribution")
        .setDescription("Bekijk je bijdrage.")
        .addUserOption((option) =>
            option.setName("user").setDescription("De gebruiker om de bijdrage van te bekijken.").setRequired(false),
        ),
    execute: async function (client, interaction) {
        if (!interaction.guildId) return;

        const user = interaction.options.getUser("user") ?? interaction.user;
        const playerStats = new PlayerStats(user.id, interaction.guildId);

        const { contributedNumbers: contribution } = await playerStats.fetch();

        await interaction.reply({
            embeds: [
                client
                    .embed(user.displayAvatarURL() ?? undefined)
                    .setTitle("Bijdrage")
                    .setDescription(`${user} heeft ${contribution} bijdragen geleverd.`)
                    .setThumbnail(user.displayAvatarURL()),
            ],
        });
    },
});
