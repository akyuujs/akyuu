/**
 * XadillaX created at 2016-04-19 18:43:02 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var path = require("path");

var winston = require("winston");

var formatters = require("./formatters");

var defaultLogger = {
    type: "console",
    colorize: true,
    level: "silly",
    stderrLevels: [ "error", "warn", "info", "verbose", "debug", "silly" ],
    formatter: "default"
};

/**
 * Logger
 * @param {Akyuu} akyuu the akyuu parent object
 * @constructor
 */
var Logger = function(akyuu) {
    this.akyuu = akyuu;
    this.config = akyuu.config.logger || [];    // transport option array

    this._checkConsoleTransport();

    this.loggerContainer = new winston.Container();
    this.loggers = this.loggerContainer.loggers;
};

/**
 * _checkConsoleTransport
 * promise only one console transport; if set multi console transport, only
 * the first one effect
 * @private
 */
Logger.prototype._checkConsoleTransport = function() {
    var consoleTypeFirstIndex = this.config.findIndex(function(n) {
        return n.type && n.type.toLocaleLowerCase() === "console";
    });

    if (consoleTypeFirstIndex === -1) {
        this.config.push(defaultLogger);
    } else {
        this.config.remove(function(n, index) {
            return n.type && n.type === "console" && index !== consoleTypeFirstIndex;
        });
    }
};

/**
 * getTransports
 * @param {String} label the label string
 * @return {Array} the transports array
 */
Logger.prototype.getTransports = function (label) {
    var result = [];

    var _timestamp = function() {
        return Date.now();
    };

    for(var i = 0; i < this.config.length; i++) {
        var type = this.config[i].type.capitalize();
        var transportOption = Object.assign({}, this.config[i], {
            timestamp: _timestamp,
            id: label,
            label: label
        });

        if (type === "File") {
            transportOption.filename = path.join(this.akyuu.projectRoot, transportOption.filename);
        }

        if (typeof transportOption.formatter !== "function") {
            transportOption.formatter = formatters[transportOption.formatter] || formatters["default"];
        }

        if (!winston.transports[type]) {
            throw new Error("Cannot add unknown transport: " + type);
        }

        result.push(new (winston.transports[type])(transportOption));
    }

    return result;
};

/**
 * get
 * @param {String} name the logger name
 * @return {Logger} the winston logger
 */
Logger.prototype.get = function(name) {
    if (this.loggers[name]) {
        return this.loggers[name];
    }

    // create a logger
    var logger = this.loggers[name] = new winston.Logger({
        transports: this.getTransports(name)
    });

    var self = this;
    this.loggers[name].on("close", function () {
        self._delete(name);
    });

    // hack logger
    logger.$error = logger.error;
    logger.error = function() {
        if(arguments.length) {
            if(arguments[0] && arguments[0].stack) {
                arguments[0] = arguments[0].stack;
            }
        }

        this.$error.apply(this, arguments);
    };

    if(process.env.NODE_ENV === "test") {
        logger = {
            error: function() {},
            warn: function() {},
            info: function() {},
            verbose: function() {},
            debug: function() {},
            silly: function() {}
        };
    }

    return logger;
};

/**
 * load
 */
Logger.prototype.load = function() {
    /** { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
     *
     * 1. if a transport config has `level` prop,
     *    log shown when  logger.level <= transport.level
     *    [src:]  transport.level && self.levels[transport.level] >= self.levels[level]
     *
     * 2. if a transport do not have `level` prop,
     *    log shown whenlogger.level <= logger.options.level || 'info'
     *    [src:]  !transport.level && self.levels[self.level] >= self.levels[level]
     */
    winston.addColors({
        error: "red",
        warn: "magenta",
        info: "green",
        verbose: "gray",
        debug: "blue",
        silly: "grey"
    });
};

module.exports = Logger;
