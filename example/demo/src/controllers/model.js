/**
 * XadillaX created at 2016-04-19 16:26:07 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const Akyuu = require("../../../../");
const Joi = Akyuu.Joi;

const routers = module.exports = [];

routers.push({
    query: {
        id: Joi.string().required()
    },
    router: "/toshi",
    processors: [(req, resp) => {
        let Toshi = req.app.model.get("toshi");

        resp.succ({
            sql: Toshi.where({ id: req.query.id }).makeSQL("find"),

            config: req.app.config.connections.main
        });
    }]
});
