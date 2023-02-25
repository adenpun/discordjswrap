import type { ChatInputCommandInteraction, GatewayIntentBits } from "discord.js";

export type TCommandInteraction = ChatInputCommandInteraction;

export type TAction = (interaction: TCommandInteraction) => void;

export interface IBotOptions {
    clientId: string;
    token: string;
    intents: GatewayIntentBits[];
    testServer: string;
}

export interface ICommand {
    name: string;
}

export interface ICommandCollectionTemplate {}
