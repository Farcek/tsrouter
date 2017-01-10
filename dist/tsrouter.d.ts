import * as express from "express";
export declare namespace TSRouter {
    interface IRoute<IPram, IResult> {
        parse?: IParser<IPram>;
        valid?: IValidator<IPram>;
        process: IProcess<IPram, IResult>;
    }
    interface IRouteBasicParam<IResult> {
        process: IProcessBasicParam<IResult>;
    }
    interface IRouteBasicResult<IParam> {
        parse?: IParser<IParam>;
        valid?: IValidator<IParam>;
        process: IProcessBasicResult<IParam>;
    }
    interface IParser<IParam> {
        (req: express.Request): IParam | Promise<IParam>;
    }
    interface IValidator<IParam> {
        (param: IParam): boolean | Promise<boolean>;
    }
    interface IProcess<IParam, IResult> {
        (param: IParam): IResult | Promise<IResult>;
    }
    interface IProcessBasicParam<IResult> {
        (req: express.Request): IResult | Promise<IResult>;
    }
    interface IProcessBasicResult<IParam> {
        (param: IParam): any;
    }
}
export declare class Router<IPram, IResult> {
    private router;
    constructor(router: TSRouter.IRoute<IPram, IResult>);
    handler(): express.RequestHandler;
}
export declare class ProcessBasicResult<IParam> extends Router<IParam, {}> {
}
export declare class RouteBasicParam<IResult> {
    private router;
    constructor(router: TSRouter.IRouteBasicParam<IResult>);
    handler(): express.RequestHandler;
}
export declare abstract class TSHandler<IParam, IResult> {
    req(req: express.Request): IParam | Promise<IParam>;
    valid(param: IParam, req: express.Request): boolean | Promise<boolean>;
    abstract res(param: IParam, res: express.Response): IResult | Promise<IResult>;
    handler(): express.RequestHandler;
}
export interface IRouter<IParam, IResult> {
    parse?(req?: express.Request): IParam | Promise<IParam>;
    valid?(param: IParam, req: express.Request): boolean | Promise<boolean>;
    response?(res: express.Response, result: IResult, param: IParam): void;
    process(param?: IParam): IResult | Promise<IResult>;
}
export declare function buildRouter<IParam, IResult>(src: IRouter<IParam, IResult>): express.RequestHandler;
export declare abstract class ExpressRouter<IRequest extends express.Request, IResult> {
    abstract process(req: IRequest): IResult | Promise<IResult>;
    valid(req: IRequest): void | Promise<void>;
    handler(): express.RequestHandler;
    response(result: IResult, req: IRequest, res: express.Response, next: express.NextFunction): void;
}
export interface IExpressRoute<IRequest extends express.Request, IResult> {
    check?(req: IRequest): void | Promise<void>;
    action(req: IRequest): IResult | Promise<IResult>;
    resp?(res: express.Response, result: IResult, req: IRequest): void;
}
export declare function buildExpressRoute(route: IExpressRoute<any, any>): express.RequestHandler;
