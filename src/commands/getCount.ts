import Command from "@/classes/Command";
import Guild from "@/classes/Guild";
import { createProgressBar } from "@/utils/helpers";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
    data: new SlashCommandBuilder().setName("getcount").setDescription("Verkrijg de huidige count."),
    execute: async function (client, interaction) {
        if (!interaction.guildId) return;

        const { currentCount, goal } = await new Guild(interaction.guildId).fetch();

        await interaction.reply({
            embeds: [
                client.embed(interaction.guild?.iconURL() ?? undefined)
                .setDescription(`We zitten momenteel aan ${currentCount}. Dit is ${goal - currentCount} verwijderd van het doel.`)
                .setFields([
                    { name: "Progress", value: createProgressBar(goal, currentCount), inline: false },
                ])
            ]
        });
    },
});
