import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MyTours({ user }) { // Добавили user в параметры
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/api/tours')
      .then(res => {
        setTours(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleBook = async (tourId) => {
    try {
      // Если клиент — используем его ID. Если менеджер/админ — берем тестового клиента (id: 1)
      const client_id = user.isClient ? user.id : 1; 
      
      await axios.post('http://localhost:3001/api/bookings', {
        client_id,
        tour_id: tourId
      });
      alert('Тур успешно забронирован и оплачен!');
    } catch (err) {
      alert('Ошибка при бронировании');
    }
  };

  if (loading) return <div className="text-center text-stone-400 py-20">Загрузка туров...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-stone-100 mb-8">Сохраненные туры</h2>

      {tours.length === 0 ? (
        <div className="text-center py-20 bg-stone-800 rounded-2xl border border-stone-700">
          <span className="text-6xl mb-4 block">🧳</span>
          <h3 className="text-xl font-bold text-stone-300">Пока нет созданных туров</h3>
          <p className="text-stone-500 mt-2">Перейдите во вкладку «Конструктор», чтобы собрать свой первый тур!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tours.map(tour => (
            <div key={tour.id} className="bg-stone-800 p-6 rounded-2xl border border-stone-700 hover:border-stone-600 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-amber-500">{tour.name}</h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Создал: {tour.manager_name || tour.client_name || 'Неизвестно'}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="text-2xl font-black text-stone-200">{tour.total_price} ₽</span>
                  <button 
                    onClick={() => handleBook(tour.id)}
                    className="bg-amber-500 text-stone-950 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-amber-400 transition-colors"
                  >
                    Забронировать
                  </button>
                </div>
              </div>
              
              <div className="bg-stone-900/50 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Состав тура:</h4>
                <ul className="space-y-1">
                  {(tour.services || []).map((srv, idx) => (
                    <li key={idx} className="flex justify-between text-sm text-stone-300">
                      <span>{srv.name} <span className="text-stone-500">({srv.quantity} шт.)</span></span>
                      <span className="font-medium">{srv.subtotal} ₽</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}