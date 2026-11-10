import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        login,
        password
      });
      onLogin(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка подключения к серверу');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-900">
      <form onSubmit={handleSubmit} className="bg-stone-800 p-10 rounded-3xl shadow-2xl h-100 border border-stone-700">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-amber-500 tracking-tighter mb-1">c.tours</h1>
          <p className="text-stone-400 text-sm">Конструктор путешествий</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium text-stone-400 mb-2">Логин</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors placeholder-stone-600"
            placeholder="Введите логин"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-stone-400 mb-2">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors placeholder-stone-600"
            placeholder="Введите пароль"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-amber-500 text-stone-950 font-bold py-3 rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
        >
          Войти в систему
        </button>

        {/* Тестовые аккаунты */}
        <div className="mt-8 pt-6 border-t border-stone-700/50 text-xs text-stone-500 text-center space-y-2">
          <p className="font-medium text-stone-400 mb-2">Тестовые аккаунты:</p>
          <div className="grid grid-cols-1 gap-1">
            <p>Админ: <span className="text-amber-500">admin / admin123</span></p>
            <p>Менеджер: <span className="text-amber-500">manager / manager123</span></p>
            <p>Клиент: <span className="text-amber-500">client / client123</span></p>
          </div>
        </div>
      </form>
    </div>
  );
}