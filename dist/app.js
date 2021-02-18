"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _routes = require('./routes'); var _routes2 = _interopRequireDefault(_routes);
var _bot = require('./bot'); var _bot2 = _interopRequireDefault(_bot);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
const venom = require('venom-bot');

class App {

    constructor() {
        this.server = _express2.default.call(void 0, );

        this.middlewares();
        this.routes();
        //this.cria();
        this.bots();
    }

    middlewares() {
        this.server.use(_cors2.default.call(void 0, ));
        this.server.use(_express2.default.json());
    }

    routes() {
        this.server.use(_routes2.default);
    }

    bots() {
        _bot2.default.cria('sessao1');
    }

    cria(){
        venom
            .create('session1',
                (base64Qrimg, asciiQR, attempts, urlCode) => {
                    console.log('Number of attempts to read the qrcode: ', attempts);
                    console.log('Terminal qrcode: ', asciiQR);
                    console.log('base64 image string qrcode: ', base64Qrimg);
                    console.log('urlCode (data-ref): ', urlCode);
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
                    logQR: true,
                    refreshQR: 15000,
                    autoClose: 60 * 60 * 24 * 365, //never
                    disableSpins: true
                },
            )
            .then((client) => {

            let time = 0;
            client.onStreamChange((state) => {
                console.log('Connection status: ', state);
                clearTimeout(time);
                if(state === 'CONNECTED'){
                start(client);
                }
            //  DISCONNECTED when the mobile device is disconnected
                if (state === 'DISCONNECTED' || state === 'SYNCING') {
                time = setTimeout(() => {
                    client.close();
                // process.exit(); //optional function if you work with only one session
                }, 80000);
                }

            })
            .catch((erro) => {
                console.log('There was an error in the bot',erro);
            });
        });
    }

    async start(client) {
        let inchat = await client.isInsideChat(); //wait until the page is in whatsapp chat
        if (inchat) {
          client.onMessage((message) => {
            if (message.body === 'Hi' && message.isGroupMsg === false) {
              client
                .sendText(message.from, 'Welcome Venom 🕷')
                .then((result) => {
                  console.log('Result: ', result); //return object success
                })
                .catch((erro) => {
                  console.error('Error when sending: ', erro); //return object error
                });
            }
          });
        }
      }
}

exports. default = new App().server;
