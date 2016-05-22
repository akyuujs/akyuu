/**
 * XadillaX created at 2016-05-12 16:10:11 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var fs = require("fs");
var path = require("path");

var invert = require("lodash.invert");

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
    var builtInPath = "../built_in_plugin/" + key.underscore();
    if(fs.existsSync(path.join(__dirname, builtInPath + ".js"))) {
        var plug = require(builtInPath).create(this.akyuu, this.pluginConfig[key] || {});
        var name = key.dasherize();
        plug.name = plug.name || name;

        this.plugins.push(plug);
        return this.logger.info("Built-in plugin `" + plug.name + "` loaded.");
    }

    var name = "akyuu-" + key.dasherize();
    var plug = require(name).create(this.akyuu, config);

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
 */
Plugin.prototype.plug = function(pos) {
    pos = pos || 0;

    for(var i = 0; i < this.plugins.length; i++) {
        var plugin = this.plugins[i];
        if(plugin.position === pos) {
            plugin.plug();
            this.logger.info(Plugin.INVERTED_POS[pos] + " plugin `" + plugin.name + "` plugged.");
        }
    }
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

Plugin.INVERTED_POS = invert(Plugin.POS);

module.exports = Plugin;
