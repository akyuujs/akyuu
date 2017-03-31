/**
 * XadillaX created at 2016-03-23 14:52:05 With ♥
 *
 * Copyright (c) 2016 akyuu.moe, all rights
 * reserved.
 */
"use strict";

var async = require("async");
var path = require("path");
var util = require("util");

var async = require("async");
var Ero = require("ero");

var Model = require("./loader/model.js");
var Boot = require("./loader/boot");
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
    this.boot = new Boot(this);
};

util.inherits(Akyuu, Express);

/**
 * init
 * @param {Function} callback the callback function
 */
Akyuu.prototype.init = function(callback) {
    var _this = this;
    Express.prototype.init.call(this);

    // load logger
    this.logger.load();
    this._logger = this.logger.get("akyuu");

    // custom errors
    var errors = this.config.errors || {};
    for(var key in errors) {
        if(!errors.hasOwnProperty(key)) continue;
        this.Errors.define(errors[key], key);
    }

    this.plugin.load();

    var self = this;

    async.series([
        function(callback) {
            // boot before init
            var beforeInit = true;
            self.boot.load(beforeInit, function(error) {
                if(error) {
                    return callback(error);
                }

                return callback();
            });
        },
        function(callback) {
            self.plugin.plug(self.PLUGIN_POS.BEFORE_SERVICE, function(err) {
                if(err) return callback(err);
                self.service.load("");
                self.plugin.plug(self.PLUGIN_POS.AFTER_SERVICE, function(err) {
                    callback(err);
                });
            });
        },
        function(callback) {
            self.plugin.plug(self.PLUGIN_POS.BEFORE_CONNECTION, function(err) {
                if(err) return callback(err);
                self.connection.load();
                self.plugin.plug(self.PLUGIN_POS.AFTER_CONNECTION, function(err) {
                    callback(err);
                });
            });
        },
        function(callback) {
            self.plugin.plug(self.PLUGIN_POS.BEFORE_MODEL, function(err) {
                if(err) return callback(err);
                self.model.load("");
                self.plugin.plug(self.PLUGIN_POS.AFTER_MODEL, function(err) {
                    callback(err);
                });
            });
        },
        function(callback) {
            self.plugin.plug(self.PLUGIN_POS.BEFORE_CONTROLLER, function(err) {
                if(err) return callback(err);
                self.controller.load("");
                self.plugin.plug(self.PLUGIN_POS.AFTER_CONTROLLER, function(err) {
                    callback(err);
                });
            });
        },
        function(callback) {
            // boot after init
            var beforeInit = false;
            self.boot.load(beforeInit, function(error) {
                if(error) {
                    return callback(error);
                }

                return callback();
            });
        }
    ], function(err) {
        if(err) return callback(err);

        self._logger.info("Akyuu.js initialized.");

        callback();
    });
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
