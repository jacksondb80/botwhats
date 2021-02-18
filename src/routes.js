import { Router } from 'express';
import bot from './bot';

const routes = new Router();

routes.get('/teste', (req, res) => {



    res.json({ ok: true })
    });

    routes.get('/start', async (req, res) => {
        bot.cria('sessao1');
        res.json({ ok: true })

        });

        routes.get('/qr', async (req,res) => {
            try {
                bot.qrcode = bot.qrcode.replace('data:image/png;base64,', '');
                const imageBuffer = Buffer.from(bot.qrcode, 'base64');
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': imageBuffer.length
                });
                res.end(imageBuffer);
            } catch (error) {
                res.status(200).json({ result: 'error', message: "Tente novamente em 10 segundos"})
            }

        });




export default routes;
