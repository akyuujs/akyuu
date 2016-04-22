/**
 * XadillaX created at 2016-04-19 18:43:02 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var path = require("path");

var Logger = function(akyuu) {
    this.akyuu = akyuu;
    this.config = akyuu.config.logger || {};

    this.config = Object.merge(this.config, [{
        transparent: "console",
        color: {
            ERROR: "red",
            WARN: "magenta",
            INFO: "green",
            VERBOSE: "gray",
            DEBUG: "blue",
            SILLY: "grey"
        },
        formatters: 0
    }, {
        transparent: "file",
        filename: path.join(this.akyuu.projectRoot, "akyuu.log"),
        formatters: 0
    }], true, true);

    this.loggers = {};
};

Logger.prototype.init = function() {
    for(var i = 0; i < this.config.length; i++) {
    }
};

module.exports = Logger;
