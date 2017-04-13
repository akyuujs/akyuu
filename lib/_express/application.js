/**
 * XadillaX created at 2016-03-29 17:46:57 With ♥
 *
 * Copyright (c) 2016 akyuu.moe, all rights
 * reserved.
 */
"use strict";

const EventEmitter = require("events").EventEmitter;
const http = require("http");
const util = require("util");

const proto = require("express/lib/application");
const req = require("express/lib/request");
const resp = require("./response");

/**
 * _ExpressApplication
 * @constructor
 */
const _ExpressApplication = function _ExpressApplication() {
    EventEmitter.call(this);                        // eslint-disable-line
    this.request = { __proto__: req, app: this };   // eslint-disable-line
    this.response = { __proto__: resp, app: this }; // eslint-disable-line
};

util.inherits(_ExpressApplication, EventEmitter);

for(const key in proto) {
    if(!proto.hasOwnProperty(key)) continue;
    _ExpressApplication.prototype[key] = proto[key];
}

/**
 * listen
 * @return {undefined}
 */
_ExpressApplication.prototype.listen = function() {
    const server = http.createServer(function(_req, _resp, next) {
        this.handle(_req, _resp, next);
    }.bind(this));

    // support listen on unix socket file, server.close() will delete unix socket file when process exit
    process.on("SIGINT", function() {
        server.close();
        process.exit(0);
    });

    process.on("uncaughtException", function(error) {
        console.log(error);
        server.close();
        process.exit(1);
    });

    server.listen.apply(server, arguments);
};

module.exports = _ExpressApplication;
