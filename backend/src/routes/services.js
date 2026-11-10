import express from 'express';
import db from '../db.js';

const router = express.Router();

// Все услуги (с фильтрацией по типу)
router.get('/', (req, res) => {
  const { type } = req.query;
  let sql = 'SELECT * FROM services';
  const params = [];
  if (type) {
    sql += ' WHERE type = ?';
    params.push(type);
  }
  res.json(db.prepare(sql).all(...params));
});

// Добавить услугу (нужна проверка на админа)
router.post('/', (req, res) => {
  const { name, type, city, price, description } = req.body;
  const info = db.prepare('INSERT INTO services (name, type, city, price, description) VALUES (?, ?, ?, ?, ?)')
    .run(name, type, city, price, description);
  res.json({ id: info.lastInsertRowid });
});

export default router;