/**
 * XadillaX created at 2016-04-19 15:32:02 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const path = require("path");

module.exports = {
    server: {
        port: 3000,
        root: path.join(__dirname, "../../"),
        autoStatusCode: true
    },

    cluster: {
        workerCount: 2,
        entry: path.join(__dirname, "../../app.js"),
        limit: 2
    },

    test: {
        test1: true
    },

    func: {
        ok: function() { return "ok"; }
    }
};
