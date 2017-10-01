const admin = require('firebase-admin');
const database = admin.database();

exports.sendMessage = function(bot, chatRoomId, message) {
    console.log("Sending message");
    console.log(chatRoomId);

    return database.ref('chatroom').child(chatRoomId).child('message')
        .push().set(message)
        .then(() => {
            console.log('Sent message');
        });
};

exports.requestModal = function(bot, chatRoomId) {

};