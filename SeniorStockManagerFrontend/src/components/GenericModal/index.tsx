import { useState } from 'react';
import Input from '../InputText';

interface ModalProps {
  title?: string;
  inputs?: { label: string }[];
  action?: (data: { [key: string]: string }) => void;
  statusModal?: boolean;
}

export default function Modal({title = "Título", inputs = [], action, statusModal = true}: ModalProps) {
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(statusModal);

  const handleFormSubmit = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    if (action) {
      action(formData);
    }
  };

  if (!showModal)
    return null;  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent/50 z-50">
      <form className="bg-neutralWhite rounded-lg shadow-lg w-full max-w-lg p-4">
        {/* Cabeçalho do Modal */}
        <div className="flex justify-center items-center px-4 py-0 mr-0 border-0">
          <h2 className="text-xl font-semibold ">{title}</h2>
        </div>

        {/* Separador */}
        <hr className="border-t border-neutralDark w-5/6 mx-auto my-4" />

        {/* Corpo do Modal */}
        <div>
          {inputs.map((input) => (
            <Input
              key={input.label}
              label={input.label}
              action={(value) => handleFormSubmit(input.label, value)}
            />
          ))}
        </div>

        {/* Separador */}
        <hr className="border-t border-neutralDark w-5/6 mx-auto my-4" />

        {/* Rodapé do Modal */}
        <div className="flex justify-end px-4 py-2">
          <button
            type="button"
            className="bg-red001 text-neutralWhite px-5 py-1 rounded hover:bg-red002 transition"
            onClick={closeModal}
          >
            x Cancelar
          </button>
          <button
            type="button"
            className="bg-green001 text-neutralWhite px-5 py-1 rounded hover:bg-green002 transition ml-3"
            onClick={handleSubmit}
          >
            + Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
