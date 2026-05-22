import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUIStore } from '../../context/store.js';

export default function Layout() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <div className="min-h-screen bg-warm-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
