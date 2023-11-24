import { EventExecutor } from "@/types";
import { ClientEvents } from "discord.js";
import Client from "./Client";

interface QueueItem<T extends keyof ClientEvents> {
    event: T;
    callback: EventExecutor<T>;
    args: ClientEvents[T];
}

type Queue = QueueItem<any>[];

export default class EventQueue {
    private client: Client;
    private queue: Queue = [];
    private isProcessing: boolean = false;

    constructor(client: Client) {
        this.client = client;
    }

    public async processEvent<T extends keyof ClientEvents>(
        event: T,
        callback: EventExecutor<T>,
        args: ClientEvents[T],
    ) {
        if (this.isProcessing) {
            this.queue.push({ event, callback, args });
        } else {
            this.isProcessing = true;
            await this.runEvent({ event, callback, args });
            this.isProcessing = false;

            const nextEvent = this.queue.shift();
            if (nextEvent) {
                this.processEvent(nextEvent.event, nextEvent.callback, nextEvent.args);
            }
        }
    }
    public async runEvent<T extends keyof ClientEvents>(queueItem: QueueItem<T>) {
        const { callback, args } = queueItem;
        await (callback as EventExecutor<T>)(this.client, args as ClientEvents[T]);
    }
}
