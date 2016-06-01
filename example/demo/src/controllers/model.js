/**
 * XadillaX created at 2016-04-19 16:26:07 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const akyuu = require("../../../../");
const V = akyuu.Validator;

const routers = module.exports = [];

routers.push({
    query: {
        id: V.string().required()
    },
    router: "/toshi",
    processors: [(req, resp) => {
        let Toshi = akyuu.model.get("toshi");

        resp.succ({
            sql: Toshi.where({ id: req.query.id }).makeSQL("find"),
            config: akyuu.config.connections.main
        });
    }]
});
