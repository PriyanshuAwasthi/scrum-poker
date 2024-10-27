const cors = require('cors');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { faker } = require('@faker-js/faker')
const axios = require('axios');
// const functions = require("firebase-functions")

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:4200", "https://scrum-poker-air.web.app"]
    }
});

app.use(cors({
  origin: ["http://localhost:4200", "https://scrum-poker-air.web.app"]
}));

let rooms = new Set();
let users = new Map();

app.get('/api/check/:roomNumber', (req, res) => {
  const roomNumber = req.params.roomNumber;
  if (rooms.has(roomNumber)) {
    res.json({exists: true});
  }
  else res.json({exists: false});
});

app.get('/api/getRoom', (req, res) => {
  let roomNumber;
  do {
    roomNumber = Math.floor(1000 + Math.random() * 9000);
  } while (rooms.has(roomNumber.toString()));
  rooms.add(roomNumber.toString());
  res.json({
    roomNumber: roomNumber.toString()
  });
})

app.get('/', (req, res) => {
  res.send('Hello world');
});


io.on("connection", (socket) => {

  // Join room
  socket.on('join', (data) => {
    socket.join(data.room);
    if (users.has(data.room)) {
      socket.emit('existingUsers', users.get(data.room));
      users.get(data.room).push(data);
    } else {
      users.set(data.room, [data]);
    }
    socket.to(data.room).emit('newUser', data);
  })
  socket.on('score', (data) => {
    console.log(data);
    io.emit('received', {data: data, message: 'This is a test message'});
  });
});


const url = `https://web-sockets-backend.onrender.com/`; // Replace with your Render URL
const interval = 30000; // Interval in milliseconds (30 seconds)

function reloadWebsite() {
  axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}


setInterval(reloadWebsite, interval);

httpServer.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

// exports.api = functions.https.onRequest(app);