import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

export default function AppLayout() {
  return (
    <div className='flex flex-col relative text-text bg-background h-full w-full min-h-screen min-w-screen overflow-y-auto overflow-x-clip pt-24 pl-16'>
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
