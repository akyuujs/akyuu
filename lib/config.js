/**
 * XadillaX created at 2016-04-19 14:25:35 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const _ = require("lodash");

const template = fs.readFileSync(`${__dirname}/config/_template`, { encoding: "utf8" });
const currentDir = path.join(__dirname, "config");

function copy(_path, type) {
    const js = _.template(template)({ path: _path, type: type });
    fs.writeFileSync(`${__dirname}/config/${type}.js`, js, { encoding: "utf8" });
}

if(process.env.AKYUU_NO_GENERATE_CONFIG !== "true") {
    const configDir = process.env.NODE_CONFIG_DIR || path.join(require.main.filename, "..", "/config");

    let dirs;
    try {
        dirs = fs.readdirSync(configDir);
    } catch(e) {
        // ...
    }
    dirs = dirs || [];

    for(let i = 0; i < dirs.length; i++) {
        let stat;
        try {
            stat = fs.statSync(path.join(configDir, dirs[i]));
        } catch(e) {
            stat = null;
        }

        if(!stat) continue;
        if(stat.isDirectory()) {
            copy(configDir, dirs[i]);
        } else if(stat.isFile()) {
            if(dirs[i].endsWith(".js")) {
                copy(configDir, dirs[i].substr(dirs[i].length - 3));
            } else if(dirs[i].endsWith(".json")) {
                copy(configDir, dirs[i].substr(dirs[i].length - 5));
            }
        }
    }
}

process.env.NODE_CONFIG_DIR = currentDir;

module.exports = require("config");
