/**
 * XadillaX created at 2016-04-18 16:47:30 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var spidex = require("spidex");

var Errors = require("../error/predefinition");

/**
 * HessianRequester
 * @param {String} host the hessian service host
 * @param {Number} port the hessian service port
 * @param {Object} [options] the options
 * @constructor
 */
var HessianRequester = function(host, port, options) {
    this.baseUri = 'http://' + host + ':' + port + '/';

    this.options = Object.merge(options || {}, {
        timeout: 60000,
        requestTimeout: 60000,
        responseTimeout: 60000
    });

    this.headers = {};
};

/**
 * wrapResponse
 * @param {String} response the response string
 * @return {Object} the parsed response content object
 */
HessianRequester.prototype.wrapResponse = function(response) {
    return response;
};

/**
 * request
 * @param {String} router the hessian service router
 * @param {String} methodName the hessian method name
 * @param {*} ... arguments
 * @param {Function} callback the callback function
 */
HessianRequester.prototype.request = function(router, methodName) {
    var args = Array.prototype.slice.call(arguments);
    args.shift(); args.shift();
    var callback = args.pop();

    while(router && router[0] === '/') router = router.substr(1);

    var self = this;
    spidex.hessianV2(this.baseUri + router, methodName, args, {
        timeout: this.options.timeout,
        requestTimeout: this.options.requestTimeout,
        responseTimeout: this.options.responseTimeout,
        header: this.headers
    }, function(err, result) {
        if(err) {
            return callback(new Errors.ThirdParty(err));
        }

        result = self.wrapResponse(result);
        if(result instanceof Error) {
            return callback(new Errors.ThirdParty(result));
        }

        return callback(undefined, result);
    });
};

module.exports = HessianRequester;
