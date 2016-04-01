/**
 * XadillaX created at 2016-04-01 13:52:27 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const Akyuu = require("../../../../");
const Joi = Akyuu.Joi;

var routers = module.exports = [];

routers.push({
    method: "GET",
    router: /^\/(.*)$/,
    desc: "Test router.",
    query: {
        app: Joi.string().default("akyuu").min(1).max(5)
    },
    body: {},
    params: {
        0: Joi.string().min(0).max(5).default("akyuu")
    },
    error: {},
    processors: [(req, resp) => {
        resp.succ({
            app: req.query.app,
            welcome: `Hello ${req.params[0]}!`
        });
    }]
});
