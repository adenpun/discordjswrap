// @ts-check

const { Bot, Intents } = require("discordjswrap");
require("dotenv").config();

const bot = new Bot({ intents: [Intents.Guilds], token: process.env.TOKEN ?? "" });

bot.start();

bot.
