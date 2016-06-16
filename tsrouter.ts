import * as express from "express";
import * as Promise from "bluebird";

export abstract class TSHandler<IPram, IResult> {
    constructor(options?: { alid: boolean }) {

    }

    abstract req(req: express.Request): IPram | Promise<IPram>;
    abstract valid(param: IPram, req: express.Request): boolean | Promise<boolean>;
    abstract res(param: IPram, res: express.Response): IResult | Promise<IResult>;

    public handler(): express.RequestHandler {
        return (req: express.Request, res: express.Response) => {
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
                        .then((result)=>{
                            res.json(result);
                        })
                })
        }
    }
}