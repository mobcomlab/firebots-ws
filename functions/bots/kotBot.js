'use strict';

const admin = require('firebase-admin');
const database = admin.database();

const request = require('request');
const chat = require('../firebots/chatInterface');

const lineBreak = "\r\n";
const botId = '2';

exports.getName = function() {
    return "KotBot";
};

exports.onUserJoined = function(chatRoomId, user) {

};

exports.onBotJoined = function(chatRoomId, user) {

};

exports.onUserMessage = function(chatRoomId, message) {
    const url = 'http://35.197.126.244:8080/kotlin';
    const headers = {
        'Content-Type': 'text/plain'
    };

    const input = message['text'];
    if(input.startsWith("!k")) {
        const command = input.substring(2);

        // Prepend history of commands
        var completeCommand = "";
        const kotBotHist = database.ref('chatroom').child(chatRoomId).child('bots').child('kotbot');

        kotBotHist.child('imports').orderByChild('seq').once('value').then((imports) => {
                imports.forEach((importSnapshot) => {
                    const importNode = importSnapshot.val();

                    if(importNode['command']) {
                        completeCommand += (lineBreak + importNode['command']);
                    }
                });
            }
        ).then(kotBotHist.child('commands').orderByChild('seq').once('value').then((commands) => {
                commands.forEach((commandSnapshot) => {
                    const commandNode = commandSnapshot.val();

                    if(commandNode['command']) {
                        completeCommand += (lineBreak + commandNode['command']);
                    }
                });
            }
        ).then(() => {
                completeCommand += (lineBreak + command);
                completeCommand = completeCommand.trim();
                console.log("Kotlin Executing: " + completeCommand);

                request.post({url: url, headers: headers, body: completeCommand}, function(error, response, body) {
                    let messageText = "I couldn't run that!";
                    if(!error && response.statusCode == 200) {
                        messageText = body;

                        const commandLines = command.split(["\r\n", "\n\r", "\r", "\n"]);
                        commandLines.forEach((t) => {
                            const toSave = t.trim();

                            if(toSave === "" || toSave.startsWith("print")) {
                                // Ignore
                            }
                            else if(toSave.startsWith("import")) {
                                let history = {
                                    seq: new Date().toISOString(),
                                    command: toSave
                                };

                                database.ref('chatroom').child(chatRoomId).child('bots').child('kotbot').child('imports').push().set(history);
                            } else {
                                let history = {
                                    seq: new Date().toISOString(),
                                    command: toSave
                                };

                                database.ref('chatroom').child(chatRoomId).child('bots').child('kotbot').child('commands').push().set(history);
                            }
                        });
                    }

                    if(messageText === "") { messageText = "done"; }
                    console.log("Kotlin Result: " + messageText);
                    let newMessage = {
                        isBot: true,
                        text: messageText,
                        isFirstMessageOfDate: false,
                        sendingTime: new Date().toISOString(),
                        senderId: botId,
                        senderName: "KotBot"
                    };
                    return chat.sendMessage(this, chatRoomId, newMessage);
                })
            }
        ));
    }
};

exports.onBotMessage = function(chatRoomId, message) {

};
