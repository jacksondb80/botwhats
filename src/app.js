import express from 'express';
import routes from './routes';
import bots from './bot';
import cors from 'cors';
const venom = require('venom-bot');

class App {

    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
        //this.cria();
        //this.bots();
    }

    middlewares() {
        this.server.use(cors());
        this.server.use(express.json());
    }

    routes() {
        this.server.use(routes);
    }

    bots() {
        bots.cria('sessao1');
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

export default new App().server;
