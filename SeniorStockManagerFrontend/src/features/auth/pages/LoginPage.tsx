import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import fotoLoginSistema from '@/assets/images/fotoLoginSistema.png';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const { theme } = useContext(ThemeContext);

  return (
    <main className='flex bg-neutralWhite' role='main' aria-label='Página de login'>
      <section className='md:w-[40%] w-full h-full bg-neutralWhite flex flex-col justify-center items-center px-8' aria-label='Formulário de login'>
        <LoginForm />
      </section>
      <aside className='relative hidden md:flex md:w-[50%] w-full h-full justify-end items-center pr-16' aria-label='Imagem decorativa'>
        <img
          src={fotoLoginSistema}
          alt='Ilustração decorativa do sistema de gerenciamento de estoque'
          className={`w-[80%] h-auto object-contain ${
            theme === 'high-contrast' ? 'grayscale' : ''
          }`}
          role='img'
        />
      </aside>
    </main>
  );
}
