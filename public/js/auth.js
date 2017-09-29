var users = {};
function login() {
    //var form = document.getElementById('login-form');
    var username = document.getElementById('username');

    if (username === ''){
        swal({
            title: "Please enter a Username.",
            confirmButtonText: "OK",
            confirmButtonColor: "#f47f7f"
        });
    }else {
        showIndicator();
        firebase.auth().signInAnonymously().catch(function(error) {
            // Handle Errors here.
            //var errorCode = error.code;
            var errorMessage = error.message;
            swal({
                title: errorMessage,
                message: errorMessage,
                confirmButtonText: "OK",
                confirmButtonColor: "#f47f7f"
            });
        });
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                var uid = user.uid;
                // ...
                users['username'] = username.value;
                firebase.database().ref('user').child(uid).update(users).then(function () {
                    window.location = 'chatroom.html?userID=' + uid ;
                });

            } else {
                // User is signed out.
                // ...
            }
            // ...
        });
    }
}