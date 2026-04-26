import prisma from '../lib/prisma';

// Helper: Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper: Validate phone format (basic)
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Helper: Validate reservation date is in future
const isValidDate = (date: Date): boolean => {
  return new Date(date) > new Date();
};

// POST: Create new reservation
export const createReservation = async (
  guestName: string,
  guestEmail: string,
  guestPhone: string,
  partySize: number,
  reservationDate: Date | string,
  specialRequests?: string
) => {
  // Validate required fields
  if (!guestName || !guestEmail || !guestPhone || !partySize || !reservationDate) {
    throw new Error('Guest name, email, phone, party size, and reservation date are required');
  }

  // Validate email
  if (!isValidEmail(guestEmail)) {
    throw new Error('Invalid email format');
  }

  // Validate phone
  if (!isValidPhone(guestPhone)) {
    throw new Error('Invalid phone number format');
  }

  // Validate party size
  if (partySize < 1 || partySize > 20) {
    throw new Error('Party size must be between 1 and 20');
  }

  // Convert string date to Date object if needed
  const reservationDateTime = new Date(reservationDate);

  // Validate date is in future
  if (!isValidDate(reservationDateTime)) {
    throw new Error('Reservation date must be in the future');
  }

  return prisma.reservation.create({
    data: {
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim().toLowerCase(),
      guestPhone: guestPhone.trim(),
      partySize: parseInt(partySize as any),
      reservationDate: reservationDateTime,
      specialRequests: specialRequests?.trim() || '',
      status: 'PENDING',
    },
  });
};

// GET: Fetch all reservations with filters
export const getAllReservations = async (
  status?: string,
  startDate?: string,
  endDate?: string,
  sortBy: string = 'reservationDate'
) => {
  const whereClause: any = {};

  if (status) {
    whereClause.status = status.toUpperCase();
  }

  if (startDate || endDate) {
    whereClause.reservationDate = {};
    if (startDate) {
      whereClause.reservationDate.gte = new Date(startDate);
    }
    if (endDate) {
      whereClause.reservationDate.lte = new Date(endDate);
    }
  }

  const orderByMap: Record<string, any> = {
    reservationDate: { reservationDate: 'asc' },
    createdAt: { createdAt: 'desc' },
    partySize: { partySize: 'desc' },
    status: { status: 'asc' },
  };

  return prisma.reservation.findMany({
    where: whereClause,
    orderBy: orderByMap[sortBy] || { reservationDate: 'asc' },
  });
};

// GET: Fetch single reservation
export const getReservationById = async (id: string) => {
  if (!id || id.length === 0) {
    throw new Error('Reservation ID is required');
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  return reservation;
};

// GET: Fetch upcoming reservations (next 7 days)
export const getUpcomingReservations = async (days: number = 7) => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return prisma.reservation.findMany({
    where: {
      reservationDate: {
        gte: now,
        lte: futureDate,
      },
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    orderBy: { reservationDate: 'asc' },
  });
};

// GET: Fetch reservations by date
export const getReservationsByDate = async (date: string) => {
  const searchDate = new Date(date);
  const nextDay = new Date(searchDate);
  nextDay.setDate(nextDay.getDate() + 1);

  return prisma.reservation.findMany({
    where: {
      reservationDate: {
        gte: searchDate,
        lt: nextDay,
      },
    },
    orderBy: { reservationDate: 'asc' },
  });
};

// PUT: Update reservation status
export const updateReservationStatus = async (id: string, status: string) => {
  if (!id) {
    throw new Error('Reservation ID is required');
  }

  const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
  const upperStatus = status.toUpperCase();

  if (!validStatuses.includes(upperStatus)) {
    throw new Error('Invalid status. Must be PENDING, CONFIRMED, or CANCELLED');
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  return prisma.reservation.update({
    where: { id },
    data: { status: upperStatus as any },
  });
};

// PUT: Update reservation metadata
export const updateReservationMetadata = async (
  id: string,
  guestName?: string,
  guestEmail?: string,
  guestPhone?: string,
  partySize?: number,
  reservationDate?: string | Date,
  specialRequests?: string
) => {
  if (
    !guestName &&
    !guestEmail &&
    !guestPhone &&
    !partySize &&
    !reservationDate &&
    !specialRequests
  ) {
    throw new Error('At least one field is required for update');
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  // Validate email if provided
  if (guestEmail && !isValidEmail(guestEmail)) {
    throw new Error('Invalid email format');
  }

  // Validate phone if provided
  if (guestPhone && !isValidPhone(guestPhone)) {
    throw new Error('Invalid phone number format');
  }

  // Validate party size if provided
  if (partySize !== undefined && (partySize < 1 || partySize > 20)) {
    throw new Error('Party size must be between 1 and 20');
  }

  // Validate date if provided
  if (reservationDate) {
    const newDate = new Date(reservationDate);
    if (!isValidDate(newDate)) {
      throw new Error('Reservation date must be in the future');
    }
  }

  return prisma.reservation.update({
    where: { id },
    data: {
      ...(guestName && { guestName: guestName.trim() }),
      ...(guestEmail && { guestEmail: guestEmail.trim().toLowerCase() }),
      ...(guestPhone && { guestPhone: guestPhone.trim() }),
      ...(partySize && { partySize: parseInt(partySize as any) }),
      ...(reservationDate && { reservationDate: new Date(reservationDate) }),
      ...(specialRequests !== undefined && { specialRequests: specialRequests.trim() }),
    },
  });
};

// DELETE: Delete reservation
export const deleteReservation = async (id: string) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  return prisma.reservation.delete({
    where: { id },
  });
};

// POST: Send confirmation email (stub for future email service)
export const sendConfirmationEmail = async (id: string) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  // TODO: Implement email sending with nodemailer
  // For now, just log it
  console.log(`Sending confirmation email to ${reservation.guestEmail}`);

  return {
    message: `Confirmation email sent to ${reservation.guestEmail}`,
    reservationId: id,
  };
};
