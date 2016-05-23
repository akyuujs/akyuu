"use strict";

module.exports = {
    overrideConsole: true,
    transports: [{
        type: "file",
        json: false,
        filename: "akyuu.log",
        formatter: "default"
    }]
};
