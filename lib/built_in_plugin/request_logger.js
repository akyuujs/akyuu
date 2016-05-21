/**
 * Hacked from morgan
 *
 * Copyright(c) 2016 sallen450
 */
'use strict';

var onFinished = require("on-finished");
var onHeaders = require("on-headers");

/**
 * Get request ip address
 * @param {Request} req the request object
 * @return {String} the ip address
 * @private
 */
function getip(req) {
    return req.ip ||
        req._remoteAddress ||
        (req.connection && req.connection.remoteAddress) ||
        undefined;
}

/**
 * Record the start time
 * @private
 */
function recordStartTime() {
    this._startAt = process.hrtime();
    this._startTime = new Date();
}

/**
 * Get the (request -> response) time which takes
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @param {Number} digits the digits
 * @return {String} the formatted response time string
 * @private
 */
function getResponseTime(req, res, digits) {
    if (!req._startAt || !res._startAt) {
        // missing request and/or response start time
        return "";
    }

    // calculate diff
    var ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
            (res._startAt[1] - req._startAt[1]) * 1e-6;

    // return truncated value
    return ms.toFixed(digits === undefined ? 3 : digits);
}

/**
 * Get the logger message
 * @private
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
function formatMessage(req, res) {
    var ip = getip(req) || "";
    var method = req.method;
    var url = req.originalUrl || req.url;
    var httpVersion = req.httpVersionMajor + "." + req.httpVersionMinor;
    var status = res._header ? res.statusCode : "";
    var contentLength = res._headers["content-length"] || "";
    var referrer = req.headers["referer"] ||  req.headers["referrer"] || "No referer";
    var userAgent = req.headers["user-agent"];
    var responseTime = getResponseTime(req, res) || "";

    return ip + " - " + "\'" + method + " " + url + "HTTP/" + httpVersion + "\' " + status + " " + contentLength + " \'" + referrer + "\' " + " \'" + userAgent + "\' - " + responseTime + "ms";
}

/**
 * Request logger middleware
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @param {Function} next the next callback function
 */
var middleware = function(req, res, next) {
    // request data
    req._startAt = undefined;
    req._startTime = undefined;
    req._remoteAddress = getip(req);

    // response data
    res._startAt = undefined;
    res._startTime = undefined;

    // record request start
    recordStartTime.call(req);

    function logRequest() {
        var message = formatMessage(req, res);
        var logger = req.app.logger.get("AKYUU");

        logger.info(message);
    }

    // record response start
    onHeaders(res, recordStartTime);

    // log when response finished
    onFinished(res, logRequest);

    next();
};

/**
 * RequestLogger
 * @param {Akyuu} akyuu the parent akyuu object
 * @constructor
 */
var RequestLogger = function(akyuu/**, options*/) {
    this.akyuu = akyuu;
    this.position = akyuu.PLUGIN_POS.BEFORE_CONTROLLER;
};

/**
 * plug
 */
RequestLogger.prototype.plug = function() {
    this.akyuu.use(middleware);
};

/**
 * create
 * @param {Akyuu} akyuu the parent akyuu object
 * @param {Object} options the options object
 * @returns {RequestLogger} the request logger plugin
 */
exports.create = function(akyuu, options) {
    return new RequestLogger(akyuu, options);
};
