class AsyncPlugin {
    constructor(akyuu) {
        this.akyuu = akyuu;
        this.position = akyuu.PLUGIN_POS.BEFORE_CONTROLLER;
    }

    plug(callback) {
        const self = this;
        setTimeout(function() {
            self.akyuu.get("/async_plugin", function(req, resp) {
                resp.succ("success-load-sync-plugin");
            });
            callback();
        }, 500);
    }
}

exports.create = function(akyuu, options) {
    return new AsyncPlugin(akyuu, options);
};
