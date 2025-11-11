import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import fotoLoginSistema from '@/assets/images/fotoLoginSistema.png';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className='flex bg-neutralWhite'>
      <div className='md:w-[40%] w-full h-full bg-neutralWhite flex flex-col justify-center items-center px-8'>
        <LoginForm />
      </div>
      <div className='relative hidden md:flex md:w-[50%] w-full h-full justify-end items-center pr-16'>
        <img
          src={fotoLoginSistema}
          alt='Foto Login Sistema'
          className={`w-[80%] h-auto object-contain ${
            theme === 'high-contrast' ? 'grayscale' : ''
          }`}
        />
      </div>
    </div>
  );
}
