/**
 * XadillaX created at 2016-03-23 14:57:14 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var fs = require("fs");
var Module = require("module");
var path = require("path");

var debug = require("debug")("akyuu:require");

var _resolveFilename = Module._resolveFilename.bind(Module);
var cache = {};

var SRC_PATH = [];

/**
 * _resolveFilename
 * @param {String} request the request path
 * @param {Object} parent the parent object
 * @return {*} the value which true `_resolveFilename` returned
 */
Module._resolveFilename = function(request, parent) {
    if(!request.startsWith("./") && !request.startsWith("../")) {
        var _cache = cache[request];
        if(_cache) {
            request = cache[request];
        } else if(undefined === _cache) {
            _cache = cache[request] = false;

            for(var i = 0; i < SRC_PATH.length; i++) {
                var testRequest = path.resolve(SRC_PATH[i], request);
                var names = [
                    testRequest + ".js",
                    testRequest + ".json",
                    testRequest + ".node",
                    testRequest + "/index.js",
                    testRequest + "/index.json",
                    testRequest + "/index.node"
                ];

                for(var j = 0; j < names.length; j++) {
                    try {
                        /**
                         * because:
                         *
                         *   > Stability: 0 - Deprecated: Use fs.statSync or fs.accessSync instead.
                         *
                         * so we use `try ... catch` and `statSync` instead
                         *
                         * see see https://nodejs.org/api/fs.html#fs_fs_existssync_path
                         */
                        if(fs.statSync(names[j]).isFile()) {
                            request = _cache = cache[request] = testRequest;
                            break;
                        }
                    } catch(e) {
                        // ignore...
                    }
                }

                if(_cache) break;
            }
        }
    }

    return _resolveFilename(request, parent);
};

/**
 * addRequirePath
 * @param {String} path add a specified path to require path
 */
exports.addRequirePath = function(path) {
    if(SRC_PATH.indexOf(path) >= 0) return;
    SRC_PATH.push(path);

    debug("add path " + path, SRC_PATH);
};

/**
 * removeRequirePath
 * @param {String} path remove a specified path from require path
 */
exports.removeRequirePath = function(path) {
    exports.paths = SRC_PATH = SRC_PATH.filter(function(value) {
        if(path === value) {
            cache = {};
            return false;
        } else {
            return true;
        }
    });

    debug("remove path " + path, SRC_PATH);
};

exports.paths = SRC_PATH;
