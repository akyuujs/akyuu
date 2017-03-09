/**
 * XadillaX created at 2016-04-19 14:25:35 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var fs = require("fs");
var path = require("path");

require("sugar");

var configDir = process.env.NODE_CONFIG_DIR || path.join(require.main.filename, "..", "/config");
var currentDir = path.join(__dirname, "config");
process.env.NODE_CONFIG_DIR = currentDir;

var dirs;
try {
    dirs = fs.readdirSync(configDir);
} catch(e) {
    // ...
}
dirs = dirs || [];

var template = fs.readFileSync(__dirname + "/config/_template", { encoding: "utf8" });

for(var i = 0; i < dirs.length; i++) {
    var stat;
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

module.exports = require("config");

function copy(path, type) {
    var js = template.format({ path: path, type: type });
    fs.writeFileSync(__dirname + "/config/" + type + ".js", js, { encoding: "utf8" });
}
