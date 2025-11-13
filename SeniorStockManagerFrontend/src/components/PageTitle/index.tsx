interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return <h1 className='text-2xl font-bold text-textPrimary' role='heading' aria-level={1}>{title}</h1>;
}
