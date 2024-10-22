// const {Server} = require('socket.io');
// const { createServer } = require('http');

// const httpServer = new createServer();
// const io = new Server(httpServer, {
//     cors: {
//         origin: "http://localhost:4200/"
//     }
// });

// io.on('connection', socket => {
//     console.log('connected')
// });

// io.listen(3000);

const cors = require('cors');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { faker } = require('@faker-js/faker')

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:4200"
    }
});


// const io = require('socket.io')(httpServer, {
//     cors: {
//         origin: "http://localhost:4200",
//         methods: ['GET']
//     }
// })

// app.use(cors());

io.on("connection", (socket) => {
  console.log('connected', socket);
  console.log('emitted');
  socket.on('score', (data) => {
    console.log(data);
    io.emit('received', {data: data, message: 'This is a test message'});
  });
});

httpServer.listen(3000);