/**
 * XadillaX created at 2016-04-01 13:52:27 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const changeCase = require("change-case");

const akyuu = require("../../../../");
const V = akyuu.Validator;

const routers = module.exports = [];

const jiandan = (req, resp) => {
    const page = req.params.page;
    akyuu.service.get("jiandan").getOOXX(page, function(err, result) {
        if(err) {
            return resp.error(err);
        }

        resp.succ(result);
    });
};

routers.push({
    router: "/config",
    processors: [ function(req, resp) {
        console.log(akyuu.config.func);
        resp.succ(akyuu.config);
    } ]
});

routers.push({
    router: "/jiandan",
    processors: [ jiandan ]
});

routers.push({
    router: "/jiandan/:page",
    processors: [ jiandan ],
    params: {
        page: V.number().integer()
    }
});

routers.push({
    router: "/error/:err",
    processors: [ function(req, resp) {
        const Err = akyuu.Errors[changeCase.pascalCase(req.params.err)];
        if(undefined === Err) {
            return resp.error(new Error("Unknown error."));
        }

        resp.error(new Err("这是一个样例。"));
    } ],
    params: {
        err: V.string()
    }
});

routers.push({
    body: {},
    desc: "Test router.",
    error: {},
    method: "GET",
    params: {
        0: V.string().min(0).max(5).default("akyuu")
    },
    query: {
        app: V.string().default("akyuu").min(1).max(5)
    },
    router: /^\/(.*)$/,

    processors: [ function(req, resp) {
        resp.succ({
            app: req.query.app,
            welcome: `Hello ${req.params[0]}!`,
            modelData: akyuu.model.get("test").getData()
        });
    } ]
});
