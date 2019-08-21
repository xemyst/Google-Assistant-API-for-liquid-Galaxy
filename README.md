# Google Assistant API for Liquid-Galaxy

![npm](https://img.shields.io/npm/dm/google-assistant-api-for-liquid-galaxy.svg)
![NPM](https://img.shields.io/npm/l/google-assistant-api-for-liquid-galaxy.svg)
![GitHub stars](https://img.shields.io/github/stars/xemyst/Google-Assistant-API-for-liquid-Galaxy.svg?style=social)

----

**GSOC 2019 project**

Requirements:
* [Ngrok](https://ngrok.com/) to connect the dialog flow to the webhook
* [KML API for liquid galaxy](https://github.com/LiquidGalaxyLAB/liquid-galaxy-kml-uploader), configured and working


## Installation guide (NGROK)

The server needs to be configured on the **Liquig Galaxy MASTER**

## Instructions

### IN THE COMPUTER
clone the repository and get into, then install all npm dependencies.
```sh
git clone https://github.com/xemyst/Google-Assistant-API-for-liquid-Galaxy
cd Google-Assistant-API-for-liquid-Galaxy
npm install
```

create the .env variable:
```sh
touch .env
```
and set the following variables:
```sh
LG_OCTET= 'the octet of the galaxy network'
VIEWSYNC_PORT= 'viewsync network port, it use to be 45678'
PORT=' the port where you want to run your api'
KMLSERVERADRESS='the address (ip + port) of the machines who runs the KML API SERVER  '
```

now you can run the webhook:
```sh
node index.js
```
Now open the ngrok:

```sh
ngrok http "the webhook port"
```

Ngrok will show you a black screen with the url of your current session, save the https link, you will need it for the next steps


### IN THE DIALOGFLOW UI

1. create new project in the dialog flow console.
1. Go to: setting -> Export and Import

In the folder where you clone the repository you will find a folder called "DIALOG FLOW PROJECT", get into.

There you will find a zip file called Liquid-Galaxy.zip

3. Upload the zip file into the UI by doing click in **IMPORT FROM ZIP**

1. Go to the fullfillment window
1. in the URL field paste the ngrok link, and add '/assistant' like that:
```sh
https://f47fa87c.ngrok.io/assistant
```
1. click in the save button
1. **ENJOY THE API:)**
