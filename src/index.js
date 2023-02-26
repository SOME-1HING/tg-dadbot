import { production } from "./core";
import { Telegraf } from "telegraf";
import fetch from "node-fetch";
import * as fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

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

/* const chats = [];
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
); */

let botId;

tfbot.telegram.getMe().then((bot) => {
  botId = bot.id;
});

tfbot
  .command("start", async (ctx) => {
    const msg = ctx.message;
    const chatId = msg.chat.id;

    /*   if (!users.includes(msg.from.id) && msg.chat.type !== "private") {
    users.push(chatId);
    await fs.writeFile("user.json", JSON.stringify(users)),
      (err) => {
        if (err) throw err;
      };
  } */

    await tfbot.telegram.sendMessage(chatId, "Hi I am up.", {
      reply_to_message_id: msg.message_id,
    });
  })
  .catch((e) => {
    console.error(e.message); // "oh, no!"
  });

tfbot
  .command("embarrass", async (ctx) => {
    const msg = ctx.message;
    const chatId = msg.chat.id;

    if (!msg.reply_to_message) {
      return await tfbot.telegram.sendMessage(chatId, "Reply to a message.", {
        reply_to_message_id: msg.message_id,
      });
    }
    const userId = msg.reply_to_message.from.id;

    if (userId == botId) {
      return await tfbot.telegram.sendPhoto(
        chatId,
        path.join(process.cwd(), "src/Images/user", "TgDadBot.png"),
        {
          parse_mode: "HTML",
          caption: `<i>How dare you trying to embarrass your father ~${
            msg.from.username ? "@" + msg.from.username : msg.from.first_name
          }?</i>`,
        }
      );
    }

    let random = Math.floor(Math.random() * Lists.embarrassingThings.length);

    const imageId = userId;

    const avatar = await tfbot.telegram.getUserProfilePhotos(userId);

    if (avatar.total_count == 0) {
      return tfbot.telegram.sendMessage(
        chatId,
        Lists.embarrassingThings[random],
        {
          reply_to_message_id: msg.message_id,
        }
      );
    }

    const file_id = avatar.photos[0][0].file_id;
    const file = await tfbot.telegram.getFile(file_id);

    const file_path = file.file_path;
    const photo_url = `https://api.telegram.org/file/bot${process.env.TOKEN}/${file_path}`;
    const response = await fetch(photo_url);

    const stream = fs.createWriteStream(`/tmp/${imageId}.png`);
    response.body.pipe(stream);

    stream.on("finish", () => {
      const file = fs.readFileSync(`/tmp/${imageId}.png`);
      tfbot.telegram.sendPhoto(chatId, file, {
        contentType: "image/png",
        parse_mode: "HTML",
        caption: `<i>${Lists.embarrassingThings[random]}</i> ~${
          msg.reply_to_message.from.username
            ? "@" + msg.reply_to_message.from.username
            : msg.reply_to_message.from.first_name
        }`,
      });
      fs.unlink(`/tmp/${imageId}.png`, (err) => {
        if (err) console.log(err);
      });
    });
  })
  .catch((e) => {
    console.error(e.message); // "oh, no!"
  });

tfbot
  .command(["joke", "dadjoke"], async (ctx) => {
    const msg = ctx.message;
    const chatId = msg.chat.id;
    let random = Math.floor(Math.random() * Lists.dadjokes.length);

    await tfbot.telegram.sendMessage(chatId, Lists.dadjokes[random], {
      reply_to_message_id: msg.message_id,
    });
  })
  .catch((e) => {
    console.error(e.message); // "oh, no!"
  });
tfbot
  .command("advice", async (ctx) => {
    const msg = ctx.message;
    const chatId = msg.chat.id;
    let random = Math.floor(Math.random() * Lists.advice.length);

    await tfbot.telegram.sendMessage(chatId, Lists.advice[random], {
      reply_to_message_id: msg.message_id,
    });
  })
  .catch((e) => {
    console.error(e.message); // "oh, no!"
  });

tfbot
  .command("dab", async (ctx) => {
    const msg = ctx.message;
    const chatId = msg.chat.id;
    let random = Math.floor(Math.random() * Lists.dadsDabbing.length);

    await tfbot.telegram.sendPhoto(chatId, Lists.dadsDabbing[random], {
      reply_to_message_id: msg.message_id,
    });
  })
  .catch((e) => {
    console.error(e.message); // "oh, no!"
  });
