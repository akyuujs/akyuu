/**
 * XadillaX created at 2016-04-01 13:52:27 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const Akyuu = require("../../../../");
const Joi = Akyuu.Joi;

let routers = module.exports = [];

function jiandan(req, resp) {
    let page = req.params.page;
    akyuu.service.get("jiandan").getOOXX(page, function(err, result) {
        if(err) {
            return resp.error(err);
        }

        resp.succ(result);
    });
}

routers.push({
    router: "/jiandan",
    processors: [ jiandan ]
});

routers.push({
    router: "/jiandan/:page",
    processors: [ jiandan ],
    params: {
        page: Joi.number().integer()
    }
});

routers.push({
    body: {},
    desc: "Test router.",
    error: {},
    method: "GET",
    params: {
        0: Joi.string().min(0).max(5).default("akyuu")
    },
    query: {
        app: Joi.string().default("akyuu").min(1).max(5)
    },
    router: /^\/(.*)$/,
    
    processors: [(req, resp) => {
        resp.succ({
            app: req.query.app,
            welcome: `Hello ${req.params[0]}!`,
            modelData: akyuu.model.get("test").getData()
        });
    }]
});
