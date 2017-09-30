'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin'); // The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp(functions.config().firebase);

const chatroomObserverModule = require('./chatroomObserver');

const database = admin.database();

exports.messageCreated = functions.database.ref('chatroom/message/{pushId}').onCreate(chatroomObserverModule.chatroomMessageCreatedHandler);