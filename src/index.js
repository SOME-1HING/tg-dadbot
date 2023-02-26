import TelegramBot from "node-telegram-bot-api";
import { production } from "./core";
import { Telegraf } from "telegraf";
import fetch from "node-fetch";
import * as fs from "fs";
import path from "path";

const file = path.join(process.cwd(), "files", "test.json");

const bot = new TelegramBot(process.env.TOKEN);
const tfbot = new Telegraf(process.env.TOKEN);

const Lists = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src/data", "data.json"), "utf-8")
);

// ----------------------Init-----------------------------
dotenv.config();

process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 0;

// ----------------------Patterns-----------------------------
const FORMAT_MATCH = /(\*\*?\*?|``?`?|__?|~~|\|\|)+/i,
  IM_MATCH = /\b((?:i|l)(?:(?:'|`|‛|‘|’|′|‵)?m| am|am)) ([\s\S]*)/i,
  WINNING_MATCH = /\b(?:play|played|playing)\b/i,
  SHUT_UP_MATCH = /\b(stfu|shutup|shut\s(?:the\s)?(?:fuck\s)?up)\b/i,
  GOODBYE_MATCH = /\b(?:good)? ?bye\b/i,
  KYS_MATCH = /\b(kys|kill\byour\s?self)\b/i,
  THANKS_MATCH = /\b(?:thank you|thanks) dad\b/i;

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
const chats = [];
fs.readFile(
  path.join(process.cwd(), "src/data", "chat.json"),
  function (err, data) {
    if (err) throw err;
    const elements = JSON.parse(data);

    elements.forEach((element) => {
      if (!chats.includes(element)) {
        chats.push(element);
      }
    });
  }
);
const users = [];
fs.readFile(
  path.join(process.cwd(), "src/data", "user.json"),
  function (err, data) {
    if (err) throw err;
    const elements = JSON.parse(data);

    elements.forEach((element) => {
      if (!users.includes(element)) {
        users.push(element);
      }
    });
  }
);

let botId;
bot.getMe().then((bot) => {
  botId = bot.id;
});

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  if (!users.includes(msg.from.id) && msg.chat.type !== "private") {
    users.push(chatId);
    await fs.writeFile("user.json", JSON.stringify(users)),
      (err) => {
        if (err) throw err;
      };
  }

  await bot.sendMessage(chatId, "Hi I am up.", {
    reply_to_message_id: msg.message_id,
  });
});

bot.onText(/\/embarrass/, async (msg) => {
  const chatId = msg.chat.id;

  if (!msg.reply_to_message) {
    return await bot.sendMessage(chatId, "Reply to a message.", {
      reply_to_message_id: msg.message_id,
    });
  }
  const userId = msg.reply_to_message.from.id;

  if (userId == botId) {
    return await bot.sendPhoto(chatId, `./Images/user/TgDadBot.png`, {
      parse_mode: "HTML",
      caption: `<i>How dare you trying to embarrass your father ~${
        msg.from.username ? "@" + msg.from.username : msg.from.first_name
      }?</i>`,
    });
  }

  let random = Math.floor(Math.random() * Lists.embarrassingThings.length);

  const imageId = userId;

  const avatar = await bot.getUserProfilePhotos(userId);

  if (avatar.total_count == 0) {
    return bot.sendMessage(chatId, Lists.embarrassingThings[random], {
      reply_to_message_id: msg.message_id,
    });
  }

  const file_id = avatar.photos[0][0].file_id;
  const file = await bot.getFile(file_id);

  const file_path = file.file_path;
  const photo_url = `https://api.telegram.org/file/bot${process.env.TOKEN}/${file_path}`;
  const response = await fetch(photo_url);

  const stream = fs.createWriteStream(`./Images/user/${imageId}.png`);
  response.body.pipe(stream);

  stream.on("finish", () => {
    const file = fs.readFileSync(`./Images/user/${imageId}.png`);
    bot.sendPhoto(chatId, file, {
      contentType: "image/png",
      parse_mode: "HTML",
      caption: `<i>${Lists.embarrassingThings[random]}</i> ~${
        msg.reply_to_message.from.username
          ? "@" + msg.reply_to_message.from.username
          : msg.reply_to_message.from.first_name
      }`,
    });
    fs.unlink(`./Images/user/${imageId}.png`, (err) => {
      if (err) console.log(err);
    });
  });
});

bot.onText(/\/(joke|dadjoke)/, async (msg) => {
  const chatId = msg.chat.id;
  let random = Math.floor(Math.random() * Lists.dadjokes.length);

  await bot.sendMessage(chatId, Lists.dadjokes[random], {
    reply_to_message_id: msg.message_id,
  });
});
bot.onText(/\/advice/, async (msg) => {
  const chatId = msg.chat.id;
  let random = Math.floor(Math.random() * Lists.advice.length);

  await bot.sendMessage(chatId, Lists.advice[random], {
    reply_to_message_id: msg.message_id,
  });
});
bot.onText(/\/dab/, async (msg) => {
  const chatId = msg.chat.id;
  let random = Math.floor(Math.random() * Lists.dadsDabbing.length);

  await bot.sendPhoto(chatId, Lists.dadsDabbing[random], {
    reply_to_message_id: msg.message_id,
  });
});
bot.onText(/\/kumiko/, async (msg) => {
  const chatId = msg.chat.id;
  let random = Math.floor(Math.random() * Lists.kumiko.length);

  await bot.sendPhoto(chatId, Lists.kumiko[random], {
    reply_to_message_id: msg.message_id,
  });
});
bot.onText(/\/mio/, async (msg) => {
  const chatId = msg.chat.id;
  let random = Math.floor(Math.random() * Lists.mio.length);

  await bot.sendPhoto(chatId, Lists.mio[random], {
    reply_to_message_id: msg.message_id,
  });
});

bot.onText(/(.*)/, async (msg) => {
  const chatId = msg.chat.id;

  if (!chats.includes(chatId) && msg.chat.type !== "private") {
    chats.push(chatId);
    await fs.writeFile("chat.json", JSON.stringify(chats), (err) => {
      if (err) throw err;
    });
  }
});

bot.onText(/(.*)/, async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!chats.includes(chatId) && msg.chat.type !== "private") {
    chats.push(chatId);
    await fs.writeFile("chats.json", JSON.stringify(chats));
  }

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

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;

  const text =
    "Dad Bot\nThe father you always wanted\n\nMade by: @SOME1_HING\nInspired by: Discord DadBot";
  // await bot.sendMessage(chatId, Lists.advice[random], {
  //   reply_to_message_id: msg.message_id,
  // });
});

//prod mode (Vercel)
export const startVercel = async (req, res) => {
  await production(req, res, bot);
};
