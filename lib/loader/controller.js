/**
 * XadillaX created at 2016-04-01 10:53:39 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const _ = require("lodash");
const express = require("express");

const Validator = require("../middware/validator");

class Controller {
    constructor(akyuu) {
        this.akyuu = akyuu;
    }

    loadController(root, descriptor) {
        const router = express.Router({ // eslint-disable-line
            caseSensitive: true
        });

        const _root = root;
        root = root.substr(0, root.length - 3);
        if(_.endsWith(root, "/index")) {
            root = root.substr(0, root.length - 6);
        }

        // check router & processors
        this.check(descriptor);

        descriptor.forEach(function(item) {
            const method = (item.method || "GET").toLowerCase();
            const routerStr = item.router;
            const prcssrs =
                item.processors.reduce(function(_prcssrs, prcssr) {
                    _prcssrs.push(prcssr);
                    return _prcssrs;
                }, []);

            if(item.query && Object.keys(item.query).length) {
                prcssrs.unshift(Validator.query.bind(null, item.query));
            }

            if(item.body && Object.keys(item.body).length) {
                prcssrs.unshift(Validator.body.bind(null, item.body));
            }

            if(item.params && Object.keys(item.params).length) {
                prcssrs.unshift(Validator.params.bind(null, item.params));
            }

            router[method].apply(router, [ routerStr ].concat(prcssrs));
        });

        this.akyuu.use(root, router);

        this.logger.info(`File \`${_root}\` loaded.`);
    }

    load(file) {
        if(!this.logger) {
            this.logger = this.akyuu.logger.get("controller-loader");
        }

        const directory = path.join(`${this.akyuu.projectRoot}/controllers`, file);
        const filenames = fs.readdirSync(directory);

        let index = false;
        for(let i = 0; i < filenames.length; i++) {
            const stat = fs.statSync(`${directory}/${filenames[i]}`);

            if(stat.isDirectory()) {
                this.load(`${file}/${filenames[i]}`);
            } else if(filenames[i] === "index.js") {
                index = true;
            } else if(filenames[i].endsWith(".js")) {
                this.loadController(`${file}/${filenames[i]}`, require(`${directory}/${filenames[i]}`));
            }
        }

        if(index) {
            this.loadController(`${file}/index.js`, require(`${directory}/index.js`));
        }

        this.logger.info(`Directory \`${file}\` loaded.`);
    }

    check(descriptor) {
        descriptor.forEach(function(item) {
            // check router
            const routerStr = item.router;
            if(typeof routerStr !== "string" && !(routerStr instanceof RegExp)) {
                throw new Error(`router expect string but get ${typeof routerStr}`);
            }

            if(typeof routerStr === "string" && routerStr.trim() === "") {
                throw new Error("router can not fill blank str");
            }

            // check processors
            const processors = item.processors;
            if(!Array.isArray(processors)) {
                throw new Error(`processors expect array but get ${typeof processors}`);
            }

            processors.forEach(function(processor) {
                if(typeof processor !== "function") {
                    throw new Error(`the router ${routerStr} expect function processor but get ${typeof processor}`);
                }
            });
        });
    }
}

module.exports = Controller;
