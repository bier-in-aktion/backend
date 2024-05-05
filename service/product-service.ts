import { injectable } from 'inversify';
import { db } from '../database/database';
import { NewProduct, Product, products } from '../database/schema/product-schema';
import { count, eq } from 'drizzle-orm';
import Logger from '../logger/logger';
import { AVROProduct } from '../kafka/product-type';

@injectable()
export class ProductService {
    public async getProducts(): Promise<Product[]> {
        const result = await db.select().from(products);
        return result.map(product => {
            if (product.basePrice != null)
                product.basePrice = product.basePrice / 100;

            if (product.discountedPrice != null)
                product.discountedPrice = product.discountedPrice / 100;

            if (product.discountedPrice != null && product.basePrice != null)
                product.discountPercentage = 1 - (product.discountedPrice / product.basePrice);

            return product;
        });
    }

    public async addOrUpdateProduct(key: string, value: AVROProduct) {
        Logger.silly(`Adding product ${key}`);
        const product = this.convertToDBType(key, value);
        db.transaction(async tx => {
            const result = await tx.select({ count: count() }).from(products).where(eq(products.uuid, key));

            if (result[0].count > 0)
                await tx.update(products).set(product).where(eq(products.uuid, key));
            else
                await tx.insert(products).values(product);
        });
    }

    private convertToDBType(key: string, product: AVROProduct): NewProduct {
        let result: NewProduct = {
            uuid: key,
            store: key.split('-')[0],
            name: product.name?.replace('*', ''),
            isDiscounted: product.price?.discountPercentage != null,
            imageUrl: product.images[0],
        };

        if (result.isDiscounted) {
            result.basePrice = product.price?.crossed;
            result.discountPercentage = product.price?.discountPercentage;
            result.discountedPrice = product.price?.regular?.value;
            if (product.price?.validityStart != null)
                result.validityStart = Date.parse(product.price?.validityStart);
            if (product.price?.validityEnd != null)
                result.validityEnd = Date.parse(product.price?.validityEnd);
        } else {
            result.basePrice = product.price?.regular?.value;
            result.discountPercentage = null;
            result.discountedPrice = null;
        }

        return result;
    }
}
