import { AsyncContainerModule } from 'inversify';
import TYPES from './inversify.types';
import { ProductService } from '../service/product-service';
import { initializeDataSource } from '../database/database';

export const BINDINGS = new AsyncContainerModule (
    async bind => {
        await initializeDataSource();

        await require('../controller/product-controller');

        bind<ProductService>(TYPES.ProductService).to(ProductService).inSingletonScope();
    }
);
