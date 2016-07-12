// ************************************************ //
// Emerging Experiences Slack Bot
//
// This is an R&D bot that lives in the EE Slack team.
// It is used to experiment and learn how bots work,
// how to interact with them, what works and what
// doesn't.
//
// Author: Dirk Songuer (dirk.songuer@razorfish.de)
// ************************************************ //

// include restify server
// this is used to communicate with the ms bot framework middleware
var restify = require('restify');

// include ms botbuilder sdk
// this will provide all functionality around bot workflows
var builder = require('botbuilder');

// include pinboard api
// https://www.npmjs.com/package/node-pinboard
var Pinboard = require('node-pinboard');

// include wikipedia api
// https://www.npmjs.com/package/easypedia
var easypedia = require("easypedia");

// setup restify server
var server = restify.createServer();
server.listen(3798, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// get app id and password from server environment
// this avoids having to store the secret in code
// you can manage it in the Azure dashboard
// in settings -> application settings -> App settings
var connector = new builder.ChatConnector({
    appId: process.env.BOTFRAMEWORK_APP_ID,
    appPassword: process.env.BOTFRAMEWORK_APP_PASSWORD
});

// pinboard credentials, see above
var pinboardApiToken = process.env.PINBOARD_APITOKEN
var pinboard = new Pinboard(pinboardApiToken);

// create a universal bot based on the connector
var bot = new builder.UniversalBot(connector);

// handle bot framework messages
// this is the endpoint you need to define in yout bot settings
server.post('/api/messages', connector.listen());

// this creates a connection to the LUIS app
var recognizer = new builder.LuisRecognizer(process.env.LUIS_APP_URL);

// instead of dialogs, LUIS works with intents
// you define these within your LUIS app, which will then used
// as triggers for your app when LUIS identifies them
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

// bind all dialogs to intents
bot.dialog('/', intents);

// recognised Link intent
// this is trained to listen to all kinds of link requests
// from "link something" to "show me a link about something"
intents.matches('Link', [
    function (session, args, next) {
        // extract entity from intent
        var task = builder.EntityRecognizer.findEntity(args.entities, 'Topic');

        // check if a topic has been identified to link
        if (task.entity) {
            // this will get all bookmarks stored in the pinboard account
            // we also add the tag filter to only receive matching entries
            pinboard.all({ tag: task.entity }, function (err, res) {
                // check if a proper response came back
                if (res) {
                    // check if the response actually contains posts
                    if (res.length > 0) {
                        // storing search term in user data
                        // this contains all search results and is used when the user requests another link from the results
                        session.userData.search = task.entity;

                        // reset current index
                        // this tracks which link the user currently sees
                        session.userData.searchResultIndex = 0;

                        // store complete result list
                        session.userData.searchResultList = res;

                        // responding with first link result
                        resultLink = 'How about ';
                        resultLink += res[0].href + "\n";
                        resultLink += res[0].description + "\n";
                        resultLink += '(' + (session.userData.searchResultIndex + 1) + '/' + session.userData.searchResultList.length + ')';
                        session.send(resultLink);
                    } else {
                        // no links found for topic
                        session.send('Hm, I don\'t think I have any link for that, sorry');
                    }
                } else {
                    // something went wrong
                    session.send('Oh, something went wrong (' + err + ')');
                }
            });
        } else {
            // no entity, hence no topic to search a link for
            session.send("Somehow I didn't get what you are looking for, sorry. Can you please try again?");
        }
    }
]);

// recognised Next intent
// this is trained to listen to all kinds of link requests
// from "link something" to "show me a link about something"
intents.matches('Next', [
    function (session, args, results) {
        if (typeof session.userData.searchResultIndex !== 'undefined') {
            // switch to next result
            if ((session.userData.searchResultIndex + 1) <= session.userData.searchResultList.length) {
                session.userData.searchResultIndex += 1;
            } else {
                session.userData.searchResultIndex = 0;
            }

            // responding with next result
            // this draws the result from the search results cached in the user session
            resultLink = 'How about ';
            resultLink += session.userData.searchResultList[session.userData.searchResultIndex].href + "\n";
            resultLink += session.userData.searchResultList[session.userData.searchResultIndex].description + "\n";
            resultLink += '(' + (session.userData.searchResultIndex + 1) + '/' + session.userData.searchResultList.length + ')';
            session.send(resultLink);
        } else {
            // no result found for index in cache
            session.send("Somehow I didn't get what you are looking for, sorry. Can you please try again?");
        }
    }
]);

// recognised Definition intent
// this is trained to listen to all kinds of definition requests
// from "define something" to "what is something?"
intents.matches('Definition', [
    function (session, args, next) {
        // extract entity from intent
        var task = builder.EntityRecognizer.findEntity(args.entities, 'Topic');

        // check if a topic has been identified to define
        if (task.entity) {
            // this will get info from wikipedia for the given query
            easypedia(task.entity, function (err, res) {
                // check if a proper response came back
                if (res) {
                    // check if the response actually contains posts
                    if (typeof res._text.Intro[0].text !== 'undefined') {
                        // send wikipedia entry
                        session.send(res._text.Intro[0].text);
                    } else {
                        // no definition found for topic
                        session.send('Hm, I don\'t think I have any link for that, sorry');
                    }
                } else {
                    // something went wrong
                    session.send('Oh, something went wrong (' + err + ')');
                }
            });
        } else {
            // no entity, hence no topic to search a link for
            session.send("Somehow I didn't get what you are looking for, sorry. Can you please try again?");
        }
    }
]);

// recognised Salutation intent
// this is trained to listen to all kinds of salutations
// from "hi" to "hello"
intents.matches('Salutation', [
    function (session, args, next) {
        // show a simple answer
        session.send("Oh, hello! Nice to see you!");
    }
]);

// recognised Gratitude intent
// this is trained to listen to all kinds of thank you messages
// from "thanks" to "that was great!"
intents.matches('Gratitude', [
    function (session, args, next) {
        session.send("You're welcome! Glad to be of help.");
    }
]);

// recognised Help intent
// this is trained to listen to all kinds of help requests
// from "help" to "what can you do?"
intents.matches('Help', [
    function (session, args, next) {
        session.send("I can help you define things and get more information about them. For example say 'What is XYZ?' to get a overview of what it is. You can also say 'What do people say about XYZ?' to get some links about the topic.");
    }
]);

// serve a static web page as hello world confirmation
// it also contains a web chat interface to this bot
// note that to use the web chat, you need to add this endpoint
// in the bot framework page and enter your webchat app secret
// in the index.html
server.get(/.*/, restify.serveStatic({
    'directory': '.',
    'default': 'index.html'
}));