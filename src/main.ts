import { GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import Client from "./classes/Client";
import { getEnvVariable } from "./utils/environment";
dotenv.config();

const BOT_TOKEN = getEnvVariable("BOT_TOKEN");

new Client(BOT_TOKEN, {
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});
