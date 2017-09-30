'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin'); // The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp(functions.config().firebase);

const geochats = require('./geochats/invite');
const chatroomObserverModule = require('./firebots/chatroomObserver');

exports.geochatInvite = functions.database.ref('chatroom/{roomId}').onCreate(geochats.invite);
exports.messageCreated = functions.database.ref('chatroom/message/{pushId}').onCreate(chatroomObserverModule.chatroomMessageCreatedHandler);

// Test only
exports.resetDb = functions.database.ref('test/reset').onCreate(require('./test/resetDb').resetDb);