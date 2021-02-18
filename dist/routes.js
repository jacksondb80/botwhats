"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _bot = require('./bot'); var _bot2 = _interopRequireDefault(_bot);

const routes = new (0, _express.Router)();

routes.get('/teste', (req, res) => {



    res.json({ ok: true })
    });

    routes.get('/start', async (req, res) => {
        _bot2.default.cria('sessao1');
        res.json({ ok: true })

        });

        routes.get('/qr', async (req,res) => {
            try {
                _bot2.default.qrcode = _bot2.default.qrcode.replace('data:image/png;base64,', '');
                const imageBuffer = Buffer.from(_bot2.default.qrcode, 'base64');
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': imageBuffer.length
                });
                res.end(imageBuffer);
            } catch (error) {
                res.status(200).json({ result: 'error', message: "Tente novamente em 10 segundos"})
            }

        });




exports. default = routes;
