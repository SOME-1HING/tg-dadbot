// ----------------------Imports-----------------------------

import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import express from "express";

// ----------------------Init-----------------------------
dotenv.config();

const app = express();

// ----------------------Patterns-----------------------------
const FORMAT_MATCH = /(\*\*?\*?|``?`?|__?|~~|\|\|)+/i,
  IM_MATCH = /\b((?:i|l)(?:(?:'|`|‛|‘|’|′|‵)?m| am|am)) ([\s\S]*)/i,
  WINNING_MATCH = /\b(?:play|played|playing)\b/i,
  SHUT_UP_MATCH = /\b(stfu|shutup|shut\s(?:the\s)?(?:fuck\s)?up)\b/i,
  GOODBYE_MATCH = /\b(?:good)? ?bye\b/i,
  KYS_MATCH = /\b(kys|kill\byour\s?self)\b/i,
  THANKS_MATCH = /\b(?:thank you|thanks) dad\b/i;

// -----------------------------Routes--------------------------------------

app.get("/", (req, res) => {
  res.json({ SOME1HING: "github.com/SOME-1HING" });
});

const port = process.env.PROT || 3000;
app.listen(port, () => console.log("Server Started"));

// -----------------------Telegram--------------------------------------------

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId, "Hi I am up.", {
    reply_to_message_id: msg.message_id,
  });
});

bot.onText(/(.*)/, async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // I'm matcher
  if (!text.match(WINNING_MATCH) && text.match(IM_MATCH)) {
    let imMatchData = text.match(IM_MATCH),
      formattingMatchData = text.match(FORMAT_MATCH),
      hiContent =
        !formattingMatchData || formattingMatchData.index > imMatchData.index
          ? `${imMatchData[2]}`
          : `${formattingMatchData[0]}${imMatchData[2]}`;

    if (hiContent.toLowerCase() == "dad") {
      return await bot.sendMessage(chatId, `No I'm Dad here.`, {
        reply_to_message_id: msg.message_id,
      });
    }
    return await bot.sendMessage(chatId, `Hi ${hiContent}, I'm Dad.`, {
      reply_to_message_id: msg.message_id,
    });
  }

  // Kys matcher
  if (text.match(KYS_MATCH)) {
    await bot.sendMessage(chatId, `You better mean Kissing Your Self!`, {
      reply_to_message_id: msg.message_id,
    });
  }

  // Playing matcher
  if (text.match(WINNING_MATCH)) {
    switch (text.match(WINNING_MATCH)[0]) {
      case "play":
        await bot
          .sendMessage(chatId, "I hope ya win son!", {
            reply_to_message_id: msg.message_id,
          })
          .catch(() => {});
        break;
      case "playing":
        await bot
          .sendMessage(chatId, "Are ya winning son?", {
            reply_to_message_id: msg.message_id,
          })
          .catch(() => {});
        break;
      case "played":
        await bot
          .sendMessage(chatId, "Did ya win son?", {
            reply_to_message_id: msg.message_id,
          })
          .catch(() => {});
    }
    return;
  }

  // Shut up matcher
  if (text.match(SHUT_UP_MATCH)) {
    await bot
      .sendMessage(
        chatId,
        `Listen here @${
          msg.from.username ? msg.from.username : msg.from.first_name
        }, I will not tolerate you saying the words that consist of the letters 's h u t  u p' being said in this server, so take your own advice and close thine mouth in the name of the *pretending to be Japanese* anime server owner.`,
        {
          reply_to_message_id: msg.message_id,
        }
      )
      .catch(() => {});
  }

  // Goodbye matcher
  if (text.match(GOODBYE_MATCH)) {
    let possibleGoodbyes = [
      "Bye!",
      "Bye, have fun!",
      "Bye, don't get in trouble!",
      "Stay out of trouble!",
      "Be home before 8!",
      "Later champ!",
    ];
    await bot
      .sendMessage(
        chatId,
        possibleGoodbyes[Math.floor(Math.random() * possibleGoodbyes.length)],
        {
          reply_to_message_id: msg.message_id,
        }
      )
      .catch(() => {});
    return;
  }
  // Thanks matcher
  if (text.match(THANKS_MATCH)) {
    let possibleResponses = [
      "That's what I'm here for.",
      "Don't mention it champ.",
      "Next time just ask.",
      "Oh, uh, you're welcome I guess?",
    ];
    await bot
      .sendMessage(
        chatId,
        possibleResponses[Math.floor(Math.random() * possibleResponses.length)],
        {
          reply_to_message_id: msg.message_id,
        }
      )
      .catch(() => {});
    return;
  }
});
