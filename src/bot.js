const venom = require('venom-bot');


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
            if (message.isGroupMsg === false) {
              validaMsg(client, message);
            }
          });
        }
      }

    async validaMsg(client, message){
        if (message.body === 'Hi') {
            client
              .sendText(message.from, 'Welcome Venom 🕷')
              .then((result) => {
                console.log('Result: ', result); //return object success
              })
              .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
              });
          }
    }








}
export default Bot;

