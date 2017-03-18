/**
 * XadillaX created at 2016-04-18 15:42:29 With ♥
 *
 * Copyright (c) 2016 akyuu.moe, all rights
 * reserved.
 */
"use strict";

var os = require("os");
var qs = require("querystring");

var _ = require("lodash");
var spidex = require("spidex");
var spidexPackage = require("spidex/package");

var Errors;
var pkg = require("../../package");

var USER_AGENT = _.template("AkyuuHttpRequester/<%= version %> (<%= platform %> <%= release %>_<%= arch %>; N; zh_CN)" +
    " Spidex/<%= spidexVersion %> Akyuu <%= version %>")({
        version: pkg.version,
        platform: os.platform(),
        release: os.release(),
        arch: os.arch(),
        spidexVersion: spidexPackage.version
    });

/**
 * HTTPRequester
 * @param {String} baseUri the base uri
 * @param {Object} [options] the options
 * @param {Number} [options.timeout] the timeout for request
 * @param {Number} [options.requestTimeout] the timeout for request request
 * @param {Number} [options.responseTimeout] the timeout for request response
 * @constructor
 */
var HTTPRequester = function(baseUri, options) {
    this.core = spidex;
    this.userAgent = USER_AGENT;

    if(!Errors) {
        Errors = require("../../").Errors;
    }

    this.baseUri = baseUri;
    while(this.baseUri.length && this.baseUri[this.baseUri.length - 1] === "/") {
        this.baseUri = this.baseUri.substr(0, this.baseUri.length - 1);
    }

    this.header = {};
    this.charset = "utf8";

    this.options = _.merge(options || {}, {
        timeout: 60000,
        requestTimeout: 60000,
        responseTimeout: 60000
    });
};

/**
 * _processRouter
 * @param {String} router the router string
 * @return {String} the router processed
 */
HTTPRequester.prototype._processRouter = function(router) {
    if(router && router[0] !== "/") router = "/" + router;
    return router;
};

/**
 * wrapResponse
 * @param {String} response the response string
 * @return {Object} the parsed response content object
 */
HTTPRequester.prototype.wrapResponse = function(response) {
    return response;
};

/**
 * _generateUri
 * @param {String} router the router
 * @param {Object} [params] the params
 * @return {String} the generated URI
 */
HTTPRequester.prototype._generateUri = function(router, params) {
    router = this._processRouter(router);
    var uri = _.template("<%= baseUri %><%= router %>")({
        baseUri: this.baseUri,
        router: router
    });

    if(params) {
        uri += "?" + qs.stringify(params);
    }

    return uri;
};

/**
 * get
 * @param {String} router the router
 * @param {Object} params the params
 * @param {Function} callback the callback function
 */
HTTPRequester.prototype.get = function(router, params, callback) {
    if(typeof params === "function") {
        callback = params;
        params = {};
    }

    var uri = this._generateUri(router, params);
    // logger.silly("GETTING [" + uri + "]...", {
    //     router: router,
    //     params: params,
    //     header: this.header
    // });

    var self = this;
    spidex.get(uri, {
        charset: this.charset,
        header: this.header,

        timeout: this.options.timeout,
        requestTimeout: this.options.requestTimeout,
        responseTimeout: this.options.responseTimeout 
    }, function(result, status, respHeader) {
        // logger.silly("FINISHED GETTING [" + uri + "]...", {
        //     router: router,
        //     params: params,
        //     header: self.header,

        //     result: result,
        //     status: status,
        //     responseHeader: respHeader
        // });

        result = self.wrapResponse(result, respHeader, status);
        if(result instanceof Error) return callback(new Errors.ThirdParty(result));
        callback(undefined, result, respHeader, status);
    }).on("error", function(err) {
        return callback(new Errors.ThirdParty(err));
    });
};

/**
 * post
 * @param {String} router the router
 * @param {Object} params the params
 * @param {Function} callback the callback function
 */
HTTPRequester.prototype.post = function(router, params, callback) {
    if(typeof params === "function") {
        callback = params;
        params = {};
    }

    var uri = this._generateUri(router);
    // logger.silly("POSTING [" + uri + "]...", {
    //     router: router,
    //     params: params,
    //     header: this.header
    // });

    var self = this;
    spidex.post(uri, {
        charset: this.charset,
        header: this.header,

        timeout: this.options.timeout,
        requestTimeout: this.options.requestTimeout,
        responseTimeout: this.options.responseTimeout,

        data: params
    }, function(result, status, respHeader) {
        result = self.wrapResponse(result, respHeader, status);
        if(result instanceof Error) return callback(new Errors.ThirdParty(result));
        callback(undefined, result, respHeader, status);
    }).on("error", function(err) {
        return callback(new Errors.ThirdParty(err));
    });
};

/**
 * put
 * @param {String} router the router
 * @param {Object} params the params
 * @param {Function} callback the callback function
 */
HTTPRequester.prototype.put = function(router, params, callback) {
    if(typeof params === "function") {
        callback = params;
        params = {};
    }

    var uri = this._generateUri(router);
    // logger.silly("PUTTING [" + uri + "]...", {
    //     router: router,
    //     params: params,
    //     header: this.header
    // });

    var self = this;
    spidex.put(uri, {
        charset: this.charset,
        header: this.header,

        timeout: this.options.timeout,
        requestTimeout: this.options.requestTimeout,
        responseTimeout: this.options.responseTimeout,

        data: params
    }, function(result, status, respHeader) {
        result = self.wrapResponse(result, respHeader, status);
        if(result instanceof Error) return callback(new Errors.ThirdParty(result));
        callback(undefined, result, respHeader, status);
    }).on("error", function(err) {
        return callback(new Errors.ThirdParty(err));
    });
};

module.exports = HTTPRequester;
