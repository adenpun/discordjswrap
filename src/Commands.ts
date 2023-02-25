import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import Bot from "./Bot";
import { TAction } from "./types";

export class Command {
    public action: TAction = () => {};
    public aliases: string[] = [];
    public description: string = "";
    public name: string = "";
    public servers: string[] = [];

    public toJson(): RESTPostAPIChatInputApplicationCommandsJSONBody {
        return {
            name: this.name,
            description: this.description,
        };
    }
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

    public setAliases(aliases: string[]): this {
        this.command.aliases = aliases;
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

    public setServers(servers: string[]): this {
        this.command.servers = servers;
        return this;
    }

    public static New(): CommandBuilder {
        return new CommandBuilder();
    }
}

export class CommandCollection {
    private bot: Bot;
    private map: Map<string, Command> = new Map<string, Command>();

    public constructor(bot: Bot) {
        this.bot = bot;
    }

    public add(command: Command): this {
        this.map.set(command.name, command);
        if (command.aliases.length > 0)
            command.aliases.forEach((alias) => {
                const newCommand = new Command();
                Object.keys(newCommand).forEach((k) => {
                    (newCommand as any)[k] = (command as any)[k];
                });
                newCommand.name = alias;
                this.map.set(alias, newCommand);
            });
        return this;
    }

    public get(name: string): Command | undefined {
        return this.map.get(name);
    }

    public register(): unknown {
        const rest = new REST({ version: "10" }).setToken(this.bot.botOptions.token);

        const commands = Object.fromEntries(this.map.entries());
        const commandsName = Object.keys(commands);
        const globalCommands = commandsName
            .filter((commandName) => commands[commandName].servers.length === 0)
            .map((commandName) => commands[commandName].toJson());
        console.log(globalCommands);

        return {
            global: rest.put(Routes.applicationCommands(this.bot.botOptions.clientId), {
                body: globalCommands,
            }),
        };
    }
}
