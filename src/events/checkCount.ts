import EventHandler from "@/classes/EventHandler";
import Guild from "@/classes/Guild";
import PlayerStats from "@/classes/PlayerStats";
import { numToIcons } from "@/utils/helpers";

export default new EventHandler({
    event: "messageCreate",
    execute: async function (client, [message]) {
        if (message.author.bot) return;
        if (!message.guildId) return;

        const guild = new Guild(message.guildId);
        const playerStats = new PlayerStats(message.author.id, message.guildId);

        const { currentCount, countChannelId } = await guild.fetch();
        if (message.channelId !== countChannelId) return;

        const getal = parseInt(message.content.split(" ")[0]);
        guild.incrementCount();

        if (isNaN(getal) || getal !== currentCount + 1) {
            let promises = [];
            promises.push(message.react("❌"));
            numToIcons(currentCount + 1).forEach((icon) => promises.push(message.react(icon)));
            await Promise.all(promises);
        } else {
            await playerStats.incrementContributions();
        }
    },
});
