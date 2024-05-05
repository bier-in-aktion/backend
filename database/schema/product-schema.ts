import { bigint, boolean, pgTable, serial, smallint, varchar } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    uuid: varchar('uuid').unique(),
    name: varchar('name'),
    store: varchar('store'),
    basePrice: bigint('base_price', { mode: 'number' }),
    discountPercentage: smallint('discount_percentage'),
    discountedPrice: bigint('discounted_price', { mode: 'number' }),
    isDiscounted: boolean('is_discounted'),
    imageUrl: varchar('image_url'),
    validityStart: bigint('validity_start', { mode: 'number' }),
    validityEnd: bigint('validity_end', { mode: 'number' }),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
