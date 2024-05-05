import { injectable } from 'inversify';
import { Request, Response } from 'express';
import Logger from '../logger/logger';

@injectable()
export abstract class AbstractController {
    protected CANCEL_REQUEST = 'CANCEL_REQUEST';

    protected handleError(req: Request, res: Response, error: any) {
        if (error != this.CANCEL_REQUEST) {
            let errorText: string = this.resolveError(error);
            this.logError(req, errorText);
            res.json({ data: null, error: errorText });
        }
    }

    private logError(req: Request, str: string): void {
        Logger.error(((req != null) ? req.url : '') + ' ' + str);
    }
    
    private resolveError(error: any): string {
        if (error == null)
            return 'ERROR_UNKNOWN';

        if (typeof (error) == 'object') {
            let name: string = (error.name != null) ? error.name.toUpperCase() : '';
            let message: string = (error.message != null) ? error.message : '';

            // when name is not present or is just basic Error, and we have a message, use message as name
            if ((name == '' || name == 'ERROR') && message != '')
                return error.message.toString();

            // when we have an error name
            if (name != '') {
                if (name == 'QUERYFAILEDERROR')
                    name = 'ERROR_QUERY_FAILED';

                // append message if found
                if (message != '')
                    return error.name + ' ' + error.message;
                else
                    return error.name;
            } else
                return error.toString();
        }

        // probably an error string
        return error.toString();
    }
}
