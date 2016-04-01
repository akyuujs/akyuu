/**
 * XadillaX created at 2016-04-01 15:08:47 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var errorTemplate = {
    code: {
        message: "The error code",
        required: true
    },
    captureStackTrace: {
        message: "Whether capture error stack or not",
        required: false,
        default: true
    },
    status: {
        message: "HTTP status code",
        default: 500,
        required: false
    },
    logLevel: {
        message: "The level for your logging message",
        required: false,
        default: "error"
    },
    business: {
        message: "business message to be shown",
        required: true
    }
};

module.exports = errorTemplate;
