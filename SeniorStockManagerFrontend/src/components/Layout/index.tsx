import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

export default function Layout() {
  return (
    <div className='flex flex-col text-text bg-background h-screen w-screen overflow-y-auto overflow-x-clip'>
      <Header />

      <div className="flex-1 flex flex-row">
        {/* Menu */}

        {/* Conteúdo principal */}
        <main className="h-full w-full *:w-full *:h-full">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
