import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import Bot from "./Bot";
import { TAction } from "./types";

export class Command {
    public action: TAction = () => {};
    public aliases: string[] = [];
    public description: string = "";
    public name: string[] = [];
    public servers: string[] = [];

    public toJson(i: number): RESTPostAPIChatInputApplicationCommandsJSONBody {
        return {
            name: this.name[i],
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

    public setDescription(description: string): this {
        this.command.description = description;
        return this;
    }

    public setName(name: string | string[]): this {
        if (Array.isArray(name)) this.command.name = name;
        else this.command.name = [name];
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
    private set: Set<Command> = new Set<Command>();

    public constructor(bot: Bot) {
        this.bot = bot;
    }

    public add(command: Command): this {
        this.set.add(command);
        return this;
    }

    public get(name: string): Command | null {
        for (const command of this.set) {
            if (command.name.includes(name)) return command;
        }
        return null;
    }

    public register(): unknown {
        const rest = new REST({ version: "10" }).setToken(this.bot.botOptions.token);

        const commands = Array.from(this.set);
        const globalCommands = commands.filter((command) => command.servers.length === 0);
        const globalCommandsRest = CommandCollection.ToRest(globalCommands);
        const serversCommands = commands.filter((command) => command.servers.length > 0);
        const serverMap = new Map<string, Command[]>();
        serversCommands.forEach((command) => {
            command.servers.forEach((server) => {
                serverMap.set(server, [...(serverMap.get(server) ?? []), command]);
            });
        });

        return {
            global: rest.put(Routes.applicationCommands(this.bot.botOptions.clientId), {
                body: globalCommandsRest,
            }),
        };
    }

    public static ToRest(commands: Command[]): RESTPostAPIChatInputApplicationCommandsJSONBody[] {
        const output: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
        let offset = 0;
        commands.forEach((command, index) => {
            command.name.forEach((name, nameIndex) => {
                output[index + offset] = commands[index].toJson(nameIndex);
                offset++;
            });
        });
        return output;
    }
}
