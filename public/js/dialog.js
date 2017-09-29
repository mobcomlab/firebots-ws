function showOkAlert(title, text) {
    swal({
        title: title,
        text: text,
        confirmButtonText: "OK",
        confirmButtonColor: "#4285F4"
    });
}

// function showAlert(title, text, buttonText) {
//     swal({
//         title: title,
//         text: text,
//         confirmButtonText: buttonText,
//         confirmButtonColor: "#4285F4"
//     });
// }
//
// function showYesNoAlert(title) {
//     swal({
//         title: title,
//         confirmButtonText: "OK",
//         confirmButtonColor: "#4285F4"
//     });
// }

function showIndicator() {
    swal({
        title: "",
        text: "<div style='display: inline-flex;'><div class='loader'></div><h2 style='margin-left: 25px'>Loading...</h2></div>",
        html: true,
        customClass: 'loader_swal',
        showConfirmButton: false
    });
}

function dismissIndicator() {
    swal.close();
}

function showStorageErrorAlert(title, error) {
    switch (error.code) {
    case 'storage/unauthorized':
        showOkAlert(title, 'User doesn\'t have permission to access the object');
        // User doesn't have permission to access the object
        break;
    case 'storage/canceled':
        showOkAlert(title, 'User canceled the upload');
        // User canceled the upload
        break;
    case 'storage/unknown':
        showOkAlert(title, 'Unknown error occurred, inspect error.serverResponse');
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
}



