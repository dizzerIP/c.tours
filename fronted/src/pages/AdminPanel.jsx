import { useState } from 'react';
import axios from 'axios';

export default function AdminPanel({ onServiceAdded }) {
  const [formData, setFormData] = useState({
    name: '', type: 'hotel', city: '', price: '', description: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/services', {
        ...formData,
        price: Number(formData.price)
      });
      setMessage('Услуга успешно добавлена!');
      setFormData({ name: '', type: 'hotel', city: '', price: '', description: '' });
      onServiceAdded(); // Обновляем список услуг в конструкторе
    } catch (err) {
      setMessage('Ошибка при добавлении');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-stone-100 mb-6">Управление услугами</h2>
      
      <div className="bg-stone-800 p-8 rounded-2xl border border-stone-700 shadow-xl">
        <h3 className="text-xl font-bold text-amber-500 mb-6">Добавить новую услугу</h3>
        
        {message && <div className="bg-green-500/20 text-green-400 p-3 rounded-lg mb-6">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Тип услуги</label>
              <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="hotel">🏨 Отель</option>
                <option value="transport">✈️ Транспорт</option>
                <option value="excursion">🗺️ Экскурсия</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Город</label>
              <input 
                type="text" required
                value={formData.city} 
                onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                placeholder="Например: Сочи"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-1">Название</label>
            <input 
              type="text" required
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              placeholder="Название отеля или услуги"
            />
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-1">Цена (₽)</label>
            <input 
              type="number" required min="0"
              value={formData.price} 
              onChange={e => setFormData({...formData, price: e.target.value})}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-1">Описание</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-stone-200 focus:border-amber-500 focus:outline-none h-24"
              placeholder="Краткое описание..."
            />
          </div>

          <button type="submit" className="w-full bg-amber-500 text-stone-950 font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors mt-4">
            Добавить в каталог
          </button>
        </form>
      </div>
    </div>
  );
}