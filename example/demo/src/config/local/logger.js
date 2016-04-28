"use strict";

/**
 * 配置基本与 winston 相同
 *     1. formatter: 可以为字符串，对应内置的 format 格式
 *     2. type: transport 类型 ['file', 'console']
 */
module.exports = [
    {
        type: "file",
        json: false,
        filename: "akyuu.log",
        formatter: "default"
    }
];
