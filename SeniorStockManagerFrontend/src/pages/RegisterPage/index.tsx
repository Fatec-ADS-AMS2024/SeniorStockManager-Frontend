import {
  Ruler,
} from '@phosphor-icons/react';
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { routes } from "../../routes/routes";
import Card from "../../components/Card";
import SearchBar from "../../components/SearchBar";

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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Search Bar Section */}
      <SearchBar placeholder="Digite aqui..." action={console.log} />

      {/* Card Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map(({ text, icon, page, subText }) => (
          <Card
            subText={subText}
            text={text}
            icon={icon}
            page={page}
          />
        ))}
      </div>
    </div>
  );
}
