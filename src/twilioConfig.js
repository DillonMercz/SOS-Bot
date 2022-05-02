require('dotenv').config;
const email = process.env.TWILIO_EMAIL
const twilioPass = process.env.TWILIO_PASS
const twilioToken = process.env.TWILIO_AUTH_TOKEN
const twilioSid = process.env.TWILIO_ACCOUNT_SID
const twilioNumber = process.env.TWILIO_NUMBER

module.exports = {
  email, twilioPass, twilioNumber,
  twilioSid, twilioToken,
}