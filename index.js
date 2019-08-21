// load env vars
require('dotenv').config()
var fs = require('fs')
const Client = require('ssh2').Client
const {dialogflow, SimpleResponse, RichResponse} = require('actions-on-google')
const express = require('express')
const bodyParser = require('body-parser')
const { exec } = require('child_process');
const app = dialogflow()
const port = process.env.PORT || 8081
const dgram = require('dgram')
const axios = require('axios')
var FormData = require('form-data')

const url = 'http://820f9728.ngrok.io'

var orbitUrl = process.env.KMLSERVERADRESS + '/kml/builder/orbit'
directions = {'left': [0,-1], 'right': [0,1] ,'south': [1,1] ,'north': [1,-1], 'zoom in': [2,1],'zoom out': [2,-1]}

function moveSpacenavigator(direction){
  var command = './controler/write-event /dev/input/spacenavigator ' + directions[direction][0] + " " + (100*directions[direction][1])
  exec(command, function callback(error, stdout, stderr){
    console.log(stdout,stderr)
  })
}



var sock = dgram.createSocket('udp4')

var lgPosition = { lat:'41.56',lon:'0.59',alt:'10000'}
// get location data of liquid Galaxy
LG_BROADCAST_IP   = "10.42." + process.env.LG_OCTET + ".255"
LG_BROADCAST_PORT = process.env.VIEWSYNC_PORT

console.log(LG_BROADCAST_IP,LG_BROADCAST_PORT)

sock.on('listening', function () {
    var address = {address: LG_BROADCAST_IP, port: LG_BROADCAST_PORT};
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    sock.setBroadcast(true);
});
sock.on('message', function (message, rinfo) {
    message = message.toString().split(',');
    lgPosition['lat']   = message[1]
    lgPosition['lon']   = message[2]
    lgPosition['alt']   = message[3]
    lgPosition['yaw']   = message[4]
    lgPosition['pitch'] = message[5]
});

function playOrbit(){
  var command = ('python3 ./pyApiCaller.py assistant ' + lgPosition['lon']  + " " + lgPosition['lat'] + " " + lgPosition['alt'])
  exec(command, function callback(error, stdout, stderr){
    console.log(stdout,stderr)
  })
}

sock.bind(LG_BROADCAST_PORT)

app.intent('FlySensors', (conv) => {

  console.log(conv.parameters['sensor'])
  process.env.sensor = conv.parameters['sensor']
  console.log('Env name:', process.env.sensor);

  axios.post(url + '/assistant/move', { name: conv.parameters['sensor'] })
    .then(r => {
      axios.post(url + '/assistant/opensite', { name: process.env.sensor })
      .then(r=>{
        axios.post(url+'/assistant/openballon',{name:process.env.sensor})
      })
    })
  conv.ask('ok flying to ' + conv.parameters['sensor'] + ' sensor')
})

app.intent('closesite', (conv) => {
  axios.post(url + '/assistant/closeite')
  conv.ask('Okay closing site')
})

app.intent('openballon',(conv)=>{
  axios.post(url+'/assistant/openballon',{name:process.env.sensor})
  conv.ask('opening ballon')
})

app.intent('closeballon',(conv)=>{
  axios.post(url+'/assistant/closeballon',{name:process.env.sensor})
  conv.ask('Closing ballon')
})

app.intent('openLiquidSensors', (conv) => {
  console.log("here");

  var conn = new Client();
  conn.on('error', (e) => {
    console.log(e)
  })
  conn.on('ready', function () {
    conn.exec("pm2 start 0", function (err, stream) {
      if (err) throw err;
      stream.on('close', function (code, signal) {
        conn.end();
        return
      }).on('data', function (data) {
        console.log(data);
      }).stderr.on('data', function (data) {
      });
    });
  }).connect({
    host: '192.168.0.191',
    port: 1337,
    username: 'renato',
    password: '27011'
  });
  conv.ask('ok ')
})

app.intent('DateSpan', (conv) => {
  console.log(conv.parameters['datespan'])
  var dates = ['1d', '1w', '1m', '1y']
  var speak = conv.parameters['datespan']
  if (conv.parameters['datespan'] == 'day') {
    conv.parameters['datespan'] = dates[0]
  }
  else if (conv.parameters['datespan'] == 'week') {
    conv.parameters['datespan'] = dates[1]
  }
  else if (conv.parameters['datespan'] == 'month') {
    conv.parameters['datespan'] = dates[2]

  }
  else {
    conv.parameters['datespan'] = dates[3]
  }
  console.log(conv.parameters['datespan'])
  axios.post(url + '/assistant/datespan', { name: process.env.sensor, datespan: conv.parameters['datespan'] })
  conv.ask('ok showing ' + speak + ' data')
})

app.intent('Stop',function(conv){
  response = new SimpleResponse({
    text: "okey! done! tell me if you want to move the Liquid Galaxy again!",
    speech: "okey! done! tell me if you want to move the Liquid Galaxy again!"
  })
  conv.ask(response)
})



