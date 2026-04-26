import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import * as reservationService from '../services/reservationService';

const router = Router();

// POST /api/reservations - Create new reservation (public)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { guestName, guestEmail, guestPhone, partySize, reservationDate, specialRequests } =
      req.body;

    const reservation = await reservationService.createReservation(
      guestName,
      guestEmail,
      guestPhone,
      partySize,
      reservationDate,
      specialRequests
    );

    res.status(201).json({ data: { ...reservation, message: 'Reservation created successfully' } });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Internal server error' });
  }
});

// GET /api/reservations - Get all reservations (protected - admin)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, startDate, endDate, sortBy } = req.query as Record<string, string>;

    const reservations = await reservationService.getAllReservations(
      status,
      startDate,
      endDate,
      sortBy
    );

    res.status(200).json({ data: reservations });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// GET /api/reservations/upcoming - Get upcoming reservations (protected - admin)
router.get('/upcoming', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    const reservations = await reservationService.getUpcomingReservations(days);
    res.status(200).json({ data: reservations });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// GET /api/reservations/date/:date - Get reservations by date (protected - admin)
router.get('/date/:date', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reservations = await reservationService.getReservationsByDate(req.params.date);
    res.status(200).json({ data: reservations });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Internal server error' });
  }
});

// GET /api/reservations/:id - Get single reservation (public)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const reservation = await reservationService.getReservationById(req.params.id);
    res.status(200).json({ data: reservation });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

// PUT /api/reservations/:id - Update reservation metadata (protected)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      guestName,
      guestEmail,
      guestPhone,
      partySize,
      reservationDate,
      specialRequests,
    } = req.body;

    const reservation = await reservationService.updateReservationMetadata(
      req.params.id,
      guestName,
      guestEmail,
      guestPhone,
      partySize,
      reservationDate,
      specialRequests
    );

    res.status(200).json({ data: reservation });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

// PUT /api/reservations/:id/status - Update reservation status (protected)
router.put(
  '/:id/status',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: 'Status is required. Must be PENDING, CONFIRMED, or CANCELLED' });
        return;
      }

      const reservation = await reservationService.updateReservationStatus(req.params.id, status);

      res.status(200).json({
        data: {
          ...reservation,
          message: `Reservation status updated to ${reservation.status}`,
        },
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

// DELETE /api/reservations/:id - Delete reservation (protected)
router.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await reservationService.deleteReservation(req.params.id);
      res.status(200).json({ data: 'Reservation deleted successfully' });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

// POST /api/reservations/:id/confirm - Confirm reservation (protected)
router.post(
  '/:id/confirm',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const reservation = await reservationService.updateReservationStatus(req.params.id, 'CONFIRMED');
      res.status(200).json({
        data: {
          ...reservation,
          message: 'Reservation confirmed successfully',
        },
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

// POST /api/reservations/:id/cancel - Cancel reservation (protected)
router.post(
  '/:id/cancel',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const reservation = await reservationService.updateReservationStatus(req.params.id, 'CANCELLED');
      res.status(200).json({
        data: {
          ...reservation,
          message: 'Reservation cancelled successfully',
        },
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
);

export default router;
