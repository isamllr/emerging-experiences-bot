# Emerging Experiences Bot

This is an R&D bot that lives in the Emerging Experiences Slack team. It is used to
experiment and learn how bots work, how to interact with them, what works and what
doesn't.


# Requirements

* Node.js server
* Registered bot: http://www.botframework.com


# Live Infrastructure

* The source code lives here: https://github.com/RazorfishGermany/ee-slack-bot
* The registered bot within the bot framework: https://dev.botframework.com/bots?id=ee_slack_bot
* The bot is hosted on an Azure web app instance: http://emergingexperiencesbot.azurewebsites.net/
* Every check-in to the master branch will auto-deploy to Azure.
* It uses a LUIS app to analyse the input: https://www.luis.ai/application/655a8e18-820b-4eef-ba9f-b8f12692db51

Azure services (including hosting instance, LUIS etc.) are managed by Dirk (dirk.songuer@razorfish.de).


# How to create a bot in Node.js

* Get a server for your bot web service, for example create an web app in the Azure portal (https://portal.azure.com/): New -> Web + Mobile -> Web App
* Clone this repo or read here to get a basic bot template: http://docs.botframework.com/connector/libraries/node/#navtitle
* "npm install" :)
* Upload your repo to the server to run it, for example connect your Azure web app with this repo
* Register your bot here: https://dev.botframework.com/, enter the https-address of your server instance + "/api/messages" as endpoint
* Add channels to your bot by following the instructions on your bot configuration page
* Get the emulator to develop / test locally: http://docs.botframework.com/connector/tools/bot-framework-emulator/#navtitle
* Write logic, add services


# How to LUIS

* Create a new LUIS app here: https://www.luis.ai/applicationlist
* Add intents (actions that your bot should be able to identify)
* Add entities (parameters contained in an intent that should be extracted if an intent was identified)
* Train by adding utterances (essentially just write stuff), select the respective intent the utterance matches to, mark the entities contained
* Eventually publish when you have reached a good confidence level, note the URL where to reach your LUIS app


# Helpful links:

* https://blogs.msdn.microsoft.com/uk_faculty_connection/2016/04/05/what-is-microsoft-bot-framework-overview/
* http://docs.botframework.com/
* http://docs.botframework.com/builder/node/guides/core-concepts/#navtitle
* http://docs.botframework.com/builder/node/guides/deploying-to-azure/
* https://github.com/fuselabs/echobot
