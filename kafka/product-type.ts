export type Nullable<T> = T | null;

export type Brand = {
    name: Nullable<string>;
    slug: Nullable<string>;
};

export type Regular = {
    perStandardizedQuantity: Nullable<number>;
    tags: string[];
    value: Nullable<number>;
    promotionQuantity: Nullable<number>;
    promotionType: Nullable<string>;
    promotionValue: Nullable<number>;
    promotionValuePerStandardizedQuantity: Nullable<number>;
    promotionText: Nullable<string>;
};

export type Price = {
    baseUnitLong: Nullable<string>;
    baseUnitShort: Nullable<string>;
    basePriceFactor: Nullable<string>;
    regular: Nullable<Regular>;
    loyalty: Nullable<Regular>;
    validityStart: Nullable<string>;
    validityEnd: Nullable<string>;
    crossed: Nullable<number>;
    discountPercentage: Nullable<number>;
    lowestPrice: Nullable<number>;
};

export type Category = {
    key: Nullable<string>;
    name: Nullable<string>;
    slug: Nullable<string>;
    orderHint: Nullable<string>;
};

export type AVROProduct = {
    ageRequiredInMonths: Nullable<number>;
    amount: Nullable<string>;
    brand: Nullable<Brand>;
    category: Nullable<string>;
    depositType: Nullable<string>;
    descriptionShort: Nullable<string>;
    images: string[];
    name: Nullable<string>;
    packageLabel: Nullable<string>;
    packageLabelKey: Nullable<string>;
    parentCategories: Category[];
    price: Nullable<Price>;
    productId: Nullable<string>;
    medical: Nullable<boolean>;
    sku: Nullable<string>;
    slug: Nullable<string>;
    purchased: Nullable<boolean>;
    volumeLabelKey: Nullable<string>;
    volumeLabelLong: Nullable<string>;
    volumeLabelShort: Nullable<string>;
    weight: Nullable<number>;
    weightArticle: Nullable<boolean>;
    weightPieceArticle: Nullable<boolean>;
    weightPerPiece: Nullable<number>;
    productMarketing: Nullable<string>;
    maxQuantity: Nullable<number>;
    badges: string[];
    quantityStepSize: Nullable<number>;
    descriptionLong: Nullable<string>;
};
