declare module "tsrouter" {
    import * as express from "express";
    import * as Promise from "bluebird";
    export abstract class TSHandler<IPram, IResult> {
        constructor(options?: {
            alid: boolean;
        });
        abstract req(req: express.Request): IPram | Promise<IPram>;
        abstract valid(param: IPram, req: express.Request): boolean | Promise<boolean>;
        abstract res(param: IPram, res: express.Response): IResult | Promise<IResult>;
        handler(): express.RequestHandler;
    }
}