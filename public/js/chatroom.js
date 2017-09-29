var username = document.getElementById('username');
function observeUser(uid) {
    var userRef = firebase.database().ref('user').child(uid);
   userRef.once('value').then(function (snapshot) {
       var user = snapshot.val();
       username.innerHTML = user['username'];
       dismissIndicator();
   });
}