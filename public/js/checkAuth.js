function checkAuth() {
    var unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user.uid)
        } else {
            signOut();
            unsubscribe();
        }
    });
}

function signOut() {
    firebase.auth().signOut();
    var url = new URL(window.location.href);
    window.location = "auth.html";
}

function signOutPressed() {
    var user = firebase.auth().currentUser;
    firebase.database().ref('user').child(user.uid).set(null);
    user.delete().then(function() {
        // User deleted.
        firebase.auth().signOut();
        window.location = "auth.html";
    }).catch(function(error) {
        // An error happened.
    });
}

$(function(){
    $(".heading-compose").click(function() {
        $(".side-two").css({
            "left": "0"
        });
    });

    $(".newMessage-back").click(function() {
        $(".side-two").css({
            "left": "-100%"
        });
    });
})