/**
 * XadillaX created at 2016-03-23 14:52:05 With ♥
 *
 * Copyright (c) 2016 akyuu.moe, all rights
 * reserved.
 */
"use strict";

var path = require("path");
var util = require("util");

require("sugar");

var Model = require("./loader/model.js");
var Connection = require("./loader/connection");
var Controller = require("./loader/controller");
var Express = require("./_express/application");
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

    this.Errors = require("./error/predefinition");

    this.config = require("./config");

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

    // load controllers...
    this.service.load("");
    this.connection.load();
    this.model.load("");
    this.controller.load("");

    process.nextTick(callback);
};

module.exports = Akyuu;
