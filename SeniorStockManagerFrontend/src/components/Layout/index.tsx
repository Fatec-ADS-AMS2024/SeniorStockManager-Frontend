import Header from "../Header";
import Footer from "../Footer";

export default function Layout() {
  return (
    <div className='flex flex-col text-text bg-background min-h-screen'>
      <Header />

      <div className="flex-1 flex flex-row">
        {/* Conteúdo principal */}
      </div>
      <Footer />
    </div>
  );
}