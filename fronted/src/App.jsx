import { useState } from 'react';
import Login from './pages/Login';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import MyTours from './pages/MyTours';
import Bookings from './pages/Bookings';

function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('constructor');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogin = (data) => {
    setUser(data);
    if (data.role === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('constructor');
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={user} 
      onLogout={() => { setUser(null); setCurrentTab('constructor'); }}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    >
      {currentTab === 'constructor' && <Dashboard user={user} refreshTrigger={refreshTrigger} />}
      
      {currentTab === 'admin' && user.role === 'admin' && (
        <AdminPanel onServiceAdded={() => setRefreshTrigger(prev => prev + 1)} />
      )}

      {currentTab === 'tours' && <MyTours user={user} />}
      
      {currentTab === 'bookings' && <Bookings user={user} />}
    </Layout>
  );
}

export default App;