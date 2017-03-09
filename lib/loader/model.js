/**
 * XadillaX created at 2016-04-18 10:34:39 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var fs = require("fs");
var path = require("path");

var _ = require("lodash");

/**
 * Model
 * @constructor
 * @param {Akyuu} akyuu the parent object
 */
var Model = function(akyuu) {
    this.akyuu = akyuu;
    this.models = {};
};

/**
 * load
 * @param {String} file the file path
 */
Model.prototype.load = function(file) {
    if(!this.logger) {
        this.logger = this.akyuu.logger.get("model-loader");
    }

    var directory = path.join(this.akyuu.projectRoot + "/models", file);

    var filenames;
    try {
        filenames = fs.readdirSync(directory);
    } catch(e) {
        return;
    }

    for(var i = 0; i < filenames.length; i++) {
        var stat = fs.statSync(directory + "/" + filenames[i]);
        if(stat.isDirectory()) {
            this.load(file + "/" + filenames[i]);
        } else {
            if(_.endsWith(filenames[i], ".js")) {
                var modelName = _.upperFirst(_.camelCase(filenames[i].substr(0, filenames[i].length - 3)));
                this.models[modelName] = require(directory + "/" + filenames[i]);
                this.logger.info("Model `" + modelName + "` loaded.");
            }
        }
    }
};

/**
 * get
 * @param {String} name the model name
 * @return {ModelObject} an model object
 */
Model.prototype.get = function(name) {
    name = _.upperFirst(_.camelCase(name));
    if(this.models[name]) return this.models[name];

    try {
        this.models[name] = require(`model/${_.snakeCase(name)}`);
    } catch(e) {
        throw e;
    }

    return this.models[name];
};

module.exports = Model;
