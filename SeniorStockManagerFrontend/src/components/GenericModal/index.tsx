import React from 'react';
import { useState } from 'react';

interface InputProps {
  label: string;
  value?: string;
  action: (value: string) => void;
}

function Input({ label, value, action }: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-gray-600 text-sm mb-1 break-all">{label}:</label>
      <input
        type="text"
        className="w-full py-2 pl-4 text-sm text-gray-600 rounded border border-gray-100 focus:outline-none focus:border-gray-300"
        value={value}
        onChange={(e) => {
          action(e.target.value);
        }}
      />
    </div>
  );
}

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <form className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
        {/* Cabeçalho do Modal */}
        <div className="flex justify-center items-center px-4 py-0 mr-0 border-0">
          <h2 className="text-xl font-semibold ">{title}</h2>
        </div>

        {/* Separador */}
        <hr className="border-t border-gray-300 w-5/6 mx-auto my-4" />

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
        <hr className="border-t border-gray-300 w-5/6 mx-auto my-4" />

        {/* Rodapé do Modal */}
        <div className="flex justify-end px-4 py-2">
          <button
            type="button"
            className="bg-red-600 text-white px-5 py-1 rounded hover:bg-red-700 transition"
            onClick={closeModal}
          >
            x Cancelar
          </button>
          <button
            type="button"
            className="bg-green-600 text-white px-5 py-1 rounded hover:bg-green-700 transition ml-3"
            onClick={handleSubmit}
          >
            + Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
