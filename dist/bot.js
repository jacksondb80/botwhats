"use strict";Object.defineProperty(exports, "__esModule", {value: true});const venom = require('venom-bot');


 class Bot{

   static async cria(sessionName){

        Bot.qrcode = false;

        const client = await venom
            .create(sessionName,
                (base64Qrimg, asciiQR, attempts, urlCode) => {
                    //console.log('Number of attempts to read the qrcode: ', attempts);
                    //console.log('Terminal qrcode: ', asciiQR);
                    //console.log('base64 image string qrcode: ', base64Qrimg);
                    //console.log('urlCode (data-ref): ', urlCode);
                    Bot.qrcode = base64Qrimg;
                },
                (statusSession, session) => {
                    console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
                    //Create session wss return "serverClose" case server for close
                    console.log('Session name: ', session);
                },
                {
                    headless: true,
                    devtools: false,
                    useChrome: true,
                    debug: false,
                    logQR: false,
                    refreshQR: 15000,
                    autoClose: 60 * 60 * 24 * 365, //never
                    disableSpins: true
                },
            )
            .then((client) => {

            let time = 0;
            client.onStreamChange((state) => {
                console.log('Connection statusx: ', state);
                console.log('aqui');
                //clearTimeout(time);
                if(state == 'CONNECTED'){
                    console.log('aquix');
                    Bot.start(client);
                }

            })
            .catch((erro) => {
                console.log('There was an error in the bot',erro);
            });
        });

    }

    static async start(client) {
        console.log('aqui chegou');
        var inchat = await client.isInsideChat(); //wait until the page is in whatsapp chat
        console.log(inchat);
        if (inchat) {
          client.onMessage((message) => {
            console.log(message.body);
            if (message.isGroupMsg === false) {
              Bot.validaMsg(client,message);
            }
          });
        }
      }

      static async validaMsg(client,message){
        if (message.body === 'Hi' && message.isGroupMsg === false) {
            client
              .sendText(message.from, 'Welcome JDB 🕷')
              .then((result) => {
                console.log('Result: ', result); //return object success
              })
              .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
              });
          }
      }







}
exports. default = Bot;

