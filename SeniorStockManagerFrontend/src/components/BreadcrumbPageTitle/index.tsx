import Breadcrumb from '../Breadcrumb';
import PageTitle from '../PageTitle';

interface BreadcrumbPageTitleProps {
  title: string;
}

export default function BreadcrumbPageTitle({
  title,
}: BreadcrumbPageTitleProps) {
  return (
    <div
      className='bg-neutral p-5'
      role='region'
      aria-label={`Cabeçalho da página ${title}`}
    >
      {/* PageTitle e Breadcrumb já devem ter sua própria semântica/ARIA. */}
      <PageTitle title={title} />
      <Breadcrumb />
    </div>
  );
}
