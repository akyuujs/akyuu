/**
 * XadillaX created at 2016-04-01 14:50:59 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var resp = require("express/lib/response");

/**
 * succ
 * @param {*} data the data to be returned
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
 */
resp.error = function(err) {
    this.send({
        code: err.code || -1,
        status: err.status || 500,
        message: err.business || err.message,
        raw: err.message
    });
};

module.exports = resp;
