"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express');

const routes = new (0, _express.Router)();

routes.get('/teste', (req, res) => res.json({ ok: true }));

exports. default = routes;
