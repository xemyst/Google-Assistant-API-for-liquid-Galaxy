const {dialogflow, SimpleResponse} = require('actions-on-google')
const express = require('express')
const bodyParser = require('body-parser')
const { exec } = require('child_process');
const app = dialogflow()

app.intent('Fly',function(conv){
  console.log(conv.parameters)
  location = "search="+conv.parameters['geo-city']
  response = new SimpleResponse({
    text: "flying to " + conv.parameters['geo-city'],
    speach: "flying to " + conv.parameters['geo-city']
  })
  conv.ask( response )
})

app.intent('Find a plane',function(req,res){
  console.log(req.parameters)
})

const expressApp = express().use(bodyParser.json())
expressApp.post('/', app)
expressApp.listen(8080)
