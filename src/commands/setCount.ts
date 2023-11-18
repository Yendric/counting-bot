import Command from "@/classes/Command";
import Guild from "@/classes/Guild";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("setcount")
        .setDescription("Stel de huidige count van deze server in.")
        .addIntegerOption((option) => option.setName("count").setDescription("De nieuwe count").setRequired(true)),
    execute: async function (client, interaction) {
        if (!interaction.guildId) return;
        const newCount = interaction.options.getInteger("count");
        if (newCount === null) return; // !newCount is incorrect bij count=0 (!0=1=true)

        await new Guild(interaction.guildId).setCount(newCount);
        await interaction.reply({ content: `Count succesvol ingesteld op ${newCount}.` });
    },
});
