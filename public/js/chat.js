var username = document.getElementById('username');
var noMessage = document.getElementById('no_message');
var chat = document.getElementById('chat');
var message = {};
var userID;
var name;
var chatID;

function observeUser() {
    var unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userID = user.uid;
            var userRef = firebase.database().ref().child('user').child(userID);
            userRef.once('value').then(function (snapshot)  {
                var  isUser = snapshot.val();
                name = isUser['username'];
                username.innerHTML = name;
                dismissIndicator();
            });
        } else {
            signOutPressed();
            unsubscribe();
        }
    });
}

function observeMessage(chatroomID) {
    chatID = chatroomID;
    var messageRef = firebase.database().ref('chatroom').child(chatID).child('message');
    messageRef.on('child_added', function (snapshot) {
        var message = snapshot.val();
        noMessage.classList.add('hidden');
        if(message['senderId'] !== userID){
            setupInMessage(message);
        }else {
            setupOutMessage(message);
        }
        window.scrollTo(0,document.body.scrollHeight);
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
    var li = document.createElement('li');
    var msg = document.createElement('div');
    var text = document.createElement('p');
    var time = document.createElement('time');
    li.classList.add('self');
    msg.classList.add('msg');

    text.innerHTML = message['text'];

    msg.appendChild(text);
    li.appendChild(msg);
    chat.appendChild(li);
}

function sendMessage() {
    var text = document.getElementById('text_input');
    var date = new Date();
    var dateISO = date.toISOString();
    message['isBot'] = false;
    message['senderId'] = userID;
    message['senderName'] = name;
    message['sendingTime'] = dateISO;
    message['text'] = text.value;
    var messageID = firebase.database().ref().child('chatroom').child(chatID).child('message').push().key;
    firebase.database().ref().child('chatroom').child(chatID).child('message').child(messageID).update(message).then(function () {
        if(text !== null){
            text.value = '';
        }
        window.scrollTo(0,document.body.scrollHeight);
    });
}
