/**
 * XadillaX created at 2016-03-23 14:52:05 With ♥
 *
 * Copyright (c) 2016 akyuu.moe, all rights
 * reserved.
 */
"use strict";

const path = require("path");
const util = require("util");

require("sugar");

const Express = require("./_express_application");

/**
 * Akyuu
 * @constructor
 * @param {String} [projectRoot] the project root path
 */
var Akyuu = function(projectRoot) {
    Express.call(this);

    this.requirePaths = require("./require");
    this.requirePaths.addRequirePath(projectRoot ||
            path.resolve(__dirname, '../../../src'));
};

util.inherits(Akyuu, Express);

/**
 * init
 * @param {Function} callback the callback function
 */
Akyuu.prototype.init = function(callback) {
    Express.prototype.init.call(this);
    process.nextTick(callback);
};

module.exports = Akyuu;
