const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv/config");

const user = require("./routes/user-route");
const nft = require("./routes/nft-route");
const jackpot = require("./routes/jackpot-route");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", user);
app.use("/nft", nft);
app.use("/jackpot", jackpot);

mongoose
  .connect("mongodb://127.0.0.1/jackpotgame")
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
