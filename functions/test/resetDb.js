'use strict';

exports.resetDb = (event) => {
    const database = require('firebase-admin').database();

    database.ref('chatroom').remove((error) => {
        if(error != null) {
            console.log(error);
        } else {
            console.log("Database reset");
        }
    });
};