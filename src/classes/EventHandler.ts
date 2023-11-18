import { EventExecutor } from "@/types";
import { ClientEvents } from "discord.js";

export default class EventHandler<T extends keyof ClientEvents> {
    public event: T;
    public once: boolean;
    public execute: EventExecutor<ClientEvents[T]>;

    constructor({
        event,
        once = false,
        execute,
    }: {
        event: T;
        once?: boolean;
        execute: EventExecutor<ClientEvents[T]>;
    }) {
        this.event = event;
        this.once = once;
        this.execute = execute;
    }
}
