CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" varchar,
	"name" varchar,
	"store" varchar,
	"base_price" bigint,
	"discount_percentage" smallint,
	"discounted_price" bigint,
	"is_discounted" boolean,
	"image_url" varchar,
	"validity_start" bigint,
	"validity_end" bigint,
	CONSTRAINT "products_uuid_unique" UNIQUE("uuid")
);
