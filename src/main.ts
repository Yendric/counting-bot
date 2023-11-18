import { GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { getEnvVariable } from "./utils/environment";
import Client from "./classes/Client";
dotenv.config();

const BOT_TOKEN = getEnvVariable("BOT_TOKEN");

new Client(BOT_TOKEN, {
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});
