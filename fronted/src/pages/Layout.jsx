export default function Layout({ user, onLogout, currentTab, setCurrentTab, children }) {
  const menuItems = [
    { id: 'constructor', label: 'Конструктор', icon: '🛠️' },
    { id: 'tours', label: 'Мои туры', icon: '🧳' },
    { id: 'bookings', label: 'Брони', icon: '📄' }, // Новая вкладка
  ];

  if (user.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Управление услугами', icon: '⚙️' });
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-900 text-stone-200 font-sans">
      {/* Боковое меню для ПК */}
      <aside className="w-64 bg-stone-950 border-r border-stone-800 hidden md:flex md:flex-col">
        <div className="p-6 border-b border-stone-800">
          <h1 className="text-3xl font-black text-amber-500 tracking-tighter">c.tours</h1>
          <p className="text-xs text-stone-500 mt-1">Конструктор путешествий</p>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm whitespace-nowrap ${
                currentTab === item.id 
                  ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20' 
                  : 'hover:bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-amber-500 font-bold">
              {user.full_name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-stone-200 truncate">{user.full_name}</p>
              <p className="text-xs text-amber-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors font-medium">
            Выйти
          </button>
        </div>
      </aside>

      {/* Мобильная шапка */}
      <div className="md:hidden bg-stone-950 p-4 flex justify-between items-center border-b border-stone-800">
        <h1 className="text-xl font-black text-amber-500">c.tours</h1>
        <button onClick={onLogout} className="text-sm text-red-400 font-medium">Выйти</button>
      </div>

      {/* Основной контент */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col">
        <div className="md:hidden flex overflow-x-auto border-b border-stone-800 bg-stone-900">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex-1 min-w-30 py-3 text-sm font-medium text-center transition-colors ${
                currentTab === item.id ? 'text-amber-500 border-b-2 border-amber-500 bg-stone-800/50' : 'text-stone-400'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}