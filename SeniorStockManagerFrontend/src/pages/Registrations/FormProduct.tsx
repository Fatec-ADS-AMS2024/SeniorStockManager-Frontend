import { useParams } from "react-router-dom";

export default function FormProduct() {
    const { id } = useParams<{ id: string }>(); // Se for 0, é novo. Se for > 0, é edição
  return <div>FormProduct</div>;
}