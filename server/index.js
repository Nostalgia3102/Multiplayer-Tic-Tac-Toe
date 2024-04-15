// importing modules
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);
const Room = require("./models/room");
var io = require("socket.io")(server);

//Middlewares :
app.use(express.json());

//Promise in JS = Futures in Dart

io.on("connection", (socket) => {
console.log("socket connected!");
 socket.on("createRoom", async ({nickname})=>{
try{
// 1st Step :
 // room is created -> server side work
  let room = new Room();
       let player = {
         socketID: socket.id,
         nickname,  //or nickname : nickname , -> but in JS if variable-name is same as the value being assigned to it. Then it can easily be done like this : nickname,
         playerType: "X",
       };

       room.turn = player;

       // player is stored in the room
       room.players.push(player);
       // save the same in mongo db :
       room = await room.save();
       console.log(room);
       const roomId = room._id.toString();
       console.log("Printing the room id :");

       console.log(roomId);

// 2nd Step :
       //joining to a SPECIFIC ROOM ID :
       // room1 = sour & avni :
       // room2 = ayu & rahul :
       // we want that specific msg should go to the rooms of the specific players:
       socket.join(roomId);


// 3rd Step :
       // tell our client that room has been created
       // now go to the next screen :

       //io -> send data to everyone :
       //socket -> sending data to yourself :
       io.to(roomId).emit("createRoomSuccess", room);

     }catch(e){
        console.log(e);
        }
     });

    socket.on('joinRoom', async ({nickname, roomId}) => {
    try{
        if(!roomId.match(/^[0-9a-fA-F]{24}$/)){
        socket.emit('errorOccurred', 'Please enter a valid room id');
        return;
        }
         let room = await Room.findById(roomId);

              if (room.isJoin) {
                let player = {
                  nickname,
                  socketID: socket.id,
                  playerType: "O",
                };
                socket.join(roomId);
                room.players.push(player);
                room.isJoin = false;
                room = await room.save();
                io.to(roomId).emit("joinRoomSuccess", room);
                io.to(roomId).emit("updatePlayers", room.players);
                io.to(roomId).emit("updateRoom", room);
              } else {
                socket.emit("errorOccurred","The game is in progress, try again later.");
              }
    }catch(e){
    console.log(e);}
    })

    socket.on("tap", async ({ index, roomId }) => {
        try {
          let room = await Room.findById(roomId);

          let choice = room.turn?.playerType; // x or o
          if (room.turnIndex == 0) {
            room.turn = room.players[1];
            room.turnIndex = 1;
          } else {
            room.turn = room.players[0];
            room.turnIndex = 0;
          }
          room = await room.save();
          io.to(roomId).emit("tapped", {
            index,
            choice,
            room,
          });
        } catch (e) {
          console.log(e);
        }
      });

      socket.on("winner", async ({ winnerSocketId, roomId }) => {
          try {
            let room = await Room.findById(roomId);
            let player = room.players.find(
              (playerr) => playerr.socketID == winnerSocketId
            );
            player.points += 1;
            room = await room.save();

            if (player.points >= room.maxRounds) {
              io.to(roomId).emit("endGame", player);
            } else {
              io.to(roomId).emit("pointIncrease", player);
            }
          } catch (e) {
            console.log(e);
          }
      });
});

//in mongodb -> in password using %40 instead of @;
const DB =
  "mongodb+srv://Sour3102:Gunu%400875@cluster0.dte3xfv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  mongoose
    .connect(DB)
    .then(() => {
      console.log("Connection successful!");

    })
    .catch((e) => {
      console.log(e);
    });


server.listen(port, '0.0.0.0', () => {
  console.log(`Server started and running on port ${port}`);
});