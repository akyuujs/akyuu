/**
 * XadillaX created at 2016-05-12 16:10:11 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var fs = require("fs");
var path = require("path");

var _ = require("lodash");
var async = require("async");
/**
 * Plugin
 * @param {Akyuu} akyuu the parent akyuu object
 * @constructor
 */
var Plugin = function(akyuu) {
    this.akyuu = akyuu;
    this.basePluginConfig = akyuu.config.basePlugins || {};
    this.pluginConfig = akyuu.config.plugins || {};

    this.plugins = [];
    this.logger = akyuu.logger.get("plugin-loader");
};

/**
 * loadSingle
 * @param {String} key the plugin config key
 */
Plugin.prototype.loadSingle = function(key, config) {
    // see if it's built-in
    var builtInPath = "../built_in_plugin/" + _.snakeCase(key);
    if(fs.existsSync(path.join(__dirname, builtInPath + ".js"))) {
        var plug = require(builtInPath).create(this.akyuu, this.pluginConfig[key] || {});
        var name = _.kebabCase(key);
        plug.name = plug.name || name;

        this.plugins.push(plug);
        return this.logger.info("Built-in plugin `" + plug.name + "` loaded.");
    }

    var name = "akyuu-" + _.kebabCase(key);
    var plug;
    try {
        plug = require(name).create(this.akyuu, config);
    } catch(error) {
        name = "@akyuu/" + _.kebabCase(key);
        plug = require(name).create(this.akyuu, config);
    }

    plug.name = plug.name || name;

    this.plugins.push(plug);

    this.logger.info("Plugin `" + plug.name + "` loaded.");
};

/**
 * load
 */
Plugin.prototype.load = function() {
    var config = this.basePluginConfig;
    for(var key in config) {
        if(!config.hasOwnProperty(key)) continue;
        if(!config[key].enabled) continue;
        this.loadSingle(key, config[key]);
    }
    
    config = this.pluginConfig;
    for(var key in config) {
        if(!config.hasOwnProperty(key)) continue;
        if(!config[key].enabled) continue;
        this.loadSingle(key, config[key]);
    }
};

/**
 * plug
 * @param {Number} pos the plugin position sign
 * @param {Function} the callback func
 */
Plugin.prototype.plug = function(pos, callback) {
    callback = callback || function() {};
    pos = pos || 0;
    async.eachSeries(this.plugins, function(plugin, callback) {
        if(plugin.position !== pos) {
            return process.nextTick(callback);
        }
        var argsLength = plugin.plug.length;
        if(argsLength > 0) {
            plugin.plug(function(err) {
                if(err) return callback(err);
                this.logger.info(Plugin.INVERTED_POS[pos] + " plugin `" + plugin.name + "` plugged.");
                callback();
            });
        } else {
            plugin.plug();
            this.logger.info(Plugin.INVERTED_POS[pos] + " plugin `" + plugin.name + "` plugged.");
            process.nextTick(callback);
        }
    }, function(err) {
        callback(err);
    });
};

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
