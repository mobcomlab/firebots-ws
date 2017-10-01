'use strict';

// const chat = require('chatInterface');

const bots = {
    welcome: require('../bots/welcomeBot')
   // kotlin: require('../bots/kotBot')
};

exports.newMessage = (event) => {
    const chatRoomId = event.params.roomId;
    const message = event.data.val();

    Object.keys(bots).forEach(key => {
        const bot = bots[key];

        if(message['isBot']) {
            console.log('New BOT message');
            return bot.receiveBotMessage(chatRoomId, message);
        } else {
            console.log('New USER message');
            return bot.receiveUserMessage(chatRoomId, message);
        }
    })

};