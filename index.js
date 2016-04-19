/**
 * XadillaX created at 2016-04-01 14:06:37 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var Akyuu = module.exports = require("./lib/akyuu");

Akyuu.Joi = require("joi");

Akyuu.Service = {
    HTTP: require("./lib/requester/http"),
    Hessian: require("./lib/requester/hessian")
};

Akyuu.config = require("./lib/config");
