'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;


const clientURL = "https://client-dev.psi-connect.org";
const INDEX = '/index.html';



// =======================================================================================================
// Mongo Connection
// ====================

const mongoose = require("mongoose");
const MessagesCollection = require("./models/messages");
const UsersCollection = require("./models/users");

const mongoDB = "mongodb+srv://tranchau:Test1234@cluster0.n0jz7.mongodb.net/chatApp?retryWrites=true&w=majority";

mongoose.connect(mongoDB).then(() => {
	console.log("------------- mongo connected ");
}).catch(err => console.log(err))


// ====================
// Mongo Connection
// =======================================================================================================


const onlineUsers = [];


const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = require('socket.io')(server,{
  cors: {
		origin: clientURL,
		methods: ["GET", "POST"],
		credentials: true
	}
});

io.on('connection', (socket) => {

  console.log("====================================================== Connected to server : " + socket.id );

  socket.on('username', (username) => {

console.log("====================================================== username : " + username );
onlineUsers.push( username );

		// onlineUsers.push( username );
    socket.emit('abcTest', { testdata: "testDATA1" });

    console.log( "======================================================" );
    console.log(onlineUsers );

// 		UsersCollection.findOne({username: username}).then(( curUser ) => {
// 			UsersCollection.find(
// 				{ username: { $in: curUser.contacts } }
// 			)
// 			.sort({ fullName: 1 })
// 			.then(( contactList ) => {
        
// console.log("------ contactList : " );
// console.log({ curUser: curUser, contacts: contactList, onlineList: onlineUsers });
// 				socket.emit('contactList', { curUser: curUser, contacts: contactList, onlineList: onlineUsers });
// 			})
// 		});


	});

  // socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('timeTEST', new Date().toTimeString()), 1000);
