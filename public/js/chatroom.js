var username = document.getElementById('username');
var userID;
var user;
var chatroom = {};
function observeUser(uid) {
    userID = uid;
    var userRef = firebase.database().ref('user').child(userID);
       userRef.once('value').then(function (snapshot) {
           user = snapshot.val();
           dismissIndicator();
       });
}

function startChatGeo() {
    var chatroomUser = {};
    chatroomUser[userID] = true;
    chatroom['lat'] = user['lat'];
    chatroom['long'] = user['long'];
    chatroom['user'] = chatroomUser;
    var chatroomID = firebase.database().ref().child('chatroom').push().key;
    firebase.database().ref().child('chatroom').child(chatroomID).update(chatroom).then(function () {
        window.location = "chat.html?chatroomID=" + chatroomID;
    });
}