'use strict';

const request = require('request');
const chat = require('../firebots/chatInterface');

const botId = '2';

exports.getName = function() {
    return "KotBot";
};

exports.onUserJoined = function(chatRoomId, user) {

};

exports.onBotJoined = function(chatRoomId, user) {

};

exports.onUserMessage = function(chatRoomId, message) {
    const url = 'http://35.197.126.244:8080/kotlin';
    const headers = {
        'Content-Type': 'text/plain'
    };
    request.post({url: url, headers: headers}, function (error, response, body) {
        let messageText = "I couldn't run that!";
        if (!error && response.statusCode == 200) {
            messageText = body;
        }
        let newMessage = {
            isBot: true,
            text: messageText,
            isFirstMessageOfDate: false,
            sendingTime: '2017-09-30T09:47:47.593Z',
            senderId: botId,
            senderName: this.getName()
        };
        return chat.sendMessage(this, chatRoomId, newMessage);
    });
};

exports.onBotMessage = function(chatRoomId, message) {

};
