import type {
    CacheType,
    ChatInputCommandInteraction,
    GatewayIntentBits,
    RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

export type TCommandInteraction = ChatInputCommandInteraction<CacheType>;

export type TAction = (interaction: TCommandInteraction) => void;

export type TCommandOptions = Required<RESTPostAPIApplicationCommandsJSONBody>["options"];

export interface IBotOptions {
    clientId: string;
    token: string;
    intents: GatewayIntentBits[];
    replyError?: boolean;
}

export interface ICommand {
    name: string;
}

export interface ICommandCollectionTemplate {}
