import { getFiles } from "@/utils/files";
import { ClientOptions, Collection, Client as DiscordClient, REST, Routes, EmbedBuilder, Embed } from "discord.js";
import EventHandler from "@/classes/EventHandler";
import Command from "./Command";
import { log } from "@/log/log";
import EventQueue from "./EventQueue";
import ContextMenu from "./ContextMenu";

export default class Client extends DiscordClient {
    public commands = new Collection<string, Command>();
    public contextMenus = new Collection<string, ContextMenu>();
    private eventQueue = new EventQueue(this);

    constructor(token: string, options: ClientOptions) {
        super(options);

        this.login(token);
        this.registerEventHandlers();
        this.loadCommands();
        this.loadContextMenus();
        this.on("ready", this.registerCommands);
        this.on("ready", this.registerContextMenus);
        this.on("ready", this.logReady);
    }

    private registerEventHandlers() {
        getFiles("events").forEach(async (file) => {
            const eventHandler = require("../" + file).default as EventHandler<any>;

            if (eventHandler.once) {
                this.once(
                    eventHandler.event,
                    async (...args) =>
                        await this.eventQueue.processEvent(eventHandler.event, eventHandler.execute, args),
                );
            } else {
                this.on(
                    eventHandler.event,
                    async (...args) =>
                        await this.eventQueue.processEvent(eventHandler.event, eventHandler.execute, args),
                );
            }

            log(`Loaded event: ${file}`);
        });
    }

    private loadInteractions<T extends Command | ContextMenu>(dir: string, collection: Collection<string, T>) {
        getFiles(dir).forEach(async (file) => {
            const interaction = require("../" + file).default as T;
            collection.set(interaction.data.name, interaction);

            log(`Loaded interaction: ${file}`);
        });
    }

    private loadCommands() {
        this.loadInteractions<Command>("commands", this.commands);
    }

    private loadContextMenus() {
        this.loadInteractions<ContextMenu>("contextMenus", this.contextMenus);
    }

    private async registerCommands() {
        if (!this.token) throw new Error("Token is verdwenen.");
        if (!this.user) throw new Error("Application ID niet gevonden (besta ik wel??).");

        const rest = new REST().setToken(this.token);

        await rest.put(Routes.applicationCommands(this.user?.id), {
            body: this.commands.map((command) => command.data.toJSON()),
        });
    }

    private async registerContextMenus() {
        if (!this.token) throw new Error("Token is verdwenen.");
        if (!this.user) throw new Error("Application ID niet gevonden (besta ik wel??).");

        const rest = new REST().setToken(this.token);

        await rest.put(Routes.applicationCommands(this.user?.id), {
            body: this.contextMenus.map((contextMenu) => contextMenu.data.toJSON()),
        });
    }

    private logReady() {
        log(`Online in ${this.guilds.cache.size} servers.`);
        log(`Invite link: https://discord.com/oauth2/authorize?client_id=${this.user?.id}&scope=bot&permissions=8`);
    }

    public embed(footerIcon?: string): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle("Counting Bot")
            .setColor(0x00ae86)
            .setTimestamp(new Date())
            .setFooter({ text: `Counting Bot v${process.env.npm_package_version}`, iconURL: footerIcon })
    }
}
