const express = require("express");
const app = express();
const server = require("http").createServer(app);

const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot("6062571227:AAEp4xlyb37VwAxub_TAFoJK9b8-EXC3qJU", {
  polling: true,
});

app.get("/", (req, res) => {
  res.send("Crypto bot is running!");
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.text.toString().toLowerCase().indexOf("/start") === 0) {
    bot.sendMessage(
      chatId,
      "Welcome to the Crypto bot! Please enter the name of the cryptocurrency you would like to know about."
    );
  } else {
    const coinName = msg.text.toString();
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${coinName}`)
      .then((response) => {
        const data = response.data;
        const message = `Name:\t${data.name}\nSymbol:\t${
          data.symbol
        }\nPrice:\t${data.market_data.current_price.usd.toString()} USD\n24h:\t${
          data.market_data.price_change_percentage_24h > 0 ? "+" : ""
        }${data.market_data.price_change_percentage_24h.toString()}%`;
        bot.sendMessage(chatId, message);
      })
      .catch((error) => {
        bot.sendMessage(
          chatId,
          "We could not find information on the requested cryptocurrency. Please try again."
        );
      });
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
