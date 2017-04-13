/**
 * XadillaX created at 2016-05-12 16:10:11 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const _ = require("lodash");
const async = require("async");

class Plugin {
    constructor(akyuu) {
        this.akyuu = akyuu;
        this.basePluginConfig = akyuu.config.basePlugins || {};
        this.pluginConfig = akyuu.config.plugins || {};

        this.plugins = [];
        this.logger = akyuu.logger.get("plugin-loader");
    }

    loadSingle(key, config) {
        // see if it's built-in
        const builtInPath = `../built_in_plugin/${_.snakeCase(key)}`;
        if(fs.existsSync(path.join(__dirname, `${builtInPath}.js`))) {
            const plug = require(builtInPath).create(this.akyuu, this.pluginConfig[key] || {});
            const name = _.kebabCase(key);
            plug.name = plug.name || name;

            this.plugins.push(plug);
            return this.logger.info(`Built-in plugin \`${plug.name}\` loaded.`);
        }

        let name = `akyuu-${_.kebabCase(key)}`;
        let plug;
        try {
            plug = require(name).create(this.akyuu, config);
        } catch(e) {
            // adapter for @akyuu/package_name
            name = `@akyuu/${_.kebabCase(key)}`;
            plug = require(name).create(this.akyuu, config);
        }

        plug.name = plug.name || name;

        this.plugins.push(plug);

        this.logger.info(`Plugin \`${plug.name}\` loaded.`);
    }

    load() {
        let config = this.basePluginConfig;
        for(const key in config) {
            if(!config.hasOwnProperty(key)) continue;
            if(!config[key].enabled) continue;
            this.loadSingle(key, config[key]);
        }

        config = this.pluginConfig;
        for(const key in config) {
            if(!config.hasOwnProperty(key)) continue;
            if(!config[key].enabled) continue;
            this.loadSingle(key, config[key]);
        }
    }

    plug(pos, callback) {
        callback = callback || function() {};
        pos = pos || 0;

        const self = this;
        async.eachSeries(this.plugins, function(plugin, callback) {
            if(plugin.position !== pos) {
                return process.nextTick(callback);
            }

            const argsLength = plugin.plug.length;
            if(argsLength > 0) {
                plugin.plug(function(err) {
                    if(err) return callback(err);
                    self.logger.info(`${Plugin.INVERTED_POS[pos]} plugin \`${plugin.name}\` plugged.`);
                    callback();
                });
            } else {
                plugin.plug();
                self.logger.info(`${Plugin.INVERTED_POS[pos]} plugin \`${plugin.name}\` plugged.`);
                process.nextTick(callback);
            }
        }, function(err) {
            callback(err);
        });
    }
}

Plugin.POS = {
    BEFORE_SERVICE: 0,
    BEFORE_CONNECTION: 1,
    BEFORE_MODEL: 2,
    BEFORE_CONTROLLER: 3,

    AFTER_SERVICE: 100,
    AFTER_CONNECTION: 101,
    AFTER_MODEL: 102,
    AFTER_CONTROLLER: 103
};

Plugin.INVERTED_POS = _.invert(Plugin.POS);

module.exports = Plugin;
