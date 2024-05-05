import { controller, httpGet, request, response } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import TYPES from '../inversify/inversify.types';
import { ProductService } from '../service/product-service';
import { AbstractController } from './abstract-controller';

@controller('/api/product')
export class ProductController extends AbstractController {
    public constructor(@inject(TYPES.ProductService) private productService: ProductService) {
        super();
    }

    @httpGet('')
    public async getProducts(@request() req: Request, @response() res: Response) {
        try {
            const result = await this.productService.getProducts();

            res.json({ data: result, error: null });
        } catch (error) {
            this.handleError(req, res, error);
        }

        req.removeAllListeners('close');
    }
}
