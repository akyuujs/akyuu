/**
 * XadillaX created at 2016-04-01 15:13:51 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

module.exports = {
    Normal: {
        code: 10000,
        status: 500,
        logLevel: "error",
        business: "Server had came across a normal error."
    },

    QueryValidation: {
        code: 9001,
        status: 400,
        logLevel: "warn",
        business: "Query string validation failed."
    },

    BodyValidation: {
        code: 9002,
        status: 400,
        logLevel: "warn",
        business: "Body validation failed."
    },

    PathValidation: {
        code: 9003,
        status: 400,
        logLevel: "warn",
        business: "Router path validation failed."
    },

    NotFound: {
        code: 10001,
        status: 404,
        logLevel: "warn",
        business: "Resource you requested is not existed."
    },

    Forbidden: {
        code: 10002,
        status: 403,
        logLevel: "warn",
        business: "You have no permission to access for this resource."
    },

    ThirdParty: {
        code: 20000,
        status: 502,
        logLevel: "error",
        business: "Remote API server error."
    }
};
