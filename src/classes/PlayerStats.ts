import { prisma } from "@/db/db";
import { Snowflake } from "discord.js";

export default class PlayerStats {
    private userId: Snowflake;
    private guildId: Snowflake;

    constructor(userId: Snowflake, guildId: Snowflake) {
        this.userId = userId;
        this.guildId = guildId;
    }

    public async fetch() {
        return prisma.playerStats.upsert({
            where: {
                userId_guildId: {
                    guildId: this.guildId,
                    userId: this.userId,
                },
            },
            create: {
                guildId: this.guildId,
                userId: this.userId,
            },
            update: {},
        });
    }

    public async find() {
        return prisma.playerStats.findUnique({
            where: {
                userId_guildId: {
                    guildId: this.guildId,
                    userId: this.userId
                }
            }
        });
    }

    public async incrementContributions() {
        return prisma.playerStats.upsert({
            where: {
                userId_guildId: {
                    guildId: this.guildId,
                    userId: this.userId,
                },
            },
            create: {
                guildId: this.guildId,
                userId: this.userId,
            },
            update: {
                contributedNumbers: {
                    increment: 1,
                },
            },
        });
    }

    public async decrementContributions() {
        return prisma.playerStats.upsert({
            where: {
                userId_guildId: {
                    guildId: this.guildId,
                    userId: this.userId,
                },
            },
            create: {
                guildId: this.guildId,
                userId: this.userId,
            },
            update: {
                contributedNumbers: {
                    decrement: 1,
                },
            },
        });
    }
}
