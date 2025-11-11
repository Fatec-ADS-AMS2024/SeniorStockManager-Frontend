import Breadcrumb from '../Breadcrumb';
import PageTitle from '../PageTitle';

interface BreadcrumbPageTitleProps {
  title: string;
}

export default function BreadcrumbPageTitle({
  title,
}: BreadcrumbPageTitleProps) {
  return (
    <div className='bg-neutral p-5'>
      <PageTitle title={title} />
      <Breadcrumb />
    </div>
  );
}
