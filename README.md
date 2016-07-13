# Emerging Experiences Bot

This is an R&D bot that lives in the Emerging Experiences Slack team. It is used to
experiment and learn how bots work, how to interact with them, what works and what
doesn't.


# Requirements

* Node.js server
* Registered bot: http://www.botframework.com


# How to run locally

* Clone this repo
* Run "npm install" (most importantly botframework and restify)
* Run "node ./server.js"
* Get and run the emulator: http://docs.botframework.com/connector/tools/bot-framework-emulator
* Note that you may deactivate the credentials to avoid setting up HTTPS locally


# Live Infrastructure

## Bot App links:
* The source code lives here: https://github.com/RazorfishGermany/ee-slack-bot
* The bot itself: https://dev.botframework.com/
* The bot is hosted on an Azure web app instance: http://emergingexperiencesbot.azurewebsites.net/

Azure services (including hosting instance, LUIS etc.) are managed by Dirk (dirk.songuer@razorfish.de). Ping me for questions.

## Deployment
* Push changes to https://github.com/RazorfishGermany/ee-slack-bot
* Every change to master will be auto-deployed to the Azure instance

## LUIS app links
* The bot uses a LUIS app to analyse the input: https://www.luis.ai/
