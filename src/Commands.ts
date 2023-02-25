import { REST, Routes } from "discord.js";
import Bot from "./Bot";
import { TAction } from "./types";

export class Command {
    public action: TAction = () => {};
    public description: string = "";
    public name: string = "";
    public servers: string[] = [];
}

export class CommandBuilder {
    private command: Command = new Command();

    public build(): Command {
        return this.command;
    }

    public setAction(action: TAction): this {
        this.command.action = action;
        return this;
    }

    public setDescription(description: string): this {
        this.command.description = description;
        return this;
    }

    public setName(name: string): this {
        this.command.name = name;
        return this;
    }

    public static New(): CommandBuilder {
        return new CommandBuilder();
    }
}

export class CommandCollection extends Map<string, Command> {
    private bot: Bot;

    public constructor(bot: Bot) {
        super();
        this.bot = bot;
    }

    public register(): unknown {
        const rest = new REST({ version: "10" }).setToken(this.bot.botOptions.token);

        const commands = {};
        const testCommands = {};
        const globalCommands = {};

        return {
            global: rest.put(Routes.applicationCommands(this.bot.botOptions.clientId), {
                body: commands,
            }),
            testServer: rest.put(
                Routes.applicationGuildCommands(
                    this.bot.botOptions.clientId,
                    this.bot.botOptions.testServer
                ),
                { body: commands }
            ),
        };
    }
}
