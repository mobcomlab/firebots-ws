'use strict';

const admin = require('firebase-admin');
const database = admin.database();

// const chat = require('chatInterface');

const bots = {
    welcome: require('../bots/welcomeBot')
   // kotlin: require('../bots/kotBot')
};

exports.chatJoined = (event) => {
    const chatRoomId = event.params.roomId;
    const userId = event.params.userId;

    database.ref('user').child(userId).once('value').then(snapshot => {
        const user = snapshot.val();

        Object.keys(bots).forEach(key => {
            const bot = bots[key];

            if(user['isBot']) {
                return bot.onBotJoined(chatRoomId, user);
            } else {
                return bot.onUserJoined(chatRoomId, user);
            }
        })
    });

};

exports.chatMessage = (event) => {
    const chatRoomId = event.params.roomId;
    const message = event.data.val();

    Object.keys(bots).forEach(key => {
        const bot = bots[key];

        if(message['isBot']) {
            return bot.onBotMessage(chatRoomId, message);
        } else {
            return bot.onUserMessage(chatRoomId, message);
        }
    })

};