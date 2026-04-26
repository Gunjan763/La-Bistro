import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper: Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper: Validate phone format
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Helper: Validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper: Validate time format (HH:mm in 24-hour)
const isValidTime = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// GET: Fetch restaurant info (or create default if doesn't exist)
export const getRestaurantInfo = async () => {
  let restaurant = await prisma.restaurantInfo.findFirst();

  // If no restaurant info exists, create default one
  if (!restaurant) {
    restaurant = await prisma.restaurantInfo.create({
      data: {
        name: 'La Bistro',
        description: 'Welcome to La Bistro - A culinary experience like no other.',
        address: '123 Main Street, Your City, State 12345',
        phone: '+1-555-123-4567',
        email: 'info@labistro.com',
        website: 'https://www.labistro.com',
        instagram: '@labistro',
        openingTime: '11:00',
        closingTime: '22:00',
        hoursJson: {
          monday: { open: '11:00', close: '22:00' },
          tuesday: { open: '11:00', close: '22:00' },
          wednesday: { open: '11:00', close: '22:00' },
          thursday: { open: '11:00', close: '22:00' },
          friday: { open: '11:00', close: '23:00' },
          saturday: { open: '11:00', close: '23:00' },
          sunday: { open: '12:00', close: '21:00' },
        },
      },
    });
  }

  return restaurant;
};

// PUT: Update restaurant info
export const updateRestaurantInfo = async (
  name?: string,
  description?: string,
  address?: string,
  phone?: string,
  email?: string,
  website?: string,
  instagram?: string,
  openingTime?: string,
  closingTime?: string,
  hoursJson?: any
) => {
  // Validate at least one field is provided
  if (!name && !description && !address && !phone && !email && !website && !instagram && !openingTime && !closingTime && !hoursJson) {
    throw new Error('At least one field is required for update');
  }

  // Validate email if provided
  if (email && !isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Validate phone if provided
  if (phone && !isValidPhone(phone)) {
    throw new Error('Invalid phone number format');
  }

  // Validate website URL if provided
  if (website && !isValidUrl(website)) {
    throw new Error('Invalid website URL format');
  }

  // Validate time format (HH:mm)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (openingTime && !timeRegex.test(openingTime)) {
    throw new Error('Invalid opening time format. Use HH:mm (24-hour)');
  }
  if (closingTime && !timeRegex.test(closingTime)) {
    throw new Error('Invalid closing time format. Use HH:mm (24-hour)');
  }

  // Get existing restaurant info
  let restaurant = await prisma.restaurantInfo.findFirst();

  if (!restaurant) {
    throw new Error('Restaurant info not found');
  }

  // Update restaurant info
  restaurant = await prisma.restaurantInfo.update({
    where: { id: restaurant.id },
    data: {
      ...(name && { name: name.trim() }),
      ...(description && { description: description.trim() }),
      ...(address && { address: address.trim() }),
      ...(phone && { phone: phone.trim() }),
      ...(email && { email: email.trim().toLowerCase() }),
      ...(website && { website: website.trim() }),
      ...(instagram && { instagram: instagram.trim() }),
      ...(openingTime && { openingTime: openingTime.trim() }),
      ...(closingTime && { closingTime: closingTime.trim() }),
      ...(hoursJson && { hoursJson: hoursJson }),
    },
  });

  return restaurant;
};

// PUT: Update specific field (for granular updates)
export const updateRestaurantField = async (field: string, value: string) => {
  const validFields = ['name', 'description', 'address', 'phone', 'email', 'website', 'instagram', 'openingTime', 'closingTime'];

  if (!validFields.includes(field)) {
    throw new Error(`Invalid field. Must be one of: ${validFields.join(', ')}`);
  }

  if (!value || value.trim().length === 0) {
    throw new Error(`${field} cannot be empty`);
  }

  // Validate field-specific rules
  if (field === 'email' && !isValidEmail(value)) {
    throw new Error('Invalid email format');
  }

  if (field === 'phone' && !isValidPhone(value)) {
    throw new Error('Invalid phone number format');
  }

  if (field === 'website' && !isValidUrl(value)) {
    throw new Error('Invalid website URL format');
  }

  if ((field === 'openingTime' || field === 'closingTime') && !isValidTime(value)) {
    throw new Error(`Invalid ${field} format. Use HH:mm (24-hour)`);
  }

  let restaurant = await prisma.restaurantInfo.findFirst();

  if (!restaurant) {
    throw new Error('Restaurant info not found');
  }

  return prisma.restaurantInfo.update({
    where: { id: restaurant.id },
    data: {
      [field]: field === 'email' ? value.trim().toLowerCase() : value.trim(),
    },
  });
};

