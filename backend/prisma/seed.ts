import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================
  // 1. ADMIN USER
  // ============================================
  console.log('👤 Creating admin user...');
  
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  await prisma.user.upsert({
    where: { email: 'admin@labistro.com' },
    update: {},
    create: {
      email: 'admin@labistro.com',
      password: hashedPassword,
      name: 'Admin',
    },
  });
  
  console.log('✅ Admin user created/verified');

  // ============================================
  // 2. MENU CATEGORIES
  // ============================================
  console.log('📂 Creating menu categories...');
  
  const categories = [
    { name: 'Starters', order: 1 },
    { name: 'Main Course', order: 2 },
    { name: 'Breads', order: 3 },
    { name: 'Desserts', order: 4 },
    { name: 'Drinks', order: 5 },
  ];

  const createdCategories = await Promise.all(
    categories.map((cat) =>
      prisma.category.upsert({
        where: { name: cat.name },
        update: { order: cat.order },
        create: { name: cat.name, order: cat.order },
      })
    )
  );

  console.log(`✅ ${createdCategories.length} categories created/verified`);

  // ============================================
  // 3. MENU ITEMS
  // ============================================
  console.log('🍽️ Creating menu items...');

  // Helper: Find category by name
  const findCategory = (name: string) =>
    createdCategories.find((cat) => cat.name === name)!;

  const menuItems = [
    // Starters (4 items)
    {
      name: 'Samosa (Pair)',
      description: 'Crispy pastry with spiced potato and peas filling',
      price: 4.99,
      categoryId: findCategory('Starters').id,
      isVeg: true,
      isSpicy: true,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'Paneer Tikka',
      description: 'Marinated cottage cheese cubes grilled in tandoor',
      price: 7.99,
      categoryId: findCategory('Starters').id,
      isVeg: true,
      isSpicy: true,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'Chicken Pakora',
      description: 'Spiced chicken fritters deep fried until golden',
      price: 6.99,
      categoryId: findCategory('Starters').id,
      isVeg: false,
      isSpicy: true,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Spring Roll (2pc)',
      description: 'Crispy rolls filled with vegetables and herbs',
      price: 5.49,
      categoryId: findCategory('Starters').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: false,
    },

    // Main Course (4 items)
    {
      name: 'Butter Chicken',
      description: 'Tender chicken pieces in a creamy tomato sauce',
      price: 14.99,
      categoryId: findCategory('Main Course').id,
      isVeg: false,
      isSpicy: true,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'Chole Bhature',
      description: 'Spiced chickpeas with fluffy fried bread',
      price: 11.99,
      categoryId: findCategory('Main Course').id,
      isVeg: true,
      isSpicy: true,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'Lamb Vindaloo',
      description: 'Tender lamb in a spicy and tangy curry',
      price: 16.99,
      categoryId: findCategory('Main Course').id,
      isVeg: false,
      isSpicy: true,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Palak Paneer',
      description: 'Cottage cheese cubes in a spinach cream sauce',
      price: 12.99,
      categoryId: findCategory('Main Course').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: false,
    },

    // Breads (4 items)
    {
      name: 'Naan (Plain)',
      description: 'Traditional Indian bread baked in tandoor',
      price: 3.49,
      categoryId: findCategory('Breads').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Garlic Naan',
      description: 'Naan topped with fresh garlic and herbs',
      price: 4.49,
      categoryId: findCategory('Breads').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'Roti',
      description: 'Whole wheat Indian flatbread',
      price: 2.99,
      categoryId: findCategory('Breads').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Paratha',
      description: 'Layered flatbread with butter',
      price: 3.99,
      categoryId: findCategory('Breads').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: false,
    },

    // Desserts (3 items)
    {
      name: 'Gulab Jamun (4pc)',
      description: 'Soft milk solids in sugar syrup',
      price: 5.99,
      categoryId: findCategory('Desserts').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'Kheer',
      description: 'Creamy rice pudding with cardamom',
      price: 4.99,
      categoryId: findCategory('Desserts').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Mango Lassi',
      description: 'Sweet yogurt drink with fresh mango',
      price: 4.49,
      categoryId: findCategory('Desserts').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: false,
    },

    // Drinks (4 items)
    {
      name: 'Masala Chai',
      description: 'Traditional spiced Indian tea',
      price: 2.99,
      categoryId: findCategory('Drinks').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Lassi (Salted)',
      description: 'Refreshing yogurt drink with salt',
      price: 3.49,
      categoryId: findCategory('Drinks').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Mango Shake',
      description: 'Creamy mango milkshake',
      price: 4.99,
      categoryId: findCategory('Drinks').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'Lemonade (Fresh)',
      description: 'Fresh lime juice with ginger and mint',
      price: 3.99,
      categoryId: findCategory('Drinks').id,
      isVeg: true,
      isSpicy: false,
      isAvailable: true,
      isFeatured: false,
    },
  ];

  await Promise.all(
    menuItems.map(async (item) => {
      const existing = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: item.categoryId,
        },
      });

      if (!existing) {
        await prisma.menuItem.create({
          data: {
            name: item.name,
            description: item.description,
            price: item.price,
            categoryId: item.categoryId,
            imageUrl: '',
            isVeg: item.isVeg,
            isSpicy: item.isSpicy,
            isAvailable: item.isAvailable,
            isFeatured: item.isFeatured,
          },
        });
      }
    })
  );

  console.log(`✅ ${menuItems.length} menu items created/verified`);

  // ============================================
  // 4. RESTAURANT INFO
  // ============================================
  console.log('🏪 Creating restaurant info...');

  const restaurantData = {
    name: 'La Bistro',
    description: 'Authentic Indian cuisine crafted with passion and tradition',
    address: '123 Main Street, Your City, State 12345',
    phone: '+1-555-123-4567',
    email: 'info@labistro.com',
    website: 'https://www.labistro.com',
    instagram: '@labistro',
    openingTime: '11:00',
    closingTime: '22:00',
    hoursJson: {
      sunday: { open: '12:00', close: '21:00' },
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
    },
  };

  const existing = await prisma.restaurantInfo.findFirst();

  if (!existing) {
    await prisma.restaurantInfo.create({
      data: restaurantData,
    });
  } else {
    await prisma.restaurantInfo.update({
      where: { id: existing.id },
      data: restaurantData,
    });
  }

  console.log('✅ Restaurant info created/verified');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
