import express from 'express';
import routes from './routes';
import cors from 'cors';
const venom = require('venom-bot');

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
        this.cria();
    }

    middlewares() {
        this.server.use(cors());
        this.server.use(express.json());
    }

    routes() {
        this.server.use(routes);
    }

    cria(){
        venom
            .create()
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
