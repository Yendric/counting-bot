import EventHandler from "@/classes/EventHandler";
import Guild from "@/classes/Guild";
import PlayerStats from "@/classes/PlayerStats";
import { numIcons } from "@/utils/helpers";
import { Message } from "discord.js";

export default new EventHandler({
    event: "messageUpdate",
    execute: async function (client, [oldMessage, newMessage]) {
        if (!newMessage.guildId) return;
        if (!newMessage.content) return;
        if (!newMessage.author?.id) return;

        const guild = new Guild(newMessage.guildId);
        const playerStats = new PlayerStats(newMessage.author.id, newMessage.guildId);

        const { currentCount, countChannelId } = await guild.fetch();
        if (newMessage.channelId !== countChannelId) return;

        const messages = Array.from(newMessage.channel.messages.cache.values()).filter(isUserMessage);
        const messageIndex = messages.length - messages.findIndex((message) => message.id === newMessage.id) - 1;

        const getal = parseInt(newMessage.content.split(" ")[0]);
        const oldGetal = parseInt((oldMessage.content ?? "").split(" ")[0]);

        if (currentCount - messageIndex !== getal) {
            newMessage.react("❌");
        } else {
            let reactions = newMessage.reactions.cache.keys();
            for (const key of reactions) {
                if ([...Object.values(numIcons).flat(), "❌"].includes(key))
                    newMessage.reactions.cache.get(key)?.remove();
            }
        }

        // Huidige guess is fout, vorige was juist -> decrement contributions
        if (currentCount - messageIndex !== getal && currentCount - messageIndex === oldGetal) {
            playerStats.decrementContributions();
            // Huidige guess is juist, vorige was fout -> increment contributions
        } else if (currentCount - messageIndex === getal && currentCount - messageIndex !== oldGetal) {
            playerStats.incrementContributions();
        }
    },
});

const isUserMessage = (message: Message) => !message.author.bot;
