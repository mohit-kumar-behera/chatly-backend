const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
  addUser,
  addUserToActiveBucket,
  getActiveUsers,
  getActiveUser,
  removeActiveUser,
} = require('./users');
const { createToken, generateID } = require('./utils');

const PORT = process.env.PORT || 8000;
const TRUE = 'true';

const LOCALHOST_URL = 'http://localhost:3000';
const CLIENT_DEPLOYED_URL = 'https://sensational-malabi-0fa8a6.netlify.app';
const CLIENT_URL =
  process.env.IS_PRODUCTION === TRUE ? CLIENT_DEPLOYED_URL : LOCALHOST_URL;

app.get('/', (req, res) => {
  res.send('Hello, Connected to server for chatly');
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

const io = require('socket.io')(server, {
  cors: {
    origin: CLIENT_URL,
  },
});

io.on('connection', socket => {
  socket.on('register', ({ name, mobileNumber }, cb) => {
    const { error, user } = addUser({ name, mobileNumber });

    if (error) return cb({ error, user });

    const registerToken = createToken({ name, mobileNumber });

    cb({ error, user, registerToken });
  });

  socket.on('login', (token, cb) => {
    let error, decode;
    try {
      decode = jwt.verify(token, process.env.SECRET_KEY);

      if (!decode.mobileNumber) error = { message: 'Something went wrong' };

      const { name, mobileNumber } = decode;
      addUserToActiveBucket({ name, mobileNumber });
    } catch (err) {
      error = { message: 'Invalid Token' };
      decode = null;
    }

    cb({ error, decode, token });
  });

  socket.on('logout', (mobileNumber, cb) => {
    let error,
      success = false;
    const flag = removeActiveUser(mobileNumber);

    if (!flag) error = { message: 'Something went wrong' };
    else success = true;

    cb(error, success);
  });

  socket.on('getOpponentUser', (id, cb) => {
    const mobileNumber = id;
    const opponentUser = getActiveUser(mobileNumber);
    cb(opponentUser);
  });

  socket.on('activeUsers', cb => {
    const actveUsrs = getActiveUsers();
    cb(actveUsrs);
  });

  socket.on('joinChat', (room, cb) => {
    let connectionStatus;
    try {
      socket.join(room);
      connectionStatus = true; // Success
    } catch (err) {
      connectionStatus = false; // Fail
    } finally {
      cb(connectionStatus);
    }
  });

  socket.on('sendMessage', (messageObj, cb) => {
    messageObj.id = generateID();
    io.to(messageObj.toRoom).emit('message', messageObj);
    cb();
  });
});
