import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import logo from '@/assets/images/logo.png';
import AccessibilityBar from './AccessibilityBar';

export default function Header() {
  const { theme } = useContext(ThemeContext);

  return (
    <header className='bg-neutralWhite flex flex-col overflow-hidden items-center justify-center flex-shrink-0 shadow z-10 fixed top-0 left-0 right-0'>
      <AccessibilityBar />

      <div className='h-16 w-full flex items-center justify-between overflow-hidden'>
        <img
          src={logo}
          alt='logo do sistema'
          className={`aspect-square size-14 object-cover ml-2 ${
            theme === 'high-contrast' ? 'grayscale' : 'grayscale-0'
          }`}
        />
      </div>
    </header>
  );
}
