import * as express from "express";
import * as Promise from "bluebird";


export namespace TSRouter {

    export interface IRoute<IPram,IResult> {
        parse?:IParser<IPram>;
        valid?:IValidator<IPram>;
        process:IProcess<IPram,IResult>;
    }
    export interface IRouteBasicParam<IResult> {
        process:IProcessBasicParam<IResult>;
    }
    export interface IRouteBasicResult<IParam> {
        parse?:IParser<IParam>;
        valid?:IValidator<IParam>;
        process:IProcessBasicResult<IParam>;
    }
    export interface IParser<IParam> {
        (req:express.Request):IParam | Promise<IParam>;
    }
    export interface IValidator<IParam> {
        (param:IParam):boolean | Promise<boolean>;
    }
    export interface IProcess<IParam,IResult> {
        (param:IParam):IResult | Promise<IResult>;
    }
    export interface IProcessBasicParam<IResult> {
        (req:express.Request):IResult | Promise<IResult>;
    }
    export interface IProcessBasicResult<IParam> {
        (param:IParam):any;
    }
}


export class Router<IPram, IResult> {
    constructor(private router:TSRouter.IRoute<IPram,IResult>) {

    }

    public handler():express.RequestHandler {

        return (req:express.Request, res:express.Response) => {

            var rParams = null;

            if (this.router.parse) {
                rParams = this.router.parse(req);
            }

            Promise.resolve(rParams)
                .then(params => {
                    let rValid:boolean | Promise<boolean> = true;
                    if (this.router.valid) {
                        rValid = this.router.valid(params);
                    }
                    return Promise.resolve(rValid)
                        .then(valid => {
                            return {
                                valid: valid,
                                params: params
                            }
                        })
                })
                .then(r => {
                    if (r.valid) {
                        return this.router.process(r.params);
                    }
                    throw new Error("validation error");
                })
                .then(result => {
                    res.json(result);
                })
        }


    }
}

export class ProcessBasicResult<IParam> extends Router<IParam,{}> {

}

export class RouteBasicParam<IResult> {
    constructor(private router:TSRouter.IRouteBasicParam<IResult>) {

    }

    public handler():express.RequestHandler {
        return (req:express.Request, res:express.Response) => {
            var rResult = this.router.process(req);

            Promise.resolve(rResult)
                .then(result => {
                    res.json(result);
                })
        };
    }
}


export abstract class TSHandler<IParam, IResult> {

    req(req:express.Request):IParam | Promise<IParam> {
        return null;
    }

    valid(param:IParam, req:express.Request):boolean | Promise<boolean> {
        return true;
    }

    abstract res(param:IParam, res:express.Response):IResult | Promise<IResult>;

    public handler():express.RequestHandler {
        return (req:express.Request, res:express.Response, next) => {
            let param = this.req(req);

            Promise.resolve(param)
                .then(param => {
                    let validation = this.valid(param, req);

                    return Promise.resolve(validation)
                        .then(valid => {
                            if (valid) {
                                return this.res(param, res);
                            }
                            throw new Error("validation error");
                        })
                        .then((result)=> {
                            res.json(result);
                        })
                        .catch(err => {
                            next(err);
                        })
                })
        }
    }
}