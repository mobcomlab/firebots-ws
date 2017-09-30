const admin = require('firebase-admin'); // The Firebase Admin SDK to access the Firebase Realtime Database.

// Setup database
const database = admin.database();

exports.chatroomMessageCreatedHandler = (event) => {
    const messageID = event.params.pushId;
    const message = event.data.val();

    if (!message['isBot']) {
        let newMessage = {
            isBot: true,
            text: 'Hello '+message['senderName']+'.',
            isFirstMessageOfDate: false,
            sendingTime: '2017-09-30T09:47:47.593Z',
            senderId: 'FireBots',
            senderName: 'FireBots'
        };

        database.ref('chatroom').child('message').push().set(newMessage);
    }
};