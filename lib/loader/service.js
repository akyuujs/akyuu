/**
 * XadillaX created at 2016-04-18 17:34:39 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const _ = require("lodash");
const Case = require("case");

class Service {
    constructor(akyuu) {
        this.akyuu = akyuu;

        this.services = {};
        this.serviceClasses = {};
    }

    load(file) {
        if(!this.logger) {
            this.logger = this.akyuu.logger.get("service-loader");
        }

        const directory = path.join(`${this.akyuu.projectRoot}/services`, file);
        const filenames = fs.readdirSync(directory);

        for(let i = 0; i < filenames.length; i++) {
            const stat = fs.statSync(`${directory}/${filenames[i]}`);
            if(stat.isDirectory()) {
                this.load(`${file}/${filenames[i]}`);
            } else if(_.endsWith(filenames[i], ".js")) {
                const apiName = filenames[i].substr(0, filenames[i].length - 3).toLowerCase();

                const apiClass = require(`${directory}/${filenames[i]}`);
                const apiClassInstance = new apiClass();
                let apiClassName = apiClassInstance.constructor.name;
                apiClassName = Case.snake(apiClassName);

                this.services[apiClassName] = apiClassInstance;
                this.serviceClasses[apiClassName] = apiClass;
                this.logger.info(`Service \`${apiName}\` loaded.`);
            }
        }
    }

    get(name) {
        name = name.toLowerCase();
        if(this.services[name]) return this.services[name];
        throw new Error(`No such service ${name}.`);
    }

    getClass(name) {
        name = name.toLowerCase();
        if(this.serviceClasses[name]) return this.serviceClasses[name];
        throw new Error(`No such API ${name}.`);
    }
}

module.exports = Service;
