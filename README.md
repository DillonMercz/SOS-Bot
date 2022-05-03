# Discord SOSBot

An SOSbot that allows people to add SOS lines for rapid deployment to warzones and dangerous areas through the discord.

## Setup

Make sure to clone the repository into your machine.

After having the repo on the machine run the command:
```
npm i
npm start
```

### Twilio Setup
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

This will give you a list of your current numbers through twilio. If you do not have anything listed here you will need to buy a phone number with the command:

```
npx twilio phone-numbers:buy
```

Follow the instructions from there. You can always refer to this if you want to buy more numbers if you already have one.
### Ngrok Setup

You will need to install and start an Ngrok tunnel for twilio to have a public address to call into. This is rather simple. 

Ngrok provides easy installation instructions on their site [here](https://ngrok.com/download).

After installing Ngrok, you will need to start a tunnel to do that simply run the command

```
ngrok http [use the same port that your server is listening]
```

The ngrok default is port 80 which is also present on their site if you scroll down.
Add your authtoken

```
npx twilio phone-numbers:update $TWILIO_NUMBER --voice-url [insert the ngrok tunnel link here]
```



