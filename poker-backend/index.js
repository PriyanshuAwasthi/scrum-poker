const cors = require('cors');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { faker } = require('@faker-js/faker')
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
    socket.to(data.room).emit('newUser', data);
  })

  socket.on('score', (data) => {
    console.log(data);
    io.emit('received', {data: data, message: 'This is a test message'});
  });
});

httpServer.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

// exports.api = functions.https.onRequest(app);