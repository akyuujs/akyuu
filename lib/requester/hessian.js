/**
 * XadillaX created at 2016-04-18 16:47:30 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const spidex = require("spidex");

const Errors = require("../error/predefinition");

class HessianRequester {
    constructor(host, port, options) {
        this.baseUri = `http://${host}:${port}/`;
        this.options = Object.merge(options || {}, {
            timeout: 60000,
            requestTimeout: 60000,
            responseTimeout: 60000
        });

        this.headers = {};
    }

    wrapResponse(response) {
        return response;
    }

    request(router, methodName) {
        const args = Array.prototype.slice.call(arguments);
        args.shift(); args.shift();
        const callback = args.pop();

        while(router && router[0] === "/") router = router.substr(1);

        const self = this;
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
    }
}

module.exports = HessianRequester;
