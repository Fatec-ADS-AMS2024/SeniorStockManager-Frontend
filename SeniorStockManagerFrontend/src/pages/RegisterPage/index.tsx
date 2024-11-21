import {
  Ruler,
} from '@phosphor-icons/react';
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { routes } from "../../routes/routes";
import Card from "../../components/Card";
import SearchBar from "../../components/SearchBar";
import Breadcrumb from '../../components/Breadcrumb';
import PageTitle from '../../components/PageTitle';

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
    <div className="min-h-screen bg-background py-8 px-4">
      {/* Search Bar Section */}
      <PageTitle title="Cadastros"/>
      <Breadcrumb/>
      <SearchBar placeholder="Digite aqui..." action={console.log} />

      {/* Card Grid */}
      <div className="mt-8 flex flex-wrap items-center gap-8">
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
