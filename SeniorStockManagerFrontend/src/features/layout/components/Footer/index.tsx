import logoFatec from '@/assets/images/logotipoFatec.png';
import logoCPS from '@/assets/images/logotipoCPS.png';

export default function Footer() {
  return (
    <footer className='h-16 bg-neutralWhite flex overflow-hidden p-4 gap-4 justify-end flex-shrink-0 shadow z-20 sticky bottom-0 right-0 left-0'>
      <img src={logoFatec} alt='logotipo fatec' />
      <img src={logoCPS} alt='logotipo centro paula souza' />
    </footer>
  );
}
