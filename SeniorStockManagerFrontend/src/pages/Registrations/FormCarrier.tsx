import { useParams } from "react-router-dom";

export default function FormCarrier() {
    const { id } = useParams<{ id: string }>(); // Se for 0, é novo. Se for > 0, é edição
  return <div>FormCarrier</div>;
}