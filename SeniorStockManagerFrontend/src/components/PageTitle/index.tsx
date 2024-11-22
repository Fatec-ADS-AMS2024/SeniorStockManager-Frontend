interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
    );
  }
  