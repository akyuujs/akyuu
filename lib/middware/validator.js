/**
 * XadillaX created at 2016-04-01 14:26:44 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var Joi = require("joi");

/**
 * query
 * @param {Object} validator the validate object
 * @param {Request} req the request object
 * @param {Response} resp the response object
 * @param {Function} next the next function
 */
exports.query = function(validator, req, resp, next) {
    validator = Joi.object().keys(validator).unknown();
    Joi.validate(req.query, validator, function(err, value) {
        if(!err) {
            req.query = value;
            return next();
        }

        resp.error(new req.app.Errors.QueryValidation(err));
    });
};

/**
 * body
 * @param {Object} validator the validate object
 * @param {Request} req the request object
 * @param {Response} resp the response object
 * @param {Function} next the next function
 */
exports.body = function(validator, req, resp, next) {
    validator = Joi.object().keys(validator).unknown();
    Joi.validate(req.body, validator, function(err, value) {
        if(!err) {
            req.body = value;
            return next();
        }

        resp.error(new req.app.Errors.BodyValidation(err));
    });
};

/**
 * params
 * @param {Object} validator the validate object
 * @param {Request} req the request object
 * @param {Response} resp the response object
 * @param {Function} next the next function
 */
exports.params = function(validator, req, resp, next) {
    validator = Joi.object().keys(validator).unknown();
    Joi.validate(req.params, validator, function(err, value) {
        if(!err) {
            req.params = value;
            return next();
        }

        resp.error(new req.app.Errors.PathValidation(err));
    });
};
