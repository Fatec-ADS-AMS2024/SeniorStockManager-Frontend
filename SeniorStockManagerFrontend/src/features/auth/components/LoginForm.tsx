import { Envelope, Lock, Eye, EyeSlash } from '@phosphor-icons/react';
import { useState } from 'react';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <form className='flex flex-col justify-center items-center'>
      <h1 className='font-bold text-4xl md:text-5xl mb-4 text-secondary'>
        Login
      </h1>
      <div className='flex flex-col w-full max-w-md mb-4'>
        <label
          htmlFor='email'
          className='text-lg font-semibold mb-2 tracking-wide text-textSecondary'
        >
          Email
        </label>
        <div className='flex items-center border border-textSecondary rounded'>
          <Envelope size={24} className='mx-2 text-textSecondary shrink-0' />
          <input
            id='email'
            type='email'
            className='flex-1 h-12 px-4 focus:outline-none'
            placeholder='Digite seu email'
          />
        </div>
      </div>
      <div className='flex flex-col w-full max-w-md mb-2'>
        <label
          htmlFor='password'
          className='text-lg font-semibold mb-2 tracking-wide text-textSecondary'
        >
          Senha
        </label>
        <div className='flex items-center border border-textSecondary rounded'>
          <Lock size={24} className='mx-2 text-textSecondary shrink-0' />
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            className='flex-1 h-12 px-4 focus:outline-none w-full'
            placeholder='Digite sua senha'
          />
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='text-textSecondary mx-2 shrink-0'
          >
            {showPassword ? <EyeSlash size={24} /> : <Eye size={24} />}
          </button>
        </div>
        <p className='mt-2 cursor-pointer hover:text-secondary transition-colors text-right text-textSecondary'>
          Esqueceu sua senha?
        </p>
      </div>
      <button className='bg-primary h-12 w-full max-w-md rounded text-neutralWhite font-semibold hover:bg-hoverButton transition-colors text-lg mt-5'>
        Entrar
      </button>
    </form>
  );
}
