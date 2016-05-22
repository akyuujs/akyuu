/**
 * XadillaX created at 2016-04-19 16:07:35 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var Connection = function(akyuu) {
    this.akyuu = akyuu;
    this.config = this.akyuu.config.connections || {};

    this.connections = {};
    this.logger = null;
};

Connection.prototype.load = function() {
    if(!this.logger) {
        this.logger = this.akyuu.logger.get("connection-loader");
    }

    for(var key in this.config) {
        if(!this.config.hasOwnProperty(key)) continue;

        var config = this.config[key];
        var adapter = config.adapter;
        if(!adapter) this.connections[key] = config;
        else {
            var Adapter = require("akyuu-adapter-" + adapter);
            this.connections[key] = Adapter.create(config);
        }

        this.logger.info("Connection adapter `" + key + "` loaded.");
    }
};

Connection.prototype.get = function(name) {
    return this.connections[name];
};

module.exports = Connection;