// GET: Fetch dashboard statistics
export const getStats = async () => {
  const [
    menuItemCount,
    categoryCount,
    pendingReservationCount,
    todayReservationCount,
    galleryImageCount,
    recentPendingReservations
  ] = await Promise.all([
    prisma.menuItem.count(),
    prisma.category.count(),
    prisma.reservation.count({ where: { status: 'PENDING' } }),
    prisma.reservation.count({
      where: {
        status: 'CONFIRMED',
        reservationDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    }),
    prisma.galleryImage.count(),
    prisma.reservation.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  return {
    menuItemCount,
    categoryCount,
    pendingReservationCount,
    todayReservationCount,
    galleryImageCount,
    recentPendingReservations
  };
};

// Helper: Get hours formatted with detailed info
export const getFormattedHours = async () => {
  const restaurant = await getRestaurantInfo();
  const hoursInfo = parseHoursForToday(restaurant.hoursJson as any);

  return {
    openingTime: restaurant.openingTime,
    closingTime: restaurant.closingTime,
    hoursJson: restaurant.hoursJson,
    isOpen: hoursInfo.isOpen,
    todayHours: hoursInfo.todayHours,
    openTime: hoursInfo.openTime,
    closeTime: hoursInfo.closeTime,
    status: hoursInfo.status,
    timeUntilClose: hoursInfo.timeUntilClose,
    timeUntilOpen: hoursInfo.timeUntilOpen,
  };
};

// Helper: Parse hours for today and get detailed info
const parseHoursForToday = (hoursJson: any) => {
  try {
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[now.getDay()];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + currentMinute / 60;

    // Get today's hours from hoursJson
    const todayHours = hoursJson[dayName];

    if (!todayHours || !todayHours.open || !todayHours.close) {
      return {
        isOpen: false,
        todayHours: 'Closed',
        openTime: null,
        closeTime: null,
        status: 'Closed today',
        timeUntilClose: null,
        timeUntilOpen: null,
      };
    }

    const openTime = timeStringToDecimal(todayHours.open);
    const closeTime = timeStringToDecimal(todayHours.close);
    const isOpen = currentTime >= openTime && currentTime < closeTime;

    let timeUntilClose = null;
    let timeUntilOpen = null;
    let status = '';

    if (isOpen) {
      const minutesUntilClose = Math.floor((closeTime - currentTime) * 60);
      timeUntilClose = `${Math.floor(minutesUntilClose / 60)}h ${minutesUntilClose % 60}m`;
      status = `Open until ${todayHours.close}`;
    } else if (currentTime < openTime) {
      const minutesUntilOpen = Math.floor((openTime - currentTime) * 60);
      timeUntilOpen = `${Math.floor(minutesUntilOpen / 60)}h ${minutesUntilOpen % 60}m`;
      status = `Opens at ${todayHours.open}`;
    } else {
      status = `Closed (Opens tomorrow at ${todayHours.open})`;
    }

    return {
      isOpen,
      todayHours: `${todayHours.open} - ${todayHours.close}`,
      openTime: todayHours.open,
      closeTime: todayHours.close,
      status,
      timeUntilClose,
      timeUntilOpen,
    };
  } catch (error) {
    console.error('Error parsing hours:', error);
    return {
      isOpen: false,
      todayHours: 'Error loading hours',
      openTime: null,
      closeTime: null,
      status: 'Unable to determine status',
      timeUntilClose: null,
      timeUntilOpen: null,
    };
  }
};

// Helper: Convert time string (HH:mm) to decimal hours
const timeStringToDecimal = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + minutes / 60;
};
