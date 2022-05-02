# Discord SOSBot

An SOSbot that allows people to add SOS lines for rapid deployment to warzones and dangerous areas through the discord.

## Setup

Make sure to clone the repository into your machine.

After having the repo on the machine run the command:
```
npm i
npm start
```
This will start the server and allow you to call using your twilio number. 

Before you can get people calling you will need a number from twilio. I recommend setting up the twilio-cli globally on your machine but you don't need to if you have installed this repository as it comes installed here. 

if you have it installed globally don't prefix commands below with npx otherwise you can follow along just fine. 

```
npx twilio login
```

At this point put in your twilio credentials you should see them when you login. You will need a SID, an Auth Token, and a alias to call this login something (you can call it anything i choose woody for mine).

```
npx twilio profiles:use [insert account name here]
```

🎉 Congrats! 🎉 you have your twilio account setup. Now for the next part:

```
npx twilio phone-numbers:list
```

This will give you a list of your current numbers through twilio. If you do not have anything listed here you will need to buy
