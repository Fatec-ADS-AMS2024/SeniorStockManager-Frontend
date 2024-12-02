import { useState } from 'react';
import Input from '../InputText';
import Button from '../Button';
import { Plus } from '@phosphor-icons/react';
import { X } from '@phosphor-icons/react';

interface ModalProps<T> {
  title?: string;
  inputs?: { label: string, attribute: string}[];
  action?: (dados: T) => void;
  statusModal?: boolean;
  closeModal?: () => void;
}

export default function Modal<T>({title = "Título", inputs = [], action, statusModal = true, closeModal}: ModalProps<T>) {
  const [formData, setFormData] = useState({});

  const handleFormSubmit = (attribute: string, value: string) => {
    setFormData((prev) => ({ ...prev, [attribute]: value }));
  };

  const handleSubmit = () => {
    if (action) {
      action(formData as T);
    }
  };

  if (!statusModal)
    return null;  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent/50 z-50">
      <form className="bg-surface rounded-lg shadow-lg w-full max-w-xl p-4 bg-neutralWhite">
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
              action={(value) => handleFormSubmit(input.attribute, value)}
            />
          ))}
        </div>

        {/* Separador */}
        <hr className="border-t border-neutralDarker w-[99%] mx-auto my-4" />

        {/* Rodapé do Modal */}
        <div className="flex justify-end px-4 py-2 gap-7">
          <Button
            icon={<X size={20} color='neutralWhite'/>}
            label="Cancelar"
            onClick={closeModal}
            color='danger'
            size='medium'
            className='rounded-[5px] w-32'
          />
          <Button
            icon={<Plus size={20} color='neutralWhite'/>}
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
