"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Router = (function () {
    function Router(router) {
        this.router = router;
    }
    Router.prototype.handler = function () {
        var _this = this;
        return function (req, res, next) {
            var rParams = null;
            if (_this.router.parse) {
                rParams = _this.router.parse(req);
            }
            Promise.resolve(rParams)
                .then(function (params) {
                var rValid = true;
                if (_this.router.valid) {
                    rValid = _this.router.valid(params);
                }
                return Promise.resolve(rValid)
                    .then(function (valid) {
                    return {
                        valid: valid,
                        params: params
                    };
                });
            })
                .then(function (r) {
                if (r.valid) {
                    return _this.router.process(r.params);
                }
                throw new Error("validation error");
            })
                .then(function (result) {
                res.json(result);
            })
                .catch(function (err) {
                next(err);
            });
        };
    };
    return Router;
}());
exports.Router = Router;
var ProcessBasicResult = (function (_super) {
    __extends(ProcessBasicResult, _super);
    function ProcessBasicResult() {
        _super.apply(this, arguments);
    }
    return ProcessBasicResult;
}(Router));
exports.ProcessBasicResult = ProcessBasicResult;
var RouteBasicParam = (function () {
    function RouteBasicParam(router) {
        this.router = router;
    }
    RouteBasicParam.prototype.handler = function () {
        var _this = this;
        return function (req, res, next) {
            var rResult = _this.router.process(req);
            Promise.resolve(rResult)
                .then(function (result) {
                res.json(result);
            })
                .catch(function (err) {
                next(err);
            });
        };
    };
    return RouteBasicParam;
}());
exports.RouteBasicParam = RouteBasicParam;
var TSHandler = (function () {
    function TSHandler() {
    }
    TSHandler.prototype.req = function (req) {
        return null;
    };
    TSHandler.prototype.valid = function (param, req) {
        return true;
    };
    TSHandler.prototype.handler = function () {
        var _this = this;
        return function (req, res, next) {
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
                })
                    .catch(function (err) {
                    next(err);
                });
            });
        };
    };
    return TSHandler;
}());
exports.TSHandler = TSHandler;
function buildRouter(src) {
    return function (req, res, next) {
        var rParams = null;
        if (typeof src.parse === 'function') {
            rParams = src.parse(req);
        }
        Promise.resolve(rParams)
            .then(function (params) {
            var rValid = true;
            if (typeof src.valid === 'function') {
                rValid = src.valid(params, req);
            }
            return Promise.resolve(rValid)
                .then(function (valid) {
                if (valid) {
                    return src.process(params);
                }
                throw new Error("validation error");
            })
                .then(function (result) {
                if (src.response && typeof src.response === 'function') {
                    src.response(res, result, params);
                }
                else {
                    res.json(result);
                }
            });
        })
            .catch(function (err) {
            next(err);
        });
    };
}
exports.buildRouter = buildRouter;
var ExpressRouter = (function () {
    function ExpressRouter() {
    }
    ExpressRouter.prototype.valid = function (req) {
    };
    ExpressRouter.prototype.handler = function () {
        var _this = this;
        return function (req, res, next) {
            var validation = Promise.resolve(undefined);
            if (_this.valid && typeof (_this.valid) === 'function') {
                validation = Promise.resolve(_this.valid(req));
            }
            validation
                .then(function () {
                return _this.process(req);
            })
                .then(function (result) {
                _this.response(result, req, res, next);
            })
                .catch(function (err) {
                next(err);
            });
        };
    };
    ExpressRouter.prototype.response = function (result, req, res, next) {
        res.json(result);
    };
    return ExpressRouter;
}());
exports.ExpressRouter = ExpressRouter;
function buildExpressRoute(route) {
    return function (req, res, next) {
        var validation = Promise.resolve();
        if (route.check && typeof (route.check) === 'function') {
            validation = Promise.resolve(route.check(req));
        }
        validation
            .then(function () {
            return route.action(req);
        })
            .then(function (result) {
            if (route.resp && typeof (route.resp) === 'function') {
                route.resp(res, result, req);
            }
            else {
                res.json(result);
            }
        })
            .catch(function (err) {
            next(err);
        });
    };
}
exports.buildExpressRoute = buildExpressRoute;
