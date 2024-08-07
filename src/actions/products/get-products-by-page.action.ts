import { defineAction, z } from 'astro:actions';
import { count, db, Product, ProductImage, sql } from 'astro:db';

import type { ProductWithImages } from '@/interfaces';

export const getProductsByPage = defineAction({
  accept: 'json',
  input: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(12),
  }),
  handler: async ({ page, limit }) => {
    // Get products by page
    page = page <= 0 ? 1 : page;
    const [totalRecords] = await db.select({ count: count() }).from(Product);
    const totalPages = Math.ceil(totalRecords.count / limit);

    if (page > totalPages) {
      return {
        products: [] as ProductWithImages[],
        totalPages: totalPages,
      };
    }

    const productsQuery = sql`
SELECT a.*, 
    (SELECT GROUP_CONCAT(image,',') FROM
        ( SELECT * FROM ${ProductImage} WHERE productId = a.id limit 2 ) 
            ) as images
        FROM ${Product} a
LIMIT ${limit} OFFSET ${(page - 1) * limit}
    `;

    const {rows } = await db.run(productsQuery);
    // const products = await db
    //   .select()
    //   .from(Product)
    //   .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
    //   .limit(limit)
    //   .offset((page - 1) * limit);

    return {
      products: rows as unknown as ProductWithImages[],
      totalPages,
    };
  },
});
