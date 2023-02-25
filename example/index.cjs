// @ts-check

const { Bot, Intents, CommandBuilder } = require("discordjswrap");
require("dotenv").config();

const bot = new Bot({
    intents: [Intents.Guilds],
    token: process.env.TOKEN ?? "",
    clientId: process.env.CLIENT_ID ?? "",
    replyError: true,
});

bot.start().then(() => {
    console.log("loggedIn");
});

bot.commands
    .add(
        CommandBuilder.New()
            .setAliases(["test2", "test4"])
            .setName("test")
            .setDescription("test")
            .setAction((interaction) => {
                interaction.reply(
                    JSON.stringify(interaction, (_, v) => (typeof v === "bigint" ? `${v}n` : v), 2)
                );
            })
            .build()
    )
    .register();
