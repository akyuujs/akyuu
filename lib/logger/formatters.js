/**
 * XadillaX created at 2016-04-19 18:54:08 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var moment = require("moment");
var colorize = require("winston").config.colorize;

module.exports = {
    "default": function(options) {
        var time = "[" + moment(options.timestamp()).format("YYYY-MM-DD HH:mm:ss.SSS") + "]";
        var level = options.level;
        var prefix = time + " " + level.toUpperCase() + " " + options.label + " - ";
        var surfix = " " + JSON.stringify(options.meta);
        if(" {}" === surfix) surfix = "";

        if(options.colorize) {
            prefix = colorize(level, prefix);
            surfix = colorize(level, surfix);
        }

        if(level === "error" || level === "warn") {
            if(options.message && options.message.stack) {
                options.message = options.message.stack;
            }
        }

        return prefix + options.message + (options.meta ? surfix : "");
    }
};
