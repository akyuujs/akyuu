/**
 * XadillaX created at 2016-04-19 18:43:02 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const path = require("path");

const _ = require("lodash");
const winston = require("winston");

const formatters = require("./formatters");

const defaultLogger = {
    type: "console",
    colorize: true,
    level: "silly",
    stderrLevels: [ "error", "warn", "info", "verbose", "debug", "silly" ],
    formatter: "default"
};

class Logger {
    constructor(akyuu) {
        this.akyuu = akyuu;
        this.config = akyuu.config.logger || {};
        this.transportConfig = this.config.transports || [];

        this._checkConsoleTransport();

        this.loggerContainer = new winston.Container();
        this.loggers = this.loggerContainer.loggers;
    }

    _checkConsoleTransport() {
        const consoleTypeFirstIndex = _.findIndex(this.transportConfig, function(n) {
            return n.type && n.type.toLocaleLowerCase() === "console";
        });

        if(consoleTypeFirstIndex === -1) {
            this.transportConfig.push(defaultLogger);
        } else {
            _.remove(this.transportConfig, function(n, index) {
                return n.type && n.type === "console" && index !== consoleTypeFirstIndex;
            });
        }
    }

    getTransports(label) {
        const result = [];
        const _timestamp = function() {
            return Date.now();
        };

        for(let i = 0; i < this.transportConfig.length; i++) {
            if(this.transportConfig[i].enabled === false) continue;
            const type = _.startCase(this.transportConfig[i].type);
            const transportOption = Object.assign({}, this.transportConfig[i], {
                timestamp: _timestamp,
                id: label,
                label: label
            });

            if(type === "File") {
                transportOption.filename = path.join(this.akyuu.projectRoot, transportOption.filename);
            }

            if(typeof transportOption.formatter !== "function") {
                transportOption.formatter = formatters[transportOption.formatter] || formatters.default;
            }

            if(!winston.transports[type]) {
                throw new Error(`Cannot add unknown transport: ${type}`);
            }

            result.push(new (winston.transports[type])(transportOption)); // eslint-disable-line
        }

        return result;
    }

    get(name) {
        if(this.loggers[name]) {
            return this.loggers[name];
        }

        // create a logger
        let logger = this.loggers[name] = new winston.Logger({
            transports: this.getTransports(name)
        });

        const self = this;
        this.loggers[name].on("close", function() {
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
    }

    load() {
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

        // console
        if(this.config.overrideConsole) {
            const logger = this.get("console");
            console.log = logger.info.bind(logger);
        }
    }
}

module.exports = Logger;
