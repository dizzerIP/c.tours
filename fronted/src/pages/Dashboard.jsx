import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ user, refreshTrigger }) {
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]); 
  const [tourName, setTourName] = useState('');
  const [message, setMessage] = useState('');

  // Загружаем услуги
  useEffect(() => {
    axios.get('http://localhost:3001/api/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, [refreshTrigger]);

  const addToCart = (service) => {
    const existing = cart.find(item => item.id === service.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...service, quantity: 1 }]);
    }
  };

  const removeFromCart = (serviceId) => {
    setCart(cart.filter(item => item.id !== serviceId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSaveTour = async () => {
    if (!tourName) return setMessage('Введите название тура!');
    if (cart.length === 0) return setMessage('Добавьте услуги!');

    try {
      const payload = {
        name: tourName,
        employee_id: !user.isClient ? user.id : null,
        client_id: user.isClient ? user.id : null,
        services: cart.map(item => ({ service_id: item.id, quantity: item.quantity }))
      };

      const res = await axios.post('http://localhost:3001/api/tours', payload);
      setMessage(`Тур сохранен! Сумма: ${res.data.total_price} ₽`);
      setCart([]); 
      setTourName('');
    } catch (err) {
      setMessage('Ошибка при сохранении');
    }
  };

  const getServiceIcon = (type) => {
    if (type === 'hotel') return '🏨';
    if (type === 'transport') return '✈️';
    if (type === 'excursion') return '🗺️';
    return '📦';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Каталог */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-bold text-stone-100">Каталог услуг</h2>
          <span className="text-stone-400 text-sm">Доступно: {services.length}</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map(service => (
            <div key={service.id} className="bg-stone-800 p-5 rounded-2xl border border-stone-700 hover:border-amber-500/50 transition-colors flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-2xl">{getServiceIcon(service.type)}</span>
                  <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">{service.city}</span>
                </div>
                <h3 className="text-lg font-bold text-stone-100 mt-2">{service.name}</h3>
                <p className="text-sm text-stone-400 mt-1 line-clamp-2">{service.description}</p>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone-700/50">
                <span className="text-xl font-black text-stone-200">{service.price} ₽</span>
                <button 
                  onClick={() => addToCart(service)}
                  className="bg-stone-700 text-stone-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-stone-950 transition-colors font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Корзина */}
      <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700 h-fit sticky top-6 shadow-2xl">
        <h2 className="text-xl font-bold text-stone-100 mb-4 flex items-center gap-2">
          <span>🧳</span> Ваш тур
        </h2>
        
        <div className="min-h-25">
          {cart.length === 0 ? (
            <p className="text-stone-500 text-sm text-center py-8">Добавьте услуги из каталога</p>
          ) : (
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-start text-sm border-b border-stone-700 pb-3">
                  <div>
                    <p className="font-bold text-stone-200">{item.name}</p>
                    <p className="text-stone-400">{item.quantity} шт. × {item.price} ₽</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-stone-500 hover:text-red-400 transition-colors p-1">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-stone-700 pt-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-stone-400">Итого:</span>
            <span className="text-2xl font-black text-amber-500">{totalPrice} ₽</span>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Название тура"
            value={tourName}
            onChange={(e) => setTourName(e.target.value)}
            className="w-full bg-stone-900 border border-stone-700 rounded-lg px-4 py-3 text-stone-200 text-sm focus:border-amber-500 focus:outline-none placeholder-stone-600"
          />
          <button 
            onClick={handleSaveTour}
            className="w-full bg-amber-500 text-stone-950 py-3 rounded-lg hover:bg-amber-400 transition-colors font-bold shadow-lg shadow-amber-500/20"
          >
            Сохранить тур
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-stone-900 border border-stone-700 text-amber-500 rounded-lg text-sm text-center font-medium">
            {message}
          </div>
        )}
      </div>

    </div>
  );
}