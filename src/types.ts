import type { ClientOptions } from "discord.js";

export type Intents = ClientOptions["intents"];

export type TIntent = "Moderator";

export interface IBotOptions {
    intents?: TIntent[];
}
