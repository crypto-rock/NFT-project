var express = require('express');
const axios = require("axios");
require('dotenv').config();
var app = express();
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const util = require('util');
var server = require('http').createServer(app);
var port = 3306;
var io = require('socket.io')(server);
axios.defaults.headers.common["Authorization"] = process.env.SECRETCODE;
gameSocket = null;
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.use(express.static(__dirname + "/build"));
app.get("/*", function (req, res) {
  res.sendFile(__dirname + "/build/index.html", function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

server.listen(port, function () {
  console.log("server is running on " + port);
});


// Implement socket functionality
gameSocket = io.on('connection', function (socket) {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('bet info', async (req) => {
    console.log(req);
    var random_Num = 0;
    var betResult = [];
    var risk;
    var segment;
    var betAmount;
    var amount;
    var earnAmount;
    var totalrandom;
    betAmount = req.betAmount;
    amount = req.amount;
    amount -= betAmount;
    risk = req.risknumber;
    segment = req.segmentnumber;
    console.log(amount);
    console.log(random_Num)
    console.log(risk)
    console.log(segment)
    try {
      try {
        await axios.post(process.env.PLATFORM_SERVER + "api/games/bet", {
          token: req.token,
          amount: req.betAmount
        });
      } catch (err) {
        console.log(err);
        throw new Error("0")
      }

      random_Num = GetRandomsegment(segment);
      totalrandom = Gettotalrandom(segment);
      console.log(random_Num)
      earnAmount = await gameResult(risk, segment, betAmount, random_Num)
      console.log(earnAmount);
      try {
        await axios.post(process.env.PLATFORM_SERVER + "api/games/winlose", {
          token: req.token,
          amount: earnAmount
        });
      } catch (err) {
        throw new Error("1")
      }
      amount += earnAmount;
      betResult = {
        "amount": amount,
        "earnAmount": earnAmount,
        "randomNum": random_Num,
        "totalrandom": totalrandom
      }
      console.log(betResult)
      socket.emit("bet end", betResult)
    } catch (err) {
      console.log(err);
      socket.emit("error message", { "errMessage": err.message });
    }
  });

  console.log('socket connected: ' + socket.id);
  socket.emit('connected', {});
});


function GetRandomsegment(segment) {
  switch (segment) {
    case 0:
      return Math.floor(Math.random() * 9);
    case 1:
      return Math.floor(Math.random() * 19);
    case 2:
      return Math.floor(Math.random() * 29);
    case 3:
      return Math.floor(Math.random() * 39);
    case 4:
      return Math.floor(Math.random() * 49);
  }
}
function Gettotalrandom(segment) {
  switch (segment) {
    case 0:
      return 10;
    case 1:
      return 20;
    case 2:
      return 30;
    case 3:
      return 40;
    case 4:
      return 50;
  }
}
async function gameResult(risk, segment, betAmount, random) {
  var earnamount;
  if (risk == 0) {
    if (segment == 0) {
      if (random == 7) {
        earnamount = betAmount * 1.5;
      }
      else if (random == 1 || random == 6) {
        earnamount = 0;
      }
      else {
        earnamount = betAmount * 1.2;
      }
    }
    else if (segment == 1) {
      if (random == 5 || random == 15) {
        earnamount = betAmount * 1.5;
      }
      else if (random == 4 || random == 9 || random == 14 || random == 19) {
        earnamount = 0;
      }
      else {
        earnamount = betAmount * 1.2;
      }
    }
    else if (segment == 2) {
      if (random == 2 || random == 12 || random == 22) {
        earnamount = betAmount * 1.5;
      }
      else if (random == 1 || random == 6 || random == 11 || random == 16 || random == 21 || random == 26) {
        earnamount = 0;
      }
      else {
        earnamount = betAmount * 1.2;
      }
    }
    else if (segment == 3) {
      if (random == 9 || random == 19 || random == 29 || random == 39) {
        earnamount = betAmount * 1.5;
      }
      else if (random == 3 || random == 8 || random == 13 || random == 18 || random == 23 || random == 28 || random == 33 || random == 38) {
        earnamount = 0;
      }
      else {
        earnamount = betAmount * 1.2;
      }
    }
    else if (segment == 4) {
      if (random == 7) {
        earnamount = betAmount * 1.5;
      }
      else if (random == 1 || random == 6) {
        earnamount = 0;
      }
      else {
        earnamount = betAmount * 1.2;
      }
    }
  }
  else if (risk == 1) {
    if (segment == 0) {
      if (random == 8) {
        earnamount = betAmount * 1.9;
      }
      else if (random == 0 || random == 4) {
        earnamount = betAmount * 1.5;
      }
      else if (random == 2) {
        earnamount = betAmount * 2.0;
      }
      else if (random == 6) {
        earnamount = betAmount * 3.0;
      }
      else {
        earnamount = 0;
      }
    }
    else if (segment == 1) {
      if (random == 3 || random == 15) {
        earnamount = betAmount * 1.5;
      }
      else if (random == 1 || random == 9 || random == 11 || random == 13 || random == 17 || random == 19) {
        earnamount = betAmount * 2.0;
      }
      else if (random == 5) {
        earnamount = betAmount * 3.0;
      }
      else if (random == 7) {
        earnamount = betAmount * 1.8;
      }
      else {
        earnamount = 0;
      }
    }
    else if (segment == 2) {
      if (random == 14) {
        earnamount = betAmount * 1.7;
      }
      else if (random == 4 || random == 8 || random == 18 || random == 22 || random == 24 || random == 28) {
        earnamount = betAmount * 1.5;
      }
      else if (random == 0 || random == 2 || random == 10 || random == 12 || random == 20 || random == 26) {
        earnamount = betAmount * 2.0;
      }
      else if (random == 14) {
        earnamount = betAmount * 1.7;
      }
      else if (random == 16) {
        earnamount = betAmount * 4.0;
      }
      else if (random == 6) {
        earnamount = betAmount * 3.0;
      }
      else {
        earnamount = 0;
      }
    }
    else if (segment == 3) {
      if (random == 7 || random == 21 || random == 31 || random == 37) {
        earnamount = betAmount * 3.0;
      }
      else if (random == 3 || random == 11 || random == 13 || random == 17 || random == 25 || random == 29 || random == 33) {
        earnamount = betAmount * 2.0;
      }
      else if (random == 1 || random == 5 || random == 9 || random == 19 || random == 23 || random == 27 || random == 35 || random == 39) {
        earnamount = betAmount * 1.5;

      }
      else if (random == 15) {
        earnamount = betAmount * 1.6;
      }
      else {
        earnamount = 0;
      }
    }
    else if (segment == 4) {
      if (random == 3 || random == 7 || random == 11 || random == 17 || random == 21 || random == 25 || random == 27 || random == 31 || random == 35 || random == 39 || random == 43 || random == 47 || random == 49) {
        earnamount = betAmount * 1.5;
      }
      else if (random == 1 || random == 9 || random == 13 || random == 15 || random == 23 || random == 33 || random == 37 || random == 41) {
        earnamount = betAmount * 2.0;
      }
      else if (random == 5 || random == 19 || random == 45) {
        earnamount = betAmount * 3.0;
      }
      else if (random == 29) {
        earnamount = betAmount * 5.0;
      }
      else {
        earnamount = 0;
      }
    }
  }
  else if (risk == 2) {
    if (segment == 0) {
      if (random == 6) {
        earnamount = betAmount * 9.9;
      }
      else {
        earnamount = 0;
      }
    }
    else if (segment == 1) {
      if (random == 14) {
        earnamount = betAmount * 19.8;
      }
      else {
        earnamount = 0;
      }
    }
    else if (segment == 2) {
      if (random == 5) {
        earnamount = betAmount * 29.7;
      }
      else {
        earnamount = 0;
      }
    }
    else if (segment == 3) {
      totalrandom = 40;
      if (random == 34) {
        earnamount = betAmount * 39.6;
      }
      else {
        earnamount = 0;
      }
      return earnamount;
    }
    else if (segment == 4) {
      if (random == 39) {
        earnamount = betAmount * 49.5;
      }
      else {
        earnamount = 0;
      }
    }
  }
  return earnamount;
}

