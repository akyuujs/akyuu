/**
 * XadillaX created at 2016-03-23 14:57:14 With ♥
 *
 * Copyright (c) 2016 akyuu.moe, all rights
 * reserved.
 */
"use strict";

const fs = require("fs");
const Module = require("module");
const path = require("path");

const debug = require("debug")("akyuu:require");

const _resolveFilename = Module._resolveFilename.bind(Module);

let cache = {};
let SRC_PATH = [];

/**
 * _resolveFilename
 * @param {String} request the request path
 * @param {Object} parent the parent object
 * @return {*} the value which true `_resolveFilename` returned
 */
Module._resolveFilename = function(request, parent) {
    if(!request.startsWith("./") && !request.startsWith("../")) {
        let _cache = cache[request];

        if(undefined !== _cache && typeof _cache !== Boolean && typeof _cache !== String) {
            cache[request] = _cache = undefined;
        }

        if(_cache) {
            request = cache[request];
        } else if(undefined === _cache) {
            _cache = cache[request] = false;

            for(let i = 0; i < SRC_PATH.length; i++) {
                const testRequest = path.resolve(SRC_PATH[i], request);
                const names = [
                    `${testRequest}.js`,
                    `${testRequest}.json`,
                    `${testRequest}.node`,
                    `${testRequest}/index.js`,
                    `${testRequest}/index.json`,
                    `${testRequest}/index.node`
                ];

                for(let j = 0; j < names.length; j++) {
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
 * @param {String} _path add a specified path to require path
 * @return {void}
 */
exports.addRequirePath = function(_path) {
    if(SRC_PATH.indexOf(_path) >= 0) return;
    SRC_PATH.push(_path);

    debug(`add path ${_path}`, SRC_PATH);
};

/**
 * removeRequirePath
 * @param {String} _path remove a specified path from require path
 * @return {void}
 */
exports.removeRequirePath = function(_path) {
    exports.paths = SRC_PATH = SRC_PATH.filter(function(value) {
        if(_path === value) {
            cache = {};
            return false;
        } else {
            return true;
        }
    });

    debug(`remove path ${_path}`, SRC_PATH);
};

exports.paths = SRC_PATH;
