import { UserContextMenu } from "@/classes/ContextMenu";
import PlayerStats from "@/classes/PlayerStats";
import { ContextMenuCommandBuilder } from "discord.js";

export default new UserContextMenu({
  data: new ContextMenuCommandBuilder().setName("View contribution"),
  execute: async function (client, interaction) {
    if (!interaction.guildId) return;

    const user = interaction.options.getUser("user") ?? interaction.user;
    const playerStats = new PlayerStats(user.id, interaction.guildId);

    const stats = await playerStats.find();
    const contribution = stats?.contributedNumbers ?? 0;

    await interaction.reply({
      embeds: [
        client.embed(user.displayAvatarURL() ?? undefined)
          .setTitle("Bijdrage")
          .setDescription(`${user} heeft ${contribution} bijdragen geleverd.`)
          .setThumbnail(user.displayAvatarURL())
      ]
    });
  }
});