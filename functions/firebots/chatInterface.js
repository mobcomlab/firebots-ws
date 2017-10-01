const admin = require('firebase-admin');
const database = admin.database();

exports.sendMessage = function(bot, chatRoomId, message) {
    return database.ref('chatroom').child(chatRoomId).child('message')
        .push().set(message);
};