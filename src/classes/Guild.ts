import { prisma } from "@/db/db";
import { Snowflake } from "discord.js";

export default class Guild {
    private guildId: Snowflake;

    constructor(guildId: Snowflake) {
        this.guildId = guildId;
    }

    public async fetch() {
        return prisma.guild.upsert({
            where: {
                id: this.guildId,
            },
            create: {
                id: this.guildId,
            },
            update: {},
        });
    }

    public async fetchLeaderboard() {
        const { playerStats } = await prisma.guild.upsert({
            include: {
                playerStats: {
                    orderBy: {
                        contributedNumbers: "desc",
                    },
                },
            },
            where: {
                id: this.guildId,
            },
            create: {
                id: this.guildId,
            },
            update: {},
        });

        return playerStats;
    }

    public async incrementCount() {
        return prisma.guild.upsert({
            where: {
                id: this.guildId,
            },
            update: {
                currentCount: {
                    increment: 1,
                },
            },
            create: {
                id: this.guildId,
                currentCount: 1,
            },
        });
    }

    public async setCount(count: number) {
        return prisma.guild.upsert({
            where: {
                id: this.guildId,
            },
            update: {
                currentCount: count,
            },
            create: {
                id: this.guildId,
                currentCount: count,
            },
        });
    }

    public async setGoal(goal: number) {
        return prisma.guild.upsert({
            where: {
                id: this.guildId,
            },
            update: {
                goal,
            },
            create: {
                id: this.guildId,
                goal,
            },
        });
    }

    public async setCountChannel(channelId: Snowflake) {
        return prisma.guild.upsert({
            where: {
                id: this.guildId,
            },
            update: {
                countChannelId: channelId,
            },
            create: {
                id: this.guildId,
                countChannelId: channelId,
            },
        });
    }
}
