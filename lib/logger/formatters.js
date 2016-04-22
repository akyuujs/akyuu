/**
 * XadillaX created at 2016-04-19 18:54:08 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var colors = require('colors');
var moment = require("moment");

module.exports = [
    function(loggerName, _colors, options) {
        var time = "[" + moment(options.timestamp()).format("YYYY-MM-DD HH:mm:ss.SSS") + "]";
        var level = options.level.toUpperCase();
        var prefix = time + " " + level + " " + loggerName + " - ";
        var surfix = " " + JSON.stringify(options.meta);
        if(" {}" === surfix) surfix = "";

        if(_colors[level]) {
            prefix = colors[_colors[level]](prefix);
            surfix = colors[_colors[level]](surfix);
        }

        if(level === "ERROR" || level === "WARN") {
            if(options.message && options.message.stack) {
                options.message = options.message.stack;
            }
        }

        return prefix + options.message + (options.meta ? surfix : "");
    }
];
