import { db, Product, ProductImage, Role, User } from 'astro:db';
import { v4 as UUID } from 'uuid';
import bcrypt from 'bcryptjs';
import { seedProducts } from './seed-data';

// https://astro.build/db/seed
export default async function seed() {
  const roles = [
    { id: 'admin', name: 'Administrator' },
    { id: 'user', name: 'User' },
    { id: 'superadmin', name: 'Super Administrator' },
  ];

  const benito = {
    id: 'ABC-123-BENITO', //UUID(),
    name: 'Benito Martinez',
    email: 'benito@google.com',
    password: bcrypt.hashSync('123456'),
    role: 'admin',
  };

  const mimi = {
    id: 'ABC-123-MIMI', //UUID(),
    name: 'Mimi Martinez',
    email: 'mimi@google.com',
    password: bcrypt.hashSync('123456'),
    role: 'user',
  };

  await db.insert(Role).values(roles);
  await db.insert(User).values([benito, mimi]);

  const queries: any = [];
  seedProducts.forEach((p) => {
    const product = {
      id: UUID(),
      description: p.description,
      gender: p.gender,
      price: p.price,
      sizes: p.sizes.join(','),
      slug: p.slug,
      stock: p.stock,
      tags: p.tags.join(','),
      title: p.title,
      type: p.type,
      user: benito.id,
    };

    queries.push(db.insert(Product).values(product));

    p.images.forEach((img) => {
      const image = {
        id: UUID(),
        image: img,
        productId: product.id,
      };

      queries.push(db.insert(ProductImage).values(image));
    });
  });

  await db.batch(queries);
}
