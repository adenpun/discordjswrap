import merge from "deepmerge";
import type { ClientOptions } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
import { CommandCollection } from "./Commands";
import type { IBotOptions } from "./types";

const DEFAULT_CLIENT_OPTIONS: ClientOptions = {
    intents: [GatewayIntentBits.Guilds],
};

export default class Bot {
    public botOptions: IBotOptions;
    public commands: CommandCollection;
    public client: Client;
    public clientOptions: ClientOptions;

    public constructor(botOptions: IBotOptions, clientOptions?: ClientOptions) {
        this.botOptions = botOptions;
        this.clientOptions = clientOptions ?? DEFAULT_CLIENT_OPTIONS;

        const processedOptions = Bot.ProcessOptions(this.botOptions);

        this.client = new Client(
            merge.all<ClientOptions>([DEFAULT_CLIENT_OPTIONS, processedOptions, this.clientOptions])
        );

        this.commands = new CommandCollection(this);

        return this;
    }

    public start(): void {
        this.client.login(this.botOptions.token);
    }

    public static ProcessOptions(options: IBotOptions): ClientOptions {
        const output: ClientOptions = {} as ClientOptions;

        if (typeof options.intents !== "undefined") output.intents = options.intents;

        return output;
    }
}
