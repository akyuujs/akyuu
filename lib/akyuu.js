/**
 * XadillaX created at 2016-03-23 14:52:05 With ♥
 *
 * Copyright (c) 2016 akyuu.moe, all rights
 * reserved.
 */
"use strict";

var path = require("path");
var util = require("util");

var Ero = require("ero");

var Model = require("./loader/model.js");
var Connection = require("./loader/connection");
var Controller = require("./loader/controller");
var Express = require("./_express/application");
var Logger = require("./logger");
var Plugin = require("./loader/plugin");
var Service = require("./loader/service");

/**
 * Akyuu
 * @constructor
 * @param {String} [projectRoot] the project root path
 */
var Akyuu = function(projectRoot) {
    Express.call(this);

    this.projectRoot = projectRoot || path.resolve(__dirname, "../../../src");
    this.requirePaths = require("./require");
    this.requirePaths.addRequirePath(this.projectRoot);

    this.config = require("./config");
    this.logger = new Logger(this);

    this.ero = new Ero({
        template: require("./error/template"),
        definitions: require("./error/predefinition")
    });
    this.Errors = this.ero.Errors;

    this.Errors.define = this.ero.defineError.bind(this.ero);

    this.PLUGIN_POS = Plugin.POS;

    this.plugin = new Plugin(this);
    this.connection = new Connection(this);
    this.model = new Model(this);
    this.controller = new Controller(this);
    this.service = new Service(this);
};

util.inherits(Akyuu, Express);

/**
 * init
 * @param {Function} callback the callback function
 */
Akyuu.prototype.init = function(callback) {
    Express.prototype.init.call(this);

    this.logger.load();
    this._logger = this.logger.get("akyuu");

    // custom errors
    var errors = this.config.errors || {};
    for(var key in errors) {
        if(!errors.hasOwnProperty(key)) continue;
        this.Errors.define(errors[key], key);
    }

    this.plugin.load();

    this.plugin.plug(this.PLUGIN_POS.BEFORE_SERVICE);
    this.service.load("");
    this.plugin.plug(this.PLUGIN_POS.AFTER_SERVICE);

    this.plugin.plug(this.PLUGIN_POS.BEFORE_CONNECTION);
    this.connection.load();
    this.plugin.plug(this.PLUGIN_POS.AFTER_CONNECTION);

    this.plugin.plug(this.PLUGIN_POS.BEFORE_MODEL);
    this.model.load("");
    this.plugin.plug(this.PLUGIN_POS.AFTER_MODEL);

    this.plugin.plug(this.PLUGIN_POS.BEFORE_CONTROLLER);
    this.controller.load("");
    this.plugin.plug(this.PLUGIN_POS.AFTER_CONTROLLER);

    this._logger.info("Akyuu.js initialized.");

    process.nextTick(callback);
};

/**
 * start the server
 */
Akyuu.prototype.start = function() {
    var server = this.config.server || {};

    if(server.socketPath) {
        this.listen(server.socketPath);
    } else {
        this.listen(server.port || 3000);
    }
};

/**
 * setTemplateRoot
 * @param {String} root the view path
 */
Akyuu.prototype.setTemplateRoot = function(root) {
    this.set("views", root);
};

/**
 * setTemplateEngine
 * @param {String|Function} engine the render engine
 */
Akyuu.prototype.setTemplateEngine = function(engine) {
    this.set("view engine", engine);
};

module.exports = Akyuu;
