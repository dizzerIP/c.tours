import express from 'express';
import db from '../db.js';

const router = express.Router();

// Список туров
router.get('/', (_req, res) => {
  const tours = db.prepare(`
    SELECT t.id, t.name, t.total_price, 
           e.full_name as manager_name, c.full_name as client_name
    FROM tours t
    LEFT JOIN employees e ON e.id = t.employee_id
    LEFT JOIN clients c ON c.id = t.client_id
  `).all();

  for (const tour of tours) {
    tour.services = db.prepare(`
      SELECT s.name, s.type, s.price, tc.quantity, (s.price * tc.quantity) as subtotal
      FROM tour_composition tc
      JOIN services s ON s.id = tc.service_id
      WHERE tc.tour_id = ?
    `).all(tour.id);
  }
  res.json(tours);
});

// Создать тур
router.post('/', (req, res) => {
  const { name, employee_id, client_id, services } = req.body;

  if (!name || !services || services.length === 0) {
    return res.status(400).json({ error: 'Нужно название и хотя бы одна услуга' });
  }

  let total_price = 0;
  const getPrice = db.prepare('SELECT price FROM services WHERE id = ?');
  
  for (const item of services) {
    const srv = getPrice.get(item.service_id);
    if (srv) total_price += srv.price * item.quantity;
  }

  const info = db.prepare('INSERT INTO tours (name, employee_id, client_id, total_price) VALUES (?, ?, ?, ?)')
    .run(name, employee_id || null, client_id || null, total_price);
  
  const tourId = info.lastInsertRowid;
  const insComp = db.prepare('INSERT INTO tour_composition (tour_id, service_id, quantity) VALUES (?, ?, ?)');
  for (const item of services) {
    insComp.run(tourId, item.service_id, item.quantity);
  }

  res.json({ id: tourId, total_price });
});

export default router;