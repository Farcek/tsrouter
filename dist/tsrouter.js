"use strict";
var Promise = require("bluebird");
var TSHandler = (function () {
    function TSHandler(options) {
    }
    TSHandler.prototype.handler = function () {
        var _this = this;
        return function (req, res) {
            var param = _this.req(req);
            Promise.resolve(param)
                .then(function (param) {
                var validation = _this.valid(param, req);
                return Promise.resolve(validation)
                    .then(function (valid) {
                    if (valid) {
                        return _this.res(param, res);
                    }
                    throw new Error("validation error");
                })
                    .then(function (result) {
                    res.json(result);
                });
            });
        };
    };
    return TSHandler;
}());
exports.TSHandler = TSHandler;
