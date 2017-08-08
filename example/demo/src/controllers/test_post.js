/**
 * Created by maple on 2017/8/7.
 */
"use strict";

const akyuu = require("../../../../");
const HTTP = akyuu.Service.HTTP;

const routers = [];

routers.push({
    router: "/",
    method: "POST",
    processors: [
        function(req, resp) {
            const time = req.body.time;

            resp.succ({
                text: `this is a post body and get time is ${time}`
            });
        }
    ]
});

routers.push({
    router: "/",
    method: "GET",
    processors: [
        function(req, resp) {
            const http = new HTTP(`http://127.0.0.1:${akyuu.config.server.port}`);

            http.post("/test_post", { time: Date() }, function(err, result) {
                if(err) {
                    resp.error(err);
                    return;
                }
                resp.succ({
                    text: "get body from post",
                    bodyText: result
                });
            });
        }
    ]
});

module.exports = routers;
