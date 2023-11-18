import Command from "@/classes/Command";
import Guild from "@/classes/Guild";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("setcountchannel")
        .setDescription("Stel de huidige count van deze server in.")
        .addChannelOption((option) => option.setName("channel").setDescription("Count channel").setRequired(true)),
    execute: async function (client, interaction) {
        if (!interaction.guildId) return;

        const channel = interaction.options.getChannel("channel");
        if (!channel) return;

        new Guild(interaction.guildId).setCountChannel(channel.id);
        await interaction.reply({ content: `Count channel ingesteld op ${channel}.` });
    },
});
