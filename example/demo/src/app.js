/**
 * XadillaX created at 2016-03-29 17:20:21 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const path = require("path");

const akyuu = require("../../../");

akyuu.setTemplateRoot(path.resolve(__dirname, "templates"));
akyuu.init(function(err) {
    if(err) {
        console.error("Failed to start akyuu.js");
        console.error(err.stack);
        process.exit(4);
    }

    akyuu.start();
    console.log(`Akyuu-demo listened on port ${akyuu.config.server.port}.`);
});
