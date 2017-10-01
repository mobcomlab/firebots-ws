'use strict';

const admin = require('firebase-admin');
const database = admin.database();

const RANGE = 2;

exports.inviteNewRoom = (event) => {
    const roomId = event.params.roomId;
    const room = event.data.val();

    const roomLat = room['lat'];
    const roomLong = room['long'];
    if(!roomLat || !roomLong) {
        return; // No location
    }

    return database.ref('user').once('value').then(function(snapshot) {
        snapshot.forEach(function(userSnapshot) {
            const user = userSnapshot.val();

            const userLat = user['lat'];
            const userLong = user['long'];

            if(userLat && userLong) {
                const distanceFromChat = distanceBetween(roomLat, roomLong, userLat, userLong);
                if(distanceFromChat < RANGE) {
                    sendNotification(user['token'], roomId)
                }
            }
        });
    });
};

exports.inviteNewUser = (event) => {
    const userOld = event.data._data;
    const user = event.data.val();

    const userLat = user['lat'];
    const userLong = user['long'];

    if(!userLat || !userLong) {
        return; // No location
    }

    const userLatOld = userOld['lat'];
    const userLongOld = userOld['long'];

    if(userLatOld && userLongOld && distanceBetween(userLat, userLong, userLatOld, userLongOld) < (RANGE / 2)) {
        return; // Not moved much
    }

    return database.ref('chatroom').once('value').then(function(snapshot) {
        snapshot.forEach(function(roomSnapshot) {
            const roomId = roomSnapshot.key;
            const room = roomSnapshot.val();

            const roomLat = room['lat'];
            const roomLong = room['long'];

            if(roomLat && roomLong) {
                console.log(roomSnapshot.key);
                console.log(roomLat);
                console.log(roomLong);

                const distanceFromChat = distanceBetween(roomLat, roomLong, userLat, userLong);
                if(distanceFromChat < RANGE) {
                    sendNotification(user['token'], roomId)
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
    const payload = {
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