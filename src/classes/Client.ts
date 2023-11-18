import { getFiles } from "@/utils/files";
import { ClientOptions, Collection, Client as DiscordClient, REST, Routes, Snowflake } from "discord.js";
import EventHandler from "@/classes/EventHandler";
import Command from "./Command";
import { log } from "@/log/log";

export default class Client extends DiscordClient {
    public commands = new Collection<string, Command>();

    constructor(token: string, options: ClientOptions) {
        super(options);

        this.login(token);
        this.registerEventHandlers();
        this.loadCommands();
        this.on("ready", this.registerCommands);
        this.on("ready", this.logReady);
    }

    private registerEventHandlers() {
        getFiles("events").forEach(async (file) => {
            const eventHandler = require("../" + file).default as EventHandler<any>;

            if (eventHandler.once) {
                this.once(eventHandler.event, (...args) => eventHandler.execute(this, args));
            } else {
                this.on(eventHandler.event, (...args) => eventHandler.execute(this, args));
            }

            log(`Loaded event: ${file}`);
        });
    }

    private loadCommands() {
        getFiles("commands").forEach(async (file) => {
            const command = require("../" + file).default as Command;
            this.commands.set(command.data.name, command);

            log(`Loaded command: ${file}`);
        });
    }

    private async registerCommands() {
        if (!this.token) throw new Error("Token is verdwenen.");
        if (!this.user) throw new Error("Application ID niet gevonden (besta ik wel??).");

        const rest = new REST().setToken(this.token);

        await rest.put(Routes.applicationCommands(this.user?.id), {
            body: this.commands.map((command) => command.data.toJSON()),
        });
    }

    private logReady() {
        log(`Online in ${this.guilds.cache.size} servers.`);
        log(`Invite link: https://discord.com/oauth2/authorize?client_id=${this.user?.id}&scope=bot&permissions=8`);
    }
}
