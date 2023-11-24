import { ApplicationCommandType, ContextMenuCommandBuilder, ContextMenuCommandInteraction } from "discord.js";
import Client from "./Client";

interface ContextMenuOptions {
    data: ContextMenuCommandBuilder;
    execute: (client: Client, interaction: ContextMenuCommandInteraction) => Promise<void> | void;
}

export default class ContextMenu {
    public data: ContextMenuCommandBuilder;
    public execute: (client: Client, interaction: ContextMenuCommandInteraction) => Promise<void> | void;

    constructor({ data, execute }: ContextMenuOptions) {
        this.data = data;
        this.execute = execute;
    }
}

export class UserContextMenu extends ContextMenu {
    constructor({ data, execute }: ContextMenuOptions) {
        data = data.setType(ApplicationCommandType.User);
        super({ data, execute });
    }
}
