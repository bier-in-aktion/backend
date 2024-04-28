import { controller, httpGet, request, response } from "inversify-express-utils";
import { Request, Response } from "express";

@controller('/api/test')
export class TestController {
    public constructor() {}

    @httpGet('')
    public getTest(@request() req: Request, @response() res: Response) {
        res.json({data: null});
    }
}
