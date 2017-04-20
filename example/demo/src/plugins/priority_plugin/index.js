class PriorityPlugin {
    constructor(akyuu) {
        this.akyuu = akyuu;
        this.position = akyuu.PLUGIN_POS.BEFORE_CONTROLLER;
    }

    plug() {
    }
}

exports.create = function(akyuu, options) {
    return new PriorityPlugin(akyuu, options);
};
