/**
 * XadillaX created at 2016-03-23 14:52:05 With ♥
 *
 * Copyright (c) 2016 akyuu.moe, all rights
 * reserved.
 */
"use strict";

const path = require("path");

const async = require("async");
const Ero = require("ero");

const Model = require("./loader/model.js");
const Boot = require("./loader/boot");
const Connection = require("./loader/connection");
const Controller = require("./loader/controller");
const Express = require("./_express/application");
const Logger = require("./logger");
const Plugin = require("./loader/plugin");
const Service = require("./loader/service");

class Akyuu extends Express {
    constructor(projectRoot) {
        super();

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
    }

    init(callback) {
        const self = this;
        super.init();

        // load logger
        this.logger.load();
        this._logger = this.logger.get("akyuu");

        // customize errors
        const errors = this.config.errors || {};
        for(const key in errors) {
            if(!errors.hasOwnProperty(key)) continue;
            this.Errors.define(errors[key], key);
        }

        this.plugin.load();

        async.series([
            /**
             * step 1.
             *   boot before initialize
             */
            function(callback) {
                const beforeInit = true;
                self.boot.load(beforeInit, function(error) {
                    if(error) {
                        return callback(error);
                    }

                    return callback();
                });
            },

            /**
             * step 2.
             *   load services and their plugins
             */
            function(callback) {
                self.plugin.plug(self.PLUGIN_POS.BEFORE_SERVICE, function(err) {
                    if(err) return callback(err);
                    self.service.load("");
                    self.plugin.plug(self.PLUGIN_POS.AFTER_SERVICE, function(err) {
                        callback(err);
                    });
                });
            },

            /**
             * step 3.
             *   load connections and their plugins
             */
            function(callback) {
                self.plugin.plug(self.PLUGIN_POS.BEFORE_CONNECTION, function(err) {
                    if(err) return callback(err);
                    self.connection.load();
                    self.plugin.plug(self.PLUGIN_POS.AFTER_CONNECTION, function(err) {
                        callback(err);
                    });
                });
            },

            /**
             * step 4.
             *   load models and their plugins
             */
            function(callback) {
                self.plugin.plug(self.PLUGIN_POS.BEFORE_MODEL, function(err) {
                    if(err) return callback(err);
                    self.model.load("");
                    self.plugin.plug(self.PLUGIN_POS.AFTER_MODEL, function(err) {
                        callback(err);
                    });
                });
            },

            /**
             * step 5.
             *   load controllers and their plugins
             */
            function(callback) {
                self.plugin.plug(self.PLUGIN_POS.BEFORE_CONTROLLER, function(err) {
                    if(err) return callback(err);
                    self.controller.load("");
                    self.plugin.plug(self.PLUGIN_POS.AFTER_CONTROLLER, function(err) {
                        callback(err);
                    });
                });
            },

            /**
             * step 6.
             *   boot after initialize
             */
            function(callback) {
                const beforeInit = false;
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
    }

    start() {
        const server = this.config.server || {};
        if(server.socketPath) {
            this.listen(server.socketPath);
        } else {
            this.listen(server.port || 3000);
        }
    }

    setTemplateRoot(root) {
        this.set("views", root);
    }

    setTemplateEngine(engine) {
        this.set("view engine", engine);
    }
}

module.exports = Akyuu;
