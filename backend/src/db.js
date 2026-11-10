import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'travel.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// схема бд
db.exec(`
  -- 1. Клиенты (client)
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    login TEXT UNIQUE,
    password TEXT
  );

  -- 2. Сотрудники (admin, manager)
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    position TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'manager',
    login TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  -- 3. Услуги
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    city TEXT,
    price REAL NOT NULL,
    description TEXT
  );

  -- 4. Туры
  CREATE TABLE IF NOT EXISTS tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    employee_id INTEGER REFERENCES employees(id),
    client_id INTEGER REFERENCES clients(id),
    total_price REAL NOT NULL DEFAULT 0
  );

  -- 5. Состав тура
  CREATE TABLE IF NOT EXISTS tour_composition (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tour_id INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES services(id),
    quantity INTEGER NOT NULL DEFAULT 1
  );

  -- 6. Брони
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    tour_id INTEGER NOT NULL REFERENCES tours(id),
    booking_date TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'new'
  );

  -- 7. Оплаты
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    amount REAL NOT NULL,
    payment_date TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'success'
  );
`);

// тест
const isEmpty = db.prepare('SELECT COUNT(*) AS c FROM services').get().c === 0;
if (isEmpty) {
  // админ
  db.prepare('INSERT INTO employees (full_name, position, role, login, password) VALUES (?, ?, ?, ?, ?)')
    .run('Сидоров Алексей', 'Главный администратор', 'admin', 'admin', 'admin123');
  
  // менеджер
  db.prepare('INSERT INTO employees (full_name, position, role, login, password) VALUES (?, ?, ?, ?, ?)')
    .run('Иванов Иван', 'Менеджер по туризму', 'manager', 'manager', 'manager123');

  // клиент
  db.prepare('INSERT INTO clients (full_name, phone, email, login, password) VALUES (?, ?, ?, ?, ?)')
    .run('Петров Петр', '+79991234567', 'petrov@mail.ru', 'client', 'client123');

  // услуги
  const insService = db.prepare('INSERT INTO services (name, type, city, price, description) VALUES (?, ?, ?, ?, ?)');
  insService.run('Гранд Отель', 'hotel', 'Москва', 12000, '5 звезд, центр');
  insService.run('Приморская', 'hotel', 'Сочи', 6500, '4 звезды, у моря');
  insService.run('Авиабилет Москва-Сочи', 'transport', 'Сочи', 8500, 'Аэрофлот');
  insService.run('Поезд Москва-Сочи', 'transport', 'Сочи', 3400, 'Плацкарт');
  insService.run('Красная площадь', 'excursion', 'Москва', 1500, 'Пешая экскурсия');
  insService.run('Олимпийский парк', 'excursion', 'Сочи', 900, 'Автобусная');

  console.log('[db] Тестовые данные добавлены. Логины: admin, manager, client (пароль: логин + 123)');
}

export default db;