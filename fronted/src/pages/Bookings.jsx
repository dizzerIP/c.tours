import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = user.isClient 
      ? `http://localhost:3001/api/bookings?client_id=${user.id}`
      : 'http://localhost:3001/api/bookings';

    axios.get(url)
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <div className="text-center text-stone-400 py-20">Загрузка броней...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-stone-100 mb-8">Мои бронирования</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-stone-800 rounded-2xl border border-stone-700">
          <span className="text-6xl mb-4 block">📄</span>
          <h3 className="text-xl font-bold text-stone-300">У вас пока нет броней</h3>
          <p className="text-stone-500 mt-2">Перейдите во вкладку «Мои туры», чтобы забронировать путешествие.</p>
        </div>
      ) : (
        <div className="bg-stone-800 rounded-2xl border border-stone-700 overflow-hidden">
          <table className="w-full text-left text-sm text-stone-300">
            <thead className="bg-stone-950 text-stone-400 uppercase font-medium text-xs border-b border-stone-700">
              <tr>
                <th className="px-6 py-4">№</th>
                <th className="px-6 py-4">Дата</th>
                <th className="px-6 py-4">Тур</th>
                <th className="px-6 py-4">Клиент</th>
                <th className="px-6 py-4">Сумма</th>
                <th className="px-6 py-4">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-700/50">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-stone-700/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-amber-500">#{b.id}</td>
                  <td className="px-6 py-4">{new Date(b.booking_date).toLocaleDateString('ru-RU')}</td>
                  <td className="px-6 py-4 font-medium text-stone-200">{b.tour}</td>
                  <td className="px-6 py-4">{b.client}</td>
                  <td className="px-6 py-4 font-bold">{b.total_price} ₽</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-bold">
                      Оплачено
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}