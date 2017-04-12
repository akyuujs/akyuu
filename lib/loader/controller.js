/**
 * XadillaX created at 2016-04-01 10:53:39 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var fs = require("fs");
var path = require("path");

var _ = require("lodash");
var express = require("express");

var Validator = require("../middware/validator");

/**
 * Controller
 * @constructor
 * @param {Akyuu} akyuu the akyuu object
 */
var Controller = function(akyuu) {
    this.akyuu = akyuu;
};

/**
 * loadController
 * @param {String} root the root path
 * @param {Object} descriptor the router descriptor
 */
Controller.prototype.loadController = function(root, descriptor) {
    var router = express.Router({
        caseSensitive: true
    });

    var _root = root;
    root = root.substr(0, root.length - 3);
    if(_.endsWith(root, "/index")) {
        root = root.substr(0, root.length - 6);
    }
    // check router & processors
    this.check(descriptor);

    descriptor.forEach(function(item) {
        var method = (item.method || "GET").toLowerCase();
        var routerStr = item.router;
        var prcssrs = item.processors.reduce(function(prcssrs, prcssr) {
            prcssrs.push(prcssr);
            return prcssrs;
        }, []);

        (item.query && Object.keys(item.query).length) ?
                prcssrs.unshift(Validator.query.bind(null, item.query)) : null;
        (item.body && Object.keys(item.body).length) ?
                prcssrs.unshift(Validator.body.bind(null, item.body)) : null;
        (item.params && Object.keys(item.params).length) ?
                prcssrs.unshift(Validator.params.bind(null, item.params)) : null;

        router[method].apply(router, [ routerStr ].concat(prcssrs));
    });

    this.akyuu.use(root, router);

    this.logger.info("File `" + _root + "` loaded.");
};

/**
 * load
 * @param {String} file the file path
 */
Controller.prototype.load = function(file) {
    if(!this.logger) {
        this.logger = this.akyuu.logger.get("controller-loader");
    }

    var directory = path.join(this.akyuu.projectRoot + "/controllers", file);
    var filenames = fs.readdirSync(directory);

    var index = false;
    for(var i = 0; i < filenames.length; i++) {
        var stat = fs.statSync(directory + "/" + filenames[i]);

        if(stat.isDirectory()) {
            this.load(file + "/" + filenames[i]);
        } else {
            if(filenames[i] === "index.js") {
                index = true;
            } else if(filenames[i].endsWith(".js")) {
                this.loadController(file + "/" + filenames[i],
                        require(directory + "/" + filenames[i]));
            }
        }
    }

    if(index) {
        this.loadController(file + "/index.js", require(directory + "/index.js"));
    }

    this.logger.info("Directory `/" + file + "` loaded.");
};

Controller.prototype.check = function(descriptor) {
    descriptor.forEach(function(item) {
        // check router
        var routerStr = item.router;
        if(typeof  routerStr !== 'string') {
            throw new Error('router expect string but get ' + typeof routerStr)
        }
        if(routerStr.trim() === '') {
            throw new Error('router can not fill blank str');
        }

        // check processors
        var processors = item.processors;
        if(!Array.isArray(processors)) {
            throw new Error('processors expect array but get ' + typeof  processors);
        }
        processors.forEach(function(processor) {
            if(typeof processor !== string) {
                throw new Error('the router ' + routerStr + ' expect function processor but get ' + typeof processors);
            }
        });
    });
};

module.exports = Controller;
