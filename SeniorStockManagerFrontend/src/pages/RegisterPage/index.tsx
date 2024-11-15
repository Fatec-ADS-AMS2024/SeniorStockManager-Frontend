import {
  Ruler,
} from '@phosphor-icons/react';
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";
import Card from "../../components/Card"

const cards = [
  {
    text: 'Unidade de medida',
    subText: 'unidade',
    icon: <Ruler size={28} className='shrink-0' />,
    page: routes.REGISTER_UNIT_OF_MEASURE,
  },
  {
    text: 'Unidade de medida',
    subText: 'Unidades de medidas Cadastradas',
    icon: <Ruler size={28} className='shrink-0' />,
    page: routes.REGISTER_UNIT_OF_MEASURE,
  },
  
];



export default function RegisterPage() {

  return (
    <div className='grid grid-cols-5 justify-center align-middle gap-0 min-h-screen pl-12 pr-'>
      {cards.map(({ text, icon, page, subText }) => (
        <Card 
          subText={subText}
          text={text}
          icon={icon}
          page={page}
        
        />
      
      ))}
    </div>
  );
}
