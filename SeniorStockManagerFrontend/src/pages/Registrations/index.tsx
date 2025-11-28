import {
  Ruler,
  Truck,
  Handshake,
  Archive,
  Package,
  Factory,
  Users,
} from '@phosphor-icons/react';
import Card from '@/components/Card';
import SearchBar from '@/components/SearchBar';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import useAppRoutes from '@/hooks/useAppRoutes';

export default function RegisterPage() {
  const routes = useAppRoutes();

  const cards = [
    {
      text: routes.USER.displayName,
      subText: 'Usuários cadastrados',
      icon: <Users size={28} className='shrink-0' />,
      page: routes.USER.path,
    },
    {
      text: routes.UNIT_OF_MEASURE.displayName,
      subText: 'Unidades de medidas cadastradas',
      icon: <Ruler size={28} className='shrink-0' />,
      page: routes.UNIT_OF_MEASURE.path,
    },
    {
      text: routes.CARRIER.displayName,
      subText: 'Transportadoras cadastradas',
      icon: <Truck size={28} className='shrink-0' />,
      page: routes.CARRIER.path,
    },
    {
      text: routes.PRODUCT.displayName,
      subText: 'Produtos cadastrados',
      icon: <Ruler size={28} className='shrink-0' />,
      page: routes.PRODUCT.path,
    },
    {
      text: routes.MANUFACTURER.displayName,
      subText: 'Fabricantes cadastrados',
      icon: <Factory size={28} className='shrink-0' />,
      page: routes.MANUFACTURER.path,
    },
    {
      text: routes.PRODUCT_GROUP.displayName,
      subText: 'Grupos de produtos cadastrados',
      icon: <Package size={28} className='shrink-0' />,
      page: routes.PRODUCT_GROUP.path,
    },
    {
      text: routes.SUPPLIER.displayName,
      subText: 'Fornecedores cadastrados',
      icon: <Handshake size={28} className='shrink-0' />,
      page: routes.SUPPLIER.path,
    },
    {
      text: routes.PRODUCT_TYPE.displayName,
      subText: 'Tipos de produto cadastrados',
      icon: <Archive size={28} className='shrink-0' />,
      page: routes.PRODUCT_TYPE.path,
    },
  ];

  return (
    <div className='bg-neutralLighter'>
      <BreadcrumbPageTitle title='Cadastros' />

      <div className='mt-8 px-4 flex flex-wrap items-center gap-8'>
        <SearchBar placeholder='Buscar Cadastro' action={console.log} />
        {/* Card Grid */}
        {cards.map(({ text, icon, page, subText }) => (
          <Card
            key={page}
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
