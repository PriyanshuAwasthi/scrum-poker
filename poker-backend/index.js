const cors = require('cors');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { faker } = require('@faker-js/faker')
const axios = require('axios');

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
let roomMappedUsers = new Map();

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

  // When New User Joins
  // newUser of type user having all the info
  socket.on('join', (newUser) => {
    socket.join(newUser.room);
    // If room already exists
    if (roomMappedUsers.has(newUser.room)) {
      // return existing users of the room to the newly joined user
      // Will return the newUser as existing user if the user already exists (let's say the user reloaded the page)
      socket.emit('existingUsers', roomMappedUsers.get(newUser.room));
      
      // update existing users by adding the new user
      var exist = roomMappedUsers.get(newUser.room);
      let flag = false;
      for (let u of exist) {
        if (u.email === newUser.email) {
          flag = true;
          break;
        }
      }
      // add only if it does not already exists
      if (!flag) {
        exist.push(newUser);
        roomMappedUsers.set(newUser.room, exist);
      }
    } else {
      // make a new room and user entry in the map
      roomMappedUsers.set(newUser.room, [newUser]);
      socket.emit('existingUsers', roomMappedUsers.get(newUser.room));
    }
    // return the new user to every other user except the new user
    socket.to(newUser.room).emit('newUser', newUser);
  });


  // When a score is selected
  // user contains all the info
  socket.on('updateScore', (user) => {
    for (const entity of roomMappedUsers.get(user.room)) {
      if (entity.email === user.email) {
        // Update the score of the user in database
        Object.assign(entity, user);
        // break;
      }
      else { // was not here 
        entity.estimatesHidden = true // was not here 
      }
    }
    // Return the user who changed the score to all other users except this user
    io.to(user.room).emit('scoreUpdated', user);
  });


  // When a user hides/unhide the cards
  // toggleCards of type boolean and roomNumber
  socket.on('toggleCards', (toggleCards) => {
    // return whether estimates are hidden or not
    // socket.to(toggleCards.room).emit('toggleScoreCards', toggleCards.estimatesHidden);
    io.to(toggleCards.room).emit('toggleScoreCards', toggleCards.estimatesHidden);
    var existing = roomMappedUsers.get(toggleCards.room);
    for (let u of existing) {
      // Update data source for hiddenEstimates
        u.hidden = toggleCards.estimatesHidden;
      u.estimatesHidden = toggleCards.estimatesHidden;
    }
  })


  socket.on('deleteEstimates', (room) => {
    var existing = roomMappedUsers.get(room);
    for (let u of existing) {
      u.hidden = false;
      u.estimatesHidden = false;
      u.estimate = -1;
    }
    io.to(room).emit('delete', true);
  })

  socket.on('triggerAvg', (room) => {
    io.to(room).emit('showAvg', true);
  })
});


const url = `https://web-sockets-backend.onrender.com/`; // Replace with your Render URL
const interval = 48000; // Interval in milliseconds (48 seconds)

function reloadWebsite() {
  axios.get(url)
    .then(response => {
      console.log('');
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


// user 
// email: string; //mandatory
// name: string; //mandatory
// estimate?: number; 
// hidden: boolean; //mandatory 
// room: string, //mandatory
// estimatesHidden: boolean //mandatory