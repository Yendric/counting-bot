import Client from "@/classes/Client";
import { ChatInputCommandInteraction, ClientEvents } from "discord.js";

export type CommandExecutor = (client: Client, interaction: ChatInputCommandInteraction) => Promise<void> | void;

export type EventExecutor<T extends keyof ClientEvents> = (
    client: Client,
    eventData: ClientEvents[T],
) => Promise<void> | void;

export enum LogTypes {
    Info,
    Success,
    Error,
}

export type NumIcons = { [key: number]: string[] };

export type Contributor = {
    userId: string;
    guildId: string;
    contributedNumbers: number;
};
