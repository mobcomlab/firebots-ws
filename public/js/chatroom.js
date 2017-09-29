var username = document.getElementById('username');
var noMessage = document.getElementById('no_message');
var chat = document.getElementById('chat');

function observeUser(uid) {
    var userRef = firebase.database().ref('user').child(uid);
       userRef.once('value').then(function (snapshot) {
           var user = snapshot.val();
           username.innerHTML = user['username'];
           observeMessage(uid);
       });
}

function observeMessage(uid) {
    var messageRef = firebase.database().ref('chatroom').child('message');
    messageRef.on('child_added', function (snapshot) {
        var message = snapshot.val();
        noMessage.classList.add('hidden');
        if(message['senderId'] !== uid){
            setupInMessage(message);
        }else {
            setupOutMessage(message);
        }
        dismissIndicator();
    });
}

function setupInMessage(message) {
    var li = document.createElement('li');
    var sender = document.createElement('div');
    var msg = document.createElement('div');
    var text = document.createElement('p');
    var time = document.createElement('time');
    li.classList.add('other');
    sender.classList.add('sender');
    msg.classList.add('msg');

    sender.innerHTML = message['senderName'];
    text.innerHTML = message['text'];

    msg.appendChild(text);
    li.appendChild(sender);
    li.appendChild(msg);
    chat.appendChild(li);
}

function setupOutMessage(message) {

}

