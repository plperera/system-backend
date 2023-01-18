import { Request, Response } from "express";

function test(req: Request, res: Response) {

    let {value} = req.params 
    return res.send(value)
}

export {test}