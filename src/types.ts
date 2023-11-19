import { ChatInputCommandInteraction } from "discord.js";
import Client from "@/classes/Client";

export type CommandExecutor = (client: Client, interaction: ChatInputCommandInteraction) => Promise<void> | void;

export type EventExecutor<T> = (client: Client, eventData: T) => Promise<void> | void;

export enum LogTypes {
    Info,
    Success,
    Error,
}
