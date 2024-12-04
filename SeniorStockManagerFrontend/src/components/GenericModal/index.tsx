import { useState } from 'react';
import Input from '../InputText';
import Button from '../Button';
import { Plus, X, Pencil } from '@phosphor-icons/react';

interface ModalProps<T> {
  title?: string;
  inputs?: { label?: string, attribute: string, defaultValue?: string}[];
  action?: ((dados: T) => void);
  optionalAction?: () => void;
  statusModal: boolean;
  closeModal: () => void;
  type: "create" | "update" | "view" | "delete" | "info"; 
  msgConfirm?: string
  msgInformation?: string
  className?: string
  icon ?: JSX.Element
}

export default function Modal<T>({icon, title = "Título", inputs = [], action, statusModal = true, closeModal, type, msgConfirm, msgInformation, className = "", optionalAction}: ModalProps<T>) {
  const [formData, setFormData] = useState<Record<string, string>>(
    inputs.reduce((prev, input) => ({...prev, [input.attribute]: input.defaultValue || ""}), {})
  );

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
  // Modal de Criação
  if (type === "create"){
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent/50 z-50">
        <form className={`rounded-lg shadow-lg w-full max-w-xl p-4 bg-neutralWhite ${className}`}>
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
                  value={formData[input.attribute]}
                />
            ))}
          </div>

          {/* Separador */}
          <hr className="border-t border-neutralDarker w-[99%] mx-auto my-4" />

          {/* Rodapé do Modal */}
          <div className="flex justify-end px-4 py-2 gap-7">
            <Button
              icon={<X size={20} className='text-neutralWhite'/>}
              label="Cancelar"
              onClick={closeModal}
              color='danger'
              size='medium'
              className='rounded-[5px] w-32'
            />
            <Button
              icon={<Plus size={20} className='text-neutralWhite'/>}
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
  // Modal de Edit
  else if (type === "update"){
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent/50 z-50">
        <form className="rounded-lg shadow-lg w-full max-w-xl p-4 bg-neutralWhite">
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
                value={formData[input.attribute]}
              />
            ))}
          </div>

          {/* Separador */}
          <hr className="border-t border-neutralDarker w-[99%] mx-auto my-4" />

          {/* Rodapé do Modal */}
          <div className="flex justify-end px-4 py-2 gap-7">
            <Button
              icon={<X size={20} className='text-neutralWhite'/>}
              label="Cancelar"
              onClick={closeModal}
              color='danger'
              size='medium'
              className='rounded-[5px] w-32'
            />
            <Button
              icon={<Pencil weight='fill' size={20} className='text-neutralWhite'/>}
              label="Salvar"
              onClick={handleSubmit}
              color='edit'
              size='medium'
              className='rounded-[5px] w-32'
              type='button'
            />
          </div>
        </form>
      </div>
    );
  }
  else if (type === 'delete') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent/50 z-50">
        <form className="rounded-lg shadow-lg w-full max-w-xl p-3 bg-neutralWhite px-5 text-start py-7">
          <h2 className="text-2xl font-semibold text-textPrimary">{title}</h2>
          <div className="mb-4 px-2">
          {inputs.map((input) => (
              <Input
                key={input.attribute}
                label={input.label}
                action={(value) => handleFormSubmit(input.attribute, value)}
                value={formData[input.attribute]}
                property={{type: "hidden"}}
              />
            ))}
          </div>
          <p className="text-md text-textSecondary break-words">{msgConfirm}</p>
          <div className="flex justify-end px-4 py-2 gap-7">
            <Button
              label="Cancelar"
              onClick={closeModal}
              color='textSecondary'
              size='medium'
              className='rounded-[5px] w-32 font-semibold'
            />
            <Button
              label="Sim, desejo excluir!"
              onClick={() => {handleSubmit(); closeModal(); if (optionalAction) optionalAction();}}
              color='confirmation'
              size='medium'
              className='rounded-[5px] font-semibold'
              type='button'
            />
          </div>
        </form>
      </div>
    );
  }
  else  if (type === 'info') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent/50 z-50" onClick={closeModal}>
        <div className="flex flex-col justify-center items-center rounded-lg shadow-lg w-full max-w-md bg-neutralWhite px-5 text-start py-5">
          {icon}
          <span className='text-textSecondary text-3xl font-semibold text-center'>{msgInformation}</span>
        </div>
      </div>
    );
  }
    
}
