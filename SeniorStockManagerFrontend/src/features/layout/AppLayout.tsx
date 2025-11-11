import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

export default function AppLayout() {
  return (
    <div className='flex flex-col text-text bg-background h-screen w-screen overflow-y-auto overflow-x-clip'>
      <Header />

      <div className='flex-1 flex flex-row'>
        {/* Menu */}
        <Sidebar />

        {/* Conteúdo principal */}
        <main className='h-full w-full *:w-full *:h-full'>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
