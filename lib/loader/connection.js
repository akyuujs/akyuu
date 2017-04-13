/**
 * XadillaX created at 2016-04-19 16:07:35 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

class Connection {
    constructor(akyuu) {
        this.akyuu = akyuu;
        this.config = this.akyuu.config.connections || {};

        this.connections = {};
        this.logger = null;
    }

    load() {
        if(!this.logger) {
            this.logger = this.akyuu.logger.get("connection-loader");
        }

        for(const key in this.config) {
            if(!this.config.hasOwnProperty(key)) continue;

            const config = this.config[key];
            const adapter = config.adapter;
            if(!adapter) {
                this.connections[key] = config;
            } else {
                const Adapter = require(`akyuu-adapter-${adapter}`);
                this.connections[key] = Adapter.create(config);
            }

            this.logger.info(`Connection adapter \`${key}\` loaded.`);
        }
    }

    get(name) {
        return this.connections[name];
    }
}

module.exports = Connection;
