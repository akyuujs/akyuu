/**
 * XadillaX created at 2016-04-18 17:34:39 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var fs = require("fs");
var path = require("path");

var _ = require("lodash");

/**
 * Service
 * @param {Akyuu} akyuu the akyuu object
 * @constructor
 */
var Service = function(akyuu) {
    this.akyuu = akyuu;

    this.services = {};
    this.serviceClasses = {};
};

/**
 * load
 * @param {String} file the filename
 */
Service.prototype.load = function(file) {
    if(!this.logger) {
        this.logger = this.akyuu.logger.get("service-loader");
    }

    var directory = path.join(this.akyuu.projectRoot + "/services", file);
    var filenames = fs.readdirSync(directory);

    for(var i = 0; i < filenames.length; i++) {
        var stat = fs.statSync(directory + "/" + filenames[i]);
        if(stat.isDirectory()) {
            this.load(file + "/" + filenames[i]);
        } else {
            if(_.endsWith(filenames[i], ".js")) {
                var apiName = filenames[i].substr(0, filenames[i].length - 3).toLowerCase();
                this.services[apiName] = new (require(directory + "/" + filenames[i]))();
                this.serviceClasses[apiName] = require(directory + "/" + filenames[i]);

                this.logger.info("Service `" + apiName + "` loaded.");
            }
        }
    }
};

/**
 * get
 * @param {String} name the service name
 * @return {Requester} the service requester
 */
Service.prototype.get = function(name) {
    name = name.toLowerCase();
    if(this.services[name]) return this.services[name];
    throw new Error("No such service " + name + ".");
};

/**
 * getClass
 * @param {String} name the service name
 * @return {Class} the service class
 */
Service.prototype.getClass = function(name) {
    name = name.toLowerCase();
    if(this.serviceClasses[name]) return this.serviceClasses[name];
    throw new Error("No such API " + name + ".");
};

module.exports = Service;
