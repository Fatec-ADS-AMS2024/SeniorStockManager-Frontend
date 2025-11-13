import { Envelope, Lock, Eye, EyeSlash } from '@phosphor-icons/react';
import { useState } from 'react';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <form className='flex flex-col justify-center items-center' role='form' aria-label='Formulário de login'>
      <h1 className='font-bold text-4xl md:text-5xl mb-4 text-secondary' role='heading' aria-level={1}>
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
          <Envelope size={24} className='mx-2 text-textSecondary shrink-0' aria-hidden='true' />
          <input
            id='email'
            type='email'
            className='flex-1 h-12 px-4 focus:outline-none'
            placeholder='Digite seu email'
            aria-label='Campo de email'
            aria-required='true'
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
          <Lock size={24} className='mx-2 text-textSecondary shrink-0' aria-hidden='true' />
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            className='flex-1 h-12 px-4 focus:outline-none w-full'
            placeholder='Digite sua senha'
            aria-label='Campo de senha'
            aria-required='true'
          />
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='text-textSecondary mx-2 shrink-0'
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeSlash size={24} aria-hidden='true' /> : <Eye size={24} aria-hidden='true' />}
          </button>
        </div>
        <button 
          type='button'
          className='mt-2 cursor-pointer hover:text-secondary transition-colors text-right text-textSecondary'
          aria-label='Link para recuperação de senha'
        >
          Esqueceu sua senha?
        </button>
      </div>
      <button 
        type='submit'
        className='bg-primary h-12 w-full max-w-md rounded text-neutralWhite font-semibold hover:bg-hoverButton transition-colors text-lg mt-5'
        aria-label='Botão para fazer login'
      >
        Entrar
      </button>
    </form>
  );
}