app.intent('Fly',function(conv){
  console.log(conv.parameters)
  if(conv.parameters['geo-city'] == "" && conv.parameters['geo-country'] == ""){
    response = new SimpleResponse({
      text: "Sorry I don't know that place",
      speech: "Sorry I don't know that place"
    })
  }else{
    var text = 'search=' + (conv.parameters['geo-city'] || conv.parameters['geo-country'])
    fs.writeFile('/tmp/query.txt', text,function(err){
      console.log(err)
    })
    response = new SimpleResponse({
      text: "flying to " + conv.parameters['geo-city'],
      speech: "flying to " + conv.parameters['geo-city']
    })

  }
  conv.ask( response )
})

app.intent('Run demos',(conv)=>{
  console.log(conv.parameters)
  response = new SimpleResponse({
    text: "runing demo...",
    speech: "runing demo..."
  })
  var command = 'python3 launchDemos.py ' +  conv.parameters.person
  exec(command, function callback(error, stdout, stderr){
    console.log(stdout,stderr)
  })
  conv.ask(response)
})

app.intent('Find a plane',(conv)=>{
  console.log(conv.parameters)
  response = new SimpleResponse({
    text: "showing...",
    speech: "showing..."
  })
  if(conv.parameters['Company'] != ''){
    var command = 'python3 airmashup.py airline ' + conv.parameters['Company']
    exec(command, function callback(error, stdout, stderr){
      console.log(stdout,stderr)
    })
  }else if(conv.parameters['wing'] != ''){
    var command = 'python3 airmashup.py wing '
    exec(command, function callback(error, stdout, stderr){
      console.log(stdout,stderr)
    })
  }else if(conv.parameters['all'] != ''){
    var command = 'python3 airmashup.py all '
    exec(command, function callback(error, stdout, stderr){
      console.log(stdout,stderr)
    })
  }else if(conv.parameters['any'] != ''){
    var command = 'python3 airmashup.py callsign ' + conv.parameters.any
    exec(command, function callback(error, stdout, stderr){
      console.log(stdout,stderr)
    })
  }
  conv.ask(response)
})

app.intent('Where',function(conv){
  console.log(conv.parameters)
  var url = 'https://api.opencagedata.com/geocode/v1/json?q='+lgPosition['lat']+','+lgPosition['lon']+'&key=' + process.env.OPENCAGE_API_KEY
  return axios.get(url)

  .then(function(res){
    var data = res.data.results[0].geometry
    response = new SimpleResponse({
      text: "you are in: " + res.data.results[0].formatted, //+ data.time_zone[0].localtime.split(' ')[1],
      speech:"you are in: " + res.data.results[0].formatted //+ data.time_zone[0].localtime
    })
    conv.ask( response )
  })
  .catch(function(err){
    console.log(err)
  })
})

app.intent('Weather',function(conv){
  var url = 'http://api.worldweatheronline.com/premium/v1/past-weather.ashx?q=' + lgPosition['lat'] + ','+lgPosition['lon'] +'&format=json&key=' + process.env.TIME_EGG_KEY
  console.log('yep')
  return axios.get(url)
  .then(function(res){
    var data = res.data.data.weather[0]
    response = new SimpleResponse({
      text: "here it's: " + data.avgtempC  + ' celsius',
      speech:"here it's " + data.avgtempC + ' celsius'
    })
    conv.ask(response)
  })
  .catch(function(err){
    console.log(err)
  })

})

app.intent('Time',function(conv){
  console.log(conv.parameters)

  var url = 'https://api.worldweatheronline.com/premium/v1/tz.ashx/?q=' + lgPosition['lat']+','+lgPosition['lon'] + '&format=json&key=' + process.env.TIME_EGG_KEY
    return axios.get(url)
    .then(function(res){
      console.log(res)
      var data = res.data.data
      response = new SimpleResponse({
        text: "your hour is: " + data.time_zone[0].localtime.split(' ')[1],
        speech:"your hour is: " + data.time_zone[0].localtime.split(' ')[1]
      })
      conv.ask(response)
    })
    .catch(function(err){
      console.log(err)
    })

})

const expressApp = express().use(bodyParser.json())



app.intent('Movements',function(conv){
  response = new SimpleResponse({
  speech: "Going " + conv.parameters['directions'],
  text: "Going " + conv.parameters['directions']
})
  if(conv.parameters['directions'] == 'orbit'){
    console.log('data')
    var bodyFormData = new FormData()
    bodyFormData.append('id','orbit')
    bodyFormData.append('name','orbit')
    bodyFormData.append('longitude',lgPosition['lon'])
    bodyFormData.append('latitude',lgPosition['lat'])
    bodyFormData.append('range',lgPosition['alt'])
    console.log(orbitUrl)
    playOrbit()
      conv.ask(response)



    }else{
    moveSpacenavigator(conv.parameters['directions'])
      conv.ask(response)
  }
})


expressApp.post('/assistant', app)

expressApp.listen(port,function(){
  console.log(port, "linstening")
})
