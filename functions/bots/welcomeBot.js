'use strict';

const chat = require('../firebots/chatInterface');

const botId = '1';

exports.getName = function() {
    return "Welcome Bot";
};

exports.onUserJoined = function(chatRoomId, user) {
    let newMessage = {
        isBot: true,
        text: 'Hello ' + user['username'] + '.',
        isFirstMessageOfDate: false,
        sendingTime: new Date().toISOString(),
        senderId: botId,
        senderName: this.getName()
    };

    return chat.sendMessage(this, chatRoomId, newMessage);
};

exports.onBotJoined = function(chatRoomId, user) {
};

exports.onUserMessage = function(chatRoomId, message) {
};

exports.onBotMessage = function(chatRoomId, message) {
};