var users = {};
var lat = 0;
var long = 0;
var token;
var userID;

function login() {
    var username = $('#username');
    if(username.value === '') {
        swal({
            title: "Please enter a Username.",
            confirmButtonText: "OK",
            confirmButtonColor: "#f47f7f"
        });
    }
    else {
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
            if(user) {
                // User is signed in.
                userID = user.uid;
                const messaging = firebase.messaging();

                // ...
                messaging.requestPermission()
                    .then(function() {
                        console.log('Notification permission granted.');
                        // TODO(developer): Retrieve an Instance ID token for use with FCM.
                        messaging.getToken()
                            .then(function(currentToken) {
                                if(currentToken) {
                                    console.log(currentToken);
                                    token = currentToken;
                                    getLocation();
                                } else {
                                    // Show permission request.
                                    console.log('No Instance ID token available. Request permission to generate one.');
                                    // Show permission UI.
                                    messaging.requestPermission();
                                }
                            })
                            .catch(function(err) {
                                console.log('An error occurred while retrieving token. ', err);
                                showToken('Error retrieving Instance ID token. ', err);
                            });
                    })
                    .catch(function(err) {
                        console.log('Unable to get permission to notify.', err);
                    });
            } else {
                // User is signed out.
                // ...
            }
            // ...
        });
    }
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    if(token !== undefined) {
        users['username'] = username.value;
        users['token'] = token;
        users['lat'] = position.coords.latitude;
        users['long'] = position.coords.longitude;
        firebase.database().ref('user').child(userID).update(users).then(function() {
            window.location = 'waitingroom.html?userID=' + userID;
        });
    }
}