tfbot
  .command("kumiko", async (ctx) => {
    const msg = ctx.message;
    const chatId = msg.chat.id;
    let random = Math.floor(Math.random() * Lists.kumiko.length);

    await tfbot.telegram.sendPhoto(chatId, Lists.kumiko[random], {
      reply_to_message_id: msg.message_id,
    });
  })
  .catch((e) => {
    console.error(e.message); // "oh, no!"
  });
tfbot
  .command("mio", async (ctx) => {
    const msg = ctx.message;
    const chatId = msg.chat.id;
    let random = Math.floor(Math.random() * Lists.mio.length);

    await tfbot.telegram.sendPhoto(chatId, Lists.mio[random], {
      reply_to_message_id: msg.message_id,
    });
  })
  .catch((e) => {
    console.error(e.message); // "oh, no!"
  });

tfbot
  .on("message", async (ctx) => {
    const msg = ctx.message;
    const chatId = msg.chat.id;
    const text = msg.text;

    /* if (!chats.includes(chatId) && msg.chat.type !== "private") {
    chats.push(chatId);
    await fs.writeFile("chats.json", JSON.stringify(chats));
  } */

    // I'm matcher
    if (!text.match(WINNING_MATCH) && text.match(IM_MATCH)) {
      let imMatchData = text.match(IM_MATCH),
        formattingMatchData = text.match(FORMAT_MATCH),
        hiContent =
          !formattingMatchData || formattingMatchData.index > imMatchData.index
            ? `${imMatchData[2]}`
            : `${formattingMatchData[0]}${imMatchData[2]}`;

      if (hiContent.toLowerCase() == "dad") {
        return await tfbot.telegram.sendMessage(chatId, `No I'm Dad here.`, {
          reply_to_message_id: msg.message_id,
        });
      }
      return await tfbot.telegram.sendMessage(
        chatId,
        `Hi ${hiContent}, I'm Dad.`,
        {
          reply_to_message_id: msg.message_id,
        }
      );
    }

    // Kys matcher
    if (text.match(KYS_MATCH)) {
      await tfbot.telegram.sendMessage(
        chatId,
        `You better mean Kissing Your Self!`,
        {
          reply_to_message_id: msg.message_id,
        }
      );
    }

    // Playing matcher
    if (text.match(WINNING_MATCH)) {
      switch (text.match(WINNING_MATCH)[0]) {
        case "play":
          await tfbot.telegram
            .sendMessage(chatId, "I hope ya win son!", {
              reply_to_message_id: msg.message_id,
            })
            .catch(() => {});
          break;
        case "playing":
          await tfbot.telegram
            .sendMessage(chatId, "Are ya winning son?", {
              reply_to_message_id: msg.message_id,
            })
            .catch(() => {});
          break;
        case "played":
          await tfbot.telegram
            .sendMessage(chatId, "Did ya win son?", {
              reply_to_message_id: msg.message_id,
            })
            .catch(() => {});
      }
      return;
    }

    // Shut up matcher
    if (text.match(SHUT_UP_MATCH)) {
      await tfbot.telegram
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
      await tfbot.telegram
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
      await tfbot.telegram
        .sendMessage(
          chatId,
          possibleResponses[
            Math.floor(Math.random() * possibleResponses.length)
          ],
          {
            reply_to_message_id: msg.message_id,
          }
        )
        .catch(() => {});
      return;
    }
  })
  .catch((e) => {
    console.error(e.message); // "oh, no!"
  });

tfbot
  .command("help", async (ctx) => {
    const msg = ctx.message;
    const chatId = msg.chat.id;

    const text =
      "Dad Bot\nThe father you always wanted\n\nMade by: @SOME1_HING\nInspired by: Discord DadBot";
    await tfbot.telegram.sendMessage(chatId, text, {
      reply_to_message_id: msg.message_id,
    });
  })
  .catch((e) => {
    console.error(e.message); // "oh, no!"
  });

//prod mode (Vercel)
export const startVercel = async (req, res) => {
  await production(req, res, tfbot);
};
