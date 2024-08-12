import { ImageUpload } from '@/utils/image-upload';
import { defineAction, z } from 'astro:actions';
import { db, eq, Product, ProductImage } from 'astro:db';
import { getSession } from 'auth-astro/server';
import { v4 as UUID } from 'uuid';

const MAX_FILE_SIZE = 5_000_000; // 5MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
];

export const createUpdateProduct = defineAction({
  accept: 'form',
  input: z.object({
    id: z.string().optional(),
    stock: z.number(),
    slug: z.string(),
    price: z.number(),
    sizes: z.string(),
    type: z.string(),
    tags: z.string(),
    title: z.string(),
    description: z.string(),
    gender: z.string(),

    //TODO: Image
    imageFiles: z
      .array(
        z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
          .refine((file) => {
            if (file.size === 0) return true;

            return ALLOWED_FILE_TYPES.includes(file.type);
          }, `Only supported image files are valid. Supported types are: ${ALLOWED_FILE_TYPES.join(', ')}`)
      )
      .optional(),
  }),
  handler: async (form, { request }) => {
    // console.log(request);
    const session = await getSession(request);
    const user = session?.user;

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { id = UUID(), imageFiles, ...rest } = form;
    rest.slug = rest.slug.toLowerCase().replaceAll(' ', '-').trim();
    const product = {
      id: id,
      user: user.id!,
      ...rest,
    };

    const queries: any = [];

    if (!form.id) {
      queries.push(db.insert(Product).values(product));
    } else {
      queries.push(db.update(Product).set(product).where(eq(Product.id, id)));
    }

    //? Images
    const secureUrls: string[] = [];

    if (
      form.imageFiles &&
      form.imageFiles.length > 0 &&
      form.imageFiles[0].size > 0
    ) {
      const urls = await Promise.all(
        form.imageFiles.map( (imageFile) => ImageUpload.upload(imageFile))
      );

      secureUrls.push(...urls);
    }

    secureUrls.forEach((imageUrl) => {
      const imageObject = {
        id: UUID(),
        productId: product.id,
        image: imageUrl,
      };

      queries.push(db.insert(ProductImage).values(imageObject));
    });
    // imageFiles?.forEach(async (imageFile) => {
    //   if (imageFile.size <= 0) return;

    //   const url = await ImageUpload.upload(imageFile);
    // });

    await db.batch(queries);

    return product;
  },
});
