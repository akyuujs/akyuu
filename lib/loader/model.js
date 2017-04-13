/**
 * XadillaX created at 2016-04-18 10:34:39 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const _ = require("lodash");

class Model {
    constructor(akyuu) {
        this.akyuu = akyuu;
        this.models = {};
    }

    load(file) {
        if(!this.logger) {
            this.logger = this.akyuu.logger.get("model-loader");
        }

        const directory = path.join(`${this.akyuu.projectRoot}/models`, file);

        let filenames;
        try {
            filenames = fs.readdirSync(directory);
        } catch(e) {
            return;
        }

        for(let i = 0; i < filenames.length; i++) {
            const stat = fs.statSync(`${directory}/${filenames[i]}`);
            if(stat.isDirectory()) {
                this.load(`${file}/${filenames[i]}`);
            } else if(_.endsWith(filenames[i], ".js")) {
                const modelName = _.upperFirst(_.camelCase(filenames[i].substr(0, filenames[i].length - 3)));
                this.models[modelName] = require(`${directory}/${filenames[i]}`);
                this.logger.info(`Model \`${modelName}\` loaded.`);
            }
        }
    }

    get(name) {
        name = _.upperFirst(_.camelCase(name));
        if(this.models[name]) return this.models[name];

        try {
            this.models[name] = require(`models/${_.snakeCase(name)}`);
        } catch(e) {
            throw e;
        }

        return this.models[name];
    }
}

module.exports = Model;
