/**
 * XadillaX created at 2016-03-23 16:05:01 With ♥
 *
 * Copyright (c) 2016 akyuu.moe, all rights
 * reserved.
 */
"use strict";

var req = require("../../lib/require");

describe("require", function() {
    before(function() {
        req.addRequirePath(__dirname);
    });

    it("should add require path", function() {
        req.addRequirePath(__dirname + "/a");
        req.paths.length.should.be.eql(2);
        req.paths[1].should.be.eql(__dirname + "/a");
    });

    it("should remove require path", function() {
        req.removeRequirePath(__dirname + "/a");
        req.paths.length.should.be.eql(1);
        req.paths[0].should.be.eql(__dirname);
    });

    describe("let's require", function() {
        it("should require test_require.js", function() {
            var test = require("test_require");
            test.should.be.eql(__dirname);
        });

        it("should require ./test_require.js", function() {
        });
    });
});
