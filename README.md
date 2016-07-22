TS router
----------


#### mode 1

````javascript
    import * as  tsrouter from "tsrouter";
    

    type IParam = sysopapi.category.edit.IParam;
    type IResult = sysopapi.category.edit.IResult;

    export default class Edit extends tsrouter.TSHandler<IParam, IResult> {

        public req(req: express.Request): IParam | Promise<IParam> {
            ...
        }

        public valid(param: IParam, req: express.Request): boolean | Promise<boolean> {
            ...
        }

        public res(param: IParam, res: express.Response): IResult | Promise<IResult> {
            ...
        }
    }
````

#### model 2

````javascript

    type IParam = sysopapi.category.create.IParam;
    type IResult = sysopapi.category.create.IResult;
    
    export const create = new tsrouter.Router<IParam,IResult>({
        parse: req => {
            return {
                name: req.body.name
            }
        },
        valid: params => {
            return !lodash.isEmpty(params.name);
        },
        process: params => {
            return model.nextId(model.GiftCategory)
                .then(newId => {
    
                    return model.GiftCategory.create({
                        id: newId,
                        name: params.name
                    })
                })
    
                .then(() => {
                    return {
                        status: "ok"
                    }
                })
        }
    });
    
````
#### model RouteBasicParam

````javascript

    export const NewId = new tsrouter.RouteBasicParam<sysopapi.core.INextId>({
            process: () => {
                return model.nextId(model.Customer)
                    .then(id => {
                        return {
                            id: id
                        };
                    });
            }
        });
    
````




    