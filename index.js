/**
 * XadillaX created at 2016-04-01 14:06:37 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const config = require("./lib/config");
if(!config.server) {
    throw new Error("Server section is required in config.");
}

const akyuu = new (require("./lib/akyuu"))(config.server.root);

akyuu.Validator = require("joi");
akyuu.Service = require("./lib/requester");

module.exports = akyuu;

akyuu.startCluster = require("akyuu-cluster").startCluster.bind(akyuu, __dirname);
