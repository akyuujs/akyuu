var config = require("config");
var fs = require("fs");
var path = require("path");

require("sugar");

var core;

try {
    core = require("/Users/xadillax/Workspace/akyuujs/akyuu/example/demo/src/config/.js");
} catch(e) {
    core = {};
}

var dir = "/Users/xadillax/Workspace/akyuujs/akyuu/example/demo/src/config/.js";
var dirs;
try {
    dirs = fs.readdirSync(dir);
} catch(e) {
    dirs = [];
}

for(var i = 0; i < dirs.length; i++) {
    var stat;
    var realDir = path.join(dir, dirs[i]);
    try {
        stat = fs.statSync(realDir);
    } catch(e) {
        continue;
    }

    if(!stat) continue;

    if(stat.isFile()) {
        if(realDir.endsWith("/index.js") || realDir.endsWith("/index.json")) {
            core = Object.merge(core, require(realDir), true, true);
        } else if(realDir.endsWith(".js") || realDir.endsWith(".json")) {
            var filename = realDir.endsWith(".js") ?
                (dirs[i].substr(0, dirs[i].length - 3)) :
                (dirs[i].substr(0, dirs[i].length - 5));

            var temp = {};
            temp[filename] = require(realDir);
            core = Object.merge(core, temp, true, true);
        }
    }
}

module.exports = core;
