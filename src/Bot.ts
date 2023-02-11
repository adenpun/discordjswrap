import { Client, ClientOptions, IntentsBitField } from "discord.js";
import merge from "deepmerge";
import type { IBotOptions, Intents, TIntent } from "./types";
import allIntents from "./intents";

const DEFAULT_CLIENT_OPTIONS: ClientOptions = {
    intents: ["Guilds"],
};

export default class Bot {
    public client: Client;

    public constructor(options?: IBotOptions, clientOptions?: ClientOptions) {
        if (typeof options === "undefined") options = {};
        if (typeof clientOptions === "undefined") clientOptions = DEFAULT_CLIENT_OPTIONS;

        const processedOptions = Bot.ProcessOptions(options);

        this.client = new Client(
            merge.all<ClientOptions>([DEFAULT_CLIENT_OPTIONS, processedOptions, clientOptions])
        );
    }

    public static ProcessOptions(options: IBotOptions): ClientOptions {
        const output: ClientOptions = {} as any;

        const intentMap = new Map<TIntent, Intents | Intents[]>([["Moderator", allIntents]]);

        const intents = new IntentsBitField();

        options.intents?.forEach((intent) => {
            const i = intentMap.get(intent);
            if (typeof i !== "undefined") intents.add(i);
        });

        return output;
    }
}
