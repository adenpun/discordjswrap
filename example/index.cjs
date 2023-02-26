// @ts-check

const { Bot, Intents, CommandBuilder, CommandOption } = require("discordjswrap");
require("dotenv").config();

const bot = new Bot({
    intents: [Intents.Guilds],
    // @ts-ignore
    token: process.env.TOKEN,
    // @ts-ignore
    clientId: process.env.CLIENT_ID,
    replyError: true,
});

bot.commands.add(
    CommandBuilder.New()
        .setName(["debug", "interaction", "get-interaction"])
        // @ts-ignore
        .setServers([process.env.TEST_SERVER])
        .setDescription(
            "Get the interaction. (Only avaliable in server " + process.env.TEST_SERVER + ")"
        )
        .setAction((interaction) => {
            interaction.reply(
                JSON.stringify(interaction, (_, v) => (typeof v === "bigint" ? `${v}n` : v), 2)
            );
        })
        .build()
);

bot.commands.add(
    CommandBuilder.New()
        .setName("say")
        .setDescription("Repeat what you say!")
        .setOptions([
            {
                type: CommandOption.String,
                name: "message",
                description: "Your message!",
                required: true,
            },
        ])
        .setAction(async (interaction) => {
            await interaction.channel?.send(
                interaction.options.getString("message") ?? "No message was given."
            );
            interaction.reply({ content: "Done!", ephemeral: true });
        })
        .build()
);

bot.commands.add(
    CommandBuilder.New()
        .setName("shutdown")
        .setDescription("Shutdown the bot!")
        .setAction(async (interaction) => {
            await interaction.reply({ content: "Done!", ephemeral: true });
            bot.destroy();
        })
        .build()
);

bot.start().then((client) => {
    console.log(
        `Logged in! ${client.user.username}#${client.user.discriminator}(${client.user.id})`
    );
    bot.commands.register();
});
