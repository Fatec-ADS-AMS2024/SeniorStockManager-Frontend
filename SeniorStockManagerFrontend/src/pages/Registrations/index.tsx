import {
  Ruler,
} from '@phosphor-icons/react';
import { routes } from "../../routes/routes";
import Card from "../../components/Card";
import SearchBar from "../../components/SearchBar";
import Breadcrumb_PageTitle from '../../components/BreadcrumbPageTitle';

const cards = [
  {
    text: 'Unidade de medida',
    subText: 'Unidades de medidas Cadastradas',
    icon: <Ruler size={28} className='shrink-0' />,
    page: routes.REGISTER_UNIT_OF_MEASURE,
  },
];

export default function RegisterPage() {
  return (
    <div className=" bg-neutralLighter">
      <Breadcrumb_PageTitle title="Cadastros"/>

      <div className="mt-8 px-4 flex flex-wrap items-center gap-8">
        <SearchBar placeholder="Buscar Cadastro" action={console.log} />
      {/* Card Grid */}
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
