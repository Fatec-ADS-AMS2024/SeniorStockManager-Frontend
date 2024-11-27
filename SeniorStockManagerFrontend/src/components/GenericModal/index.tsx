import { useState } from 'react';
import Input from '../InputText';
import Button from '../Button';
import { Plus } from '@phosphor-icons/react';
import { X } from '@phosphor-icons/react';

interface ModalProps {
  title?: string;
  inputs?: { label: string }[];
  action?: (data: { [key: string]: string }) => void;
  statusModal?: boolean;
  closeModal?: () => void;
}

export default function Modal({title = "Título", inputs = [], action, statusModal = true, closeModal}: ModalProps) {
  const [formData, setFormData] = useState({});

  const handleFormSubmit = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = () => {
    if (action) {
      action(formData);
    }
  };

  if (!statusModal)
    return null;  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent/50 z-50">
      <form className="bg-surface rounded-lg shadow-lg w-full max-w-xl p-4 bg-white">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center px-2">
          <h2 className="text-xl font-semibold text-textPrimary">{title}</h2>
        </div>
        {/* Separador */}
        <hr className="border-t border-neutralDarker w-[99%] mx-auto my-4" />

        {/* Corpo do Modal */}
        <div className="mb-4 px-2">
          {inputs.map((input) => (
            <Input
              key={input.label}
              label={input.label}
              action={(value) => handleFormSubmit(input.label, value)}
            />
          ))}
        </div>

        {/* Separador */}
        <hr className="border-t border-neutralDarker w-[99%] mx-auto my-4" />

        {/* Rodapé do Modal */}
        <div className="flex justify-end px-4 py-2 gap-7">
          <Button
            icon={<X size={20} color='white'/>}
            label="Cancelar"
            onClick={closeModal}
            color='danger'
            size='medium'
            className='rounded-[5px] w-32'
          />
          <Button
            icon={<Plus size={20} color='white'/>}
            label="Salvar"
            onClick={handleSubmit}
            color='success'
            size='medium'
            className='rounded-[5px] w-32'
            type='button'
          />
        </div>
      </form>
    </div>
  );
}
