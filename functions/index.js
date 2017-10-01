'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin'); // The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp(functions.config().firebase);

const geochats = require('./geochats/invite');
const manager = require('./firebots/manager');

// Triggers
exports.geochatInvite = functions.database.ref('chatroom/{roomId}').onCreate(geochats.invite);

exports.chatJoined = functions.database.ref('chatroom/{roomId}/user/{userId}').onCreate(manager.chatJoined);
exports.chatMessage = functions.database.ref('chatroom/{roomId}/message/{pushId}').onCreate(manager.chatMessage);

// Test only
exports.resetDb = functions.database.ref('test/reset').onCreate(require('./test/resetDb').resetDb);