'use strict';

const admin = require('firebase-admin');

const RANGE = 2;

exports.invite = (event) => {
    const database = admin.database();
    const chatroom = event.data.val();
    const chatroomID = event.params.roomId;

    const locationLong = chatroom['long'];
    const locationLat = chatroom['lat'];

    return database.ref('user').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();

            //console.log(childKey);
            //console.log(childData);

            if(childData['lat'] && childData['long']) {
                const distanceFromChat = distanceBetween(locationLat, locationLong, childData['lat'], childData['long']);
                if(distanceFromChat < RANGE) {
                    // SEND NOTIFICATION INVITING TO CHAT
                    sendNotification(childData['token'], chatroomID)
                }
            }
        });
    });
};

const R = 6371; // Radius of the earth in km

const deg2rad = function(deg) {
    return deg * (Math.PI / 180)
};

const distanceBetween = function(lat1, long1, lat2, long2) {
    // Haversine (https://stackoverflow.com/questions/27928)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(long2 - long1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
};

function sendNotification(registrationToken, chatroomID) {
    var payload = {
        notification: {
            title: "You have invitation to chatroom.",
            body: "You want to join this chatroom?",
            badge: "0",
            click_action: "https://firebots.mobcomlab.com/chat.html?chatroomID=" + chatroomID
        },
        data: {
            type: 'chatroomInvitation',
            chatroomID: chatroomID,
            badge: "0"
        }
    };

    admin.messaging().sendToDevice(registrationToken, payload)
        .then(function(response) {
            console.log('Successfully sent message:', response);
        })
        .catch(function(error) {
            console.log('Error sending message:', error);
        });
}