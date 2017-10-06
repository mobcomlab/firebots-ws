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

function observeChatrooms() {
    firebase.database().ref().child('chatroom').on('child_added', function(data) {
        $('#chat-room-list').append('<li id="'+data.key+'"><a class="button" href="chat.html?chatroomID='+data.key+'">'+data.val().name+'</a></li>');
    });
    firebase.database().ref().child('chatroom').on('child_removed', function(data) {
        $('#'+data.key).remove();
    });
}

function startChatGeo() {
    var chatroomName = $('#chatroomName').val();

    var chatroomUser = {};
    chatroomUser[userID] = true;
    chatroom['lat'] = user['lat'];
    chatroom['long'] = user['long'];
    chatroom['user'] = chatroomUser;
    chatroom['name'] = chatroomName;

    var chatroomID = firebase.database().ref().child('chatroom').push().key;
    firebase.database().ref().child('chatroom').child(chatroomID).update(chatroom).then(function () {
        window.location = "chat.html?chatroomID=" + chatroomID;
    });
}