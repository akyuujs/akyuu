/**
 * XadillaX created at 2016-03-29 17:20:21 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const Akyuu = require("../../../");
const akyuu = Akyuu.create(`${__dirname}`);

akyuu.init(err => {
    if(err) {
        console.error("Failed to start akyuu.js");
        console.error(err.stack);
        process.exit(4);
    }

    akyuu.listen(3000);
    console.log("Akyuu-demo listened on port 3000.");
});
