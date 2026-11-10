import express from 'express';
import db from '../db.js';

const router = express.Router();

// Авторизация
router.post('/login', (req, res) => {
  const { login, password } = req.body;

  const employee = db.prepare('SELECT id, full_name, role FROM employees WHERE login = ? AND password = ?')
    .get(login, password);
  
  if (employee) {
    return res.json({ ...employee, isClient: false });
  }

  const client = db.prepare('SELECT id, full_name FROM clients WHERE login = ? AND password = ?')
    .get(login, password);

  if (client) {
    return res.json({ ...client, role: 'client', isClient: true });
  }

  res.status(401).json({ error: 'Неверный логин или пароль' });
});

export default router;