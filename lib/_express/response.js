/**
 * XadillaX created at 2016-04-01 14:50:59 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const resp = require("express/lib/response");

/**
 * succ
 * @param {*} data the data to be returned
 * @return {undefined}
 */
resp.succ = function(data) {
    this.send({
        code: 0,
        status: 200,
        data: data
    });
};

/**
 * error
 * @param {Error} err the error object
 * @return {undefined}
 */
resp.error = function(err) {
    const status = err.status || 500;
    const server = this.app.config.server || {};
    if(server.autoStatusCode || server.autoStatusCode === undefined) {
        this.status(status);
    }

    this.send({
        code: err.code || -1,
        status: status,
        message: err.business || err.message,
        raw: err.message
    });
};

module.exports = resp;
