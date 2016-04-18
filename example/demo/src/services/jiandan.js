/**
 * XadillaX created at 2016-04-18 18:24:26 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

const cheerio = require("cheerio");

const HTTP = require("../../../../").Service.HTTP;

/**
 * @class JiandanXXOO
 */
class JiandanXXOO extends HTTP {
    /**
     * @constructor
     */
    constructor() {
        super("http://jandan.net/ooxx");
    }

    /**
     * wrapResponse
     * @param {String} content the content string
     * @param {Object} header the response header
     * @param {Number} status the response status
     */
    wrapResponse(content, header, status) {
        if(status !== 200) {
            return new Error(`Wrong status code ${status} of OOXX.`);
        }

        const $ = cheerio.load(content);

        let currentPage = $(".current-comment-page").text();
        if(!currentPage) return new Error(`Wrong OOXX response. ${content}`);

        currentPage = currentPage.split("]")[0].substr(1);

        const list = [];
        $("ol.commentlist > li").each(function() {
            if($(this).attr("id") === "adsense") return;

            const author = $(this).find(".author strong").text();
            const commentId = parseInt($(this).attr("id").substr(8));
            const image = $(this).find(".view_img_link").attr("href");

            list.push({
                commentId: commentId,
                author: author,
                image: image
            });
        });

        return {
            page: parseInt(currentPage),
            list: list
        };
    }

    /**
     * getOOXX
     * @param {Number} [page] the ooxx page
     * @param {Function} callback the callback function
     */
    getOOXX(page, callback) {
        if(typeof page === "function") {
            callback = page;
            page = null;
        }

        var router = "";
        if(page) router += ("/page-" + page);

        this.get(router, function(err, result) {
            return callback(err, result);
        });
    }
}

module.exports = JiandanXXOO;
