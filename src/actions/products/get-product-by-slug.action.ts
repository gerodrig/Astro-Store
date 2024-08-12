import { defineAction, z } from 'astro:actions';
import { db, eq, Product, ProductImage } from 'astro:db';

const newProduct = {
  id: '',
  description: 'New description',
  gender: 'men',
  price: 10,
  sizes: 'XS,S,M',
  slug: 'new-product',
  stock: 5,
  tags: 'shirt,men,new',
  title: 'New Product',
  type: 'shirts',
};

export const getProductBySlug = defineAction({
  accept: 'json',
  input: z.string(),
  handler: async (slug) => {
    if (slug === 'new') {
      return {
        product: newProduct,
        images: [],
      };
    }

    const [product] = await db
      .select()
      .from(Product)
      .where(eq(Product.slug, slug));

    //? If product is not found, return exception
    if (!product) {
      throw new Error(`Product with slug ${slug} not found`);
    }

    const images = await db
      .select()
      .from(ProductImage)
      .where(eq(ProductImage.productId, product.id));

    return {
      product: product,
      images: images,
      // images: images.map((i) => i.image),
    };
  },
});
