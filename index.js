/**
 * XadillaX created at 2016-04-01 14:06:37 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

require("sugar");

var _defaultAkyuu = null;
var _akyuues = {};

var Akyuu = module.exports = {};

/**
 * create
 * @param {String} root the project root path for Akyuu
 * @param {String} [name] this akyuu instance name
 * @returns {Akyuu} the akyuu object
 */
Akyuu.create = function(root, name) {
    var akyuu = new (require("./lib/akyuu"))(root);

    if(name) _akyuues[name] = akyuu;
    else {
        _defaultAkyuu = akyuu;
    }

    return akyuu;
};

/**
 * get
 * @param {String} [name] the akyuu instance name
 * @returns {Akyuu} the akyuu object
 */
Akyuu.get = function(name) {
    if(!name) return _defaultAkyuu;
    else {
        return _akyuues[name];
    }
};

Akyuu.Joi = require("joi");

Akyuu.Service = {
    HTTP: require("./lib/requester/http"),
    Hessian: require("./lib/requester/hessian")
};

Akyuu.config = require("./lib/config");
