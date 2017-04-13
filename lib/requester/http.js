/**
 * XadillaX created at 2016-04-18 15:42:29 With ♥
 *
 * Copyright (c) 2016 akyuu.moe, all rights
 * reserved.
 */
"use strict";

const os = require("os");
const qs = require("querystring");

const _ = require("lodash");
const spidex = require("spidex");
const spidexPackage = require("spidex/package");

let Errors;
const pkg = require("../../package");

const USER_AGENT = _.template(
    "AkyuuHttpRequester/<%= version %> (<%= platform %> <%= release %>_<%= arch %>; " +
    "N; zh_CN) Spidex/<%= spidexVersion %> Akyuu <%= version %>")({
        version: pkg.version,
        platform: os.platform(),
        release: os.release(),
        arch: os.arch(),
        spidexVersion: spidexPackage.version
    });

class HTTPRequester {
    constructor(baseUri, options) {
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
    }

    _processRouter(router) {
        if(router && router[0] !== "/") router = `/${router}`;
        return router;
    }

    wrapResponse(content, header, status) { // eslint-disable-line
        return content;
    }

    _generateUri(router, params) {
        router = this._processRouter(router);
        let uri = _.template("<%= baseUri %><%= router %>")({
            baseUri: this.baseUri,
            router: router
        });

        if(params) {
            uri += `?${qs.stringify(params)}`;
        }

        return uri;
    }

    get(router, params, callback) {
        if(typeof params === "function") {
            callback = params;
            params = {};
        }

        const uri = this._generateUri(router, params);
        const self = this;
        spidex.get(uri, {
            charset: this.charset,
            header: this.header,

            timeout: this.options.timeout,
            requestTimeout: this.options.requestTimeout,
            responseTimeout: this.options.responseTimeout
        }, function(result, status, respHeader) {
            result = self.wrapResponse(result, respHeader, status);
            if(result instanceof Error) return callback(new Errors.ThirdParty(result));
            callback(undefined, result, respHeader, status);
        }).on("error", function(err) {
            return callback(new Errors.ThirdParty(err));
        });
    }

    request(method, router, params, callback) {
        if(typeof params === "function") {
            callback = params;
            params = {};
        }

        const uri = this._generateUri(router);
        const self = this;
        spidex.method(method, uri, {
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
    }

    post(router, params, callback) {
        return this._request("POST", router, params, callback);
    }

    put(router, params, callback) {
        return this._request("PUT", router, params, callback);
    }

    delete(router, params, callback) {
        return this._request("DELETE", router, params, callback);
    }

    patch(router, params, callback) {
        return this._request("PATCH", router, params, callback);
    }

    head(router, params, callback) {
        return this._request("HEAD", router, params, callback);
    }

    options(router, params, callback) {
        return this._request("OPTIONS", router, params, callback);
    }

    trace(router, params, callback) {
        return this._request("TRACE", router, params, callback);
    }
}

module.exports = HTTPRequester;
