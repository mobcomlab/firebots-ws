'use strict';

const chat = require('../firebots/chatInterface');

const botId = '1';

exports.getName = function() {
    return "Welcome Bot";
};

exports.receiveUserMessage = function(chatRoomId, message) {
    let newMessage = {
        isBot: true,
        text: 'Hello ' + message['senderName'] + '.',
        isFirstMessageOfDate: false,
        sendingTime: '2017-09-30T09:47:47.593Z',
        senderId: botId,
        senderName: this.getName()
    };

    return chat.sendMessage(this, chatRoomId, newMessage);
};

exports.receiveBotMessage = function(chatRoomId, message) {

};