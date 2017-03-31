/**
 * Created by fei on 2017/03/29.
 */

'use strict';

var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var async = require('async');

var Boot = function(akyuu) {
    this.akyuu = akyuu;
    this.logger = akyuu.logger.get('boot-loader');
    this.dir = path.resolve(akyuu.projectRoot, 'boots');
    this.tasks = [];
}

Boot.prototype._loadTasks = function(dir) {
    var _this = this;
    var tasks = [];
    var stat;
    try {
        stat = fs.statSync(dir);
    } catch (error) {
        return tasks;
    }

    if(!stat.isDirectory()) {
        return tasks;
    } else {
        var files;
        try {
            files = fs.readdirSync(dir);
        } catch (error) {
            throw(error);
        }

        for(var i = 0; i < files.length; i++) {
            var filePath = path.resolve(dir, files[i]);
            var stat = fs.statSync(filePath);
            if(stat.isDirectory()) {
                tasks = tasks.concat(_this._loadTasks(filePath));
            } else {
                if(!files[i].endsWith('.js')) continue;

                tasks.push({
                    name: path.basename(files[i]),
                    path: filePath,
                    beforeInit: require(filePath).beforeInit,
                    function: require(filePath).boot
                });
            }
        }

        return tasks;
    }
}

Boot.prototype.load = function(beforeInit, callback) {
    var _this = this;
    var tasks;
    try {
        tasks = this._loadTasks(this.dir);
    } catch(error) {
        _this.logger.error(error);
        return process.exit(1);
    }

    var results = [];
    async.eachLimit(tasks, 10, function(task, callback) {
        if(!!task.beforeInit !== beforeInit) return process.nextTick(function() { return callback(); });

        if(task.function.length > 1) {
            task.function(_this.akyuu, function(error, result) {
                if(error) {
                    return callback(error);
                }
                _this.logger.info('Boot task `' + task.name + '` run success.');
                if(result) results.push({ name: task.name, result: result });
                return callback();
            })
        } else {
            try {
                var result = task.function(_this.akyuu);
                _this.logger.info('Boot task `' + task.name + '` run success.');
                if(result) results.push({ name: task.name, result: result });
                return process.nextTick(function () { return callback(null, result); })
            } catch(error) {
                _this.logger.error('Boot task `' + task.name + '` run error.');
                return process.nextTick(function () { return callback(error); })
            }
        }
    }, function(error) {
        if(error) {
            _this.logger.error(error);
            return callback(error);
        }

        return callback(null, results);
    });
}

module.exports = Boot;
