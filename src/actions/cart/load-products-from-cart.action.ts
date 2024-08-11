import type { CartItem } from '@/interfaces/cart-item';
import { getImagePath } from '@/utils';
import { defineAction, z } from 'astro:actions';
import { db, eq, inArray, Product, ProductImage} from 'astro:db';

export const loadProductsFromCart = defineAction({
  accept: 'json',
  input: z.any(),
  handler: async (cookies,context ) => {
    //get all cookies
    const cart = JSON.parse(cookies.value ?? '[]') as CartItem[];

    if (cart.length === 0 || !cart) return [];

    //Load products from cart
    const productIds = cart.map((item) => item.productId);
    const dbProducts = await db
      .select()
      .from(Product)
      .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
      .where(inArray(Product.id, productIds));


    return cart.map((item) => {
      const dbProduct = dbProducts.find((p) => p.Product.id === item.productId);
      if(!dbProduct){
        throw new Error(`Product with id ${item.productId} not found`);
      } 
      const {title, price, slug} = dbProduct.Product;
      const image = dbProduct.ProductImage.image;


      return {
        productId: item.productId,
        title: title,
        size: item.size,
        quantity: item.quantity,
        image: getImagePath(image),
        price: price,
        slug:  slug,
      };
    });
  },
});
