import merge from "deepmerge";
import { ApplicationCommandType, ClientOptions, Events, InteractionType } from "discord.js";
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

    public start(): Promise<void> {
        this.client.login(this.botOptions.token);
        this.client.on(Events.InteractionCreate, (interaction) => {
            if (interaction.type === InteractionType.ApplicationCommand) {
                if (interaction.commandType === ApplicationCommandType.ChatInput) {
                    try {
                        this.commands.get(interaction.commandName)?.action(interaction);
                    } catch (err) {
                        console.log("ERR: " + err);
                        if (this.botOptions.replyError === true)
                            try {
                                interaction.reply("ERR: " + (err as object).toString());
                            } catch {}
                    }
                }
            }
        });
        return new Promise<void>((resolve) => {
            this.client.once(Events.ClientReady, () => {
                resolve();
            });
        });
    }

    public static ProcessOptions(options: IBotOptions): ClientOptions {
        const output: ClientOptions = {} as ClientOptions;

        if (typeof options.intents !== "undefined") output.intents = options.intents;

        return output;
    }
}
