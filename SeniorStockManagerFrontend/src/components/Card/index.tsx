import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  text: string;
  subText: string;
  icon: JSX.Element;
  page: string;
}

export default function Card({ text, subText, icon, page }: CardProps) {
  const navigate = useNavigate();

  return (
    <div
      role='button'
      aria-label={`Navegar para ${text} - ${subText}`}
      className='w-64 h-36 bg-neutralWhite hover:border-primary rounded-lg shadow-md border border-neutralLighter cursor-pointer hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50'
      onClick={() => navigate(page)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(page);
        }
      }}
      tabIndex={0}
    >
      <div className='h-1/4 relative'>
        <div className='flex items-center justify-center w-14 h-14 rounded-full mb-2 text-neutralWhite p-3 absolute top-3 left-3 bg-neutralDarker' aria-hidden='true'>
          {icon}
        </div>
      </div>

      <div className='flex items-start justify-start pt-8 mt-1 h-3/4 border-t px-4'>
        <div className='z-10 flex flex-col text-textPrimary'>
          <p className='text-lg font-medium text-left' role='heading' aria-level={3}>{text}</p>
          <p className='text-sm text-left text-textSecondary'>{subText}</p>
        </div>
      </div>
    </div>
  );
}
