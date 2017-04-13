/**
 * Hacked from morgan
 *
 * Copyright(c) 2016 sallen450
 */
"use strict";

const onFinished = require("on-finished");
const onHeaders = require("on-headers");

/**
 * Get request ip address
 * @param {Request} req the request object
 * @return {String} the ip address
 * @private
 */
function getip(req) {
    const connection = req.connection && req.connection.remoteAddress;
    return req.ip || req._remoteAddress || connection || undefined;
}

/**
 * Record the start time
 * @return {void}
 * @private
 */
function recordStartTime() {
    this._startAt = process.hrtime();   // eslint-disable-line
    this._startTime = new Date();       // eslint-disable-line
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
    if(!req._startAt || !res._startAt) {
        // missing request and/or response start time
        return "";
    }

    // calculate diff
    const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
            (res._startAt[1] - req._startAt[1]) * 1e-6;

    // return truncated value
    return ms.toFixed(digits === undefined ? 3 : digits);
}

/**
 * Get the logger message
 * @private
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @return {String} the formatted message
 */
function formatMessage(req, res) {
    const ip = getip(req) || "";
    const method = req.method;
    const url = req.originalUrl || req.url;
    const httpVersion = `${req.httpVersionMajor}.${req.httpVersionMinor}`;
    const status = res._header ? res.statusCode : "";
    const contentLength = res._headers["content-length"] || "";
    const referrer = req.headers.referer || req.headers.referrer || "No referer";
    const userAgent = req.headers["user-agent"];
    const responseTime = getResponseTime(req, res) || "";

    return `${ip} - '${method} ${url} HTTP/${httpVersion}' ${status} ${contentLength} '${referrer}' '${userAgent}' ` +
        `- ${responseTime}ms`;
}

/**
 * Request logger middleware
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @param {Function} next the next callback function
 * @return {void}
 */
const middleware = function(req, res, next) {
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
        const message = formatMessage(req, res);
        const logger = req.app.logger.get("AKYUU");
        logger.info(message);
    }

    // record response start
    onHeaders(res, recordStartTime);

    // log when response finished
    onFinished(res, logRequest);

    next();
};

class RequestLogger {
    constructor(akyuu) {
        this.akyuu = akyuu;
        this.position = akyuu.PLUGIN_POS.BEFORE_CONTROLLER;
    }

    plug() {
        this.akyuu.use(middleware);
    }
}

/**
 * create
 * @param {Akyuu} akyuu the parent akyuu object
 * @param {Object} options the options object
 * @returns {RequestLogger} the request logger plugin
 */
exports.create = function(akyuu, options) {
    return new RequestLogger(akyuu, options);
};
