import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { client_id, tour_id } = req.body;
  
  const info = db.prepare('INSERT INTO bookings (client_id, tour_id) VALUES (?, ?)')
    .run(client_id, tour_id);
  const bookingId = info.lastInsertRowid;

  const tour = db.prepare('SELECT total_price FROM tours WHERE id = ?').get(tour_id);
  if (tour) {
    db.prepare('INSERT INTO payments (booking_id, amount) VALUES (?, ?)')
      .run(bookingId, tour.total_price);
  }

  res.json({ booking_id: bookingId, status: 'success' });
});

router.get('/', (req, res) => {
  const { client_id } = req.query;
  
  let sql = `
    SELECT b.id, b.booking_date, b.status, c.full_name as client, t.name as tour, t.total_price
    FROM bookings b
    JOIN clients c ON c.id = b.client_id
    JOIN tours t ON t.id = b.tour_id
  `;
  const params = [];

  if (client_id) {
    sql += ' WHERE b.client_id = ?';
    params.push(client_id);
  }
  
  sql += ' ORDER BY b.id DESC';
  
  res.json(db.prepare(sql).all(...params));
});

export default router;