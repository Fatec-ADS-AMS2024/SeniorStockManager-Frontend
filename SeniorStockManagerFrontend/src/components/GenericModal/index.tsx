import React from 'react';

interface InputProps {
    label: string;
}

function Input({label}: InputProps) {
    const [value, setValue] = React.useState('');

    return (
        <div>
            <label className='text-gray-600 text-sm'>{label}:</label>
            <input
            type="text"
            className="w-full py-2 pl-4 text-sm text-gray-600 rounded-l border-2 border-white bg-white focus:outline-none focus:border-gray-400"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
        </div>
    );
}

interface ModalProps {
    title?: string;
    inputs?: { label: string }[];
    action?: () => void;
}

export default function Modal({ title, inputs, action }: ModalProps) {
    // Função para lidar com o envio do formulário
    const heandledSubmit = () => {
        
        if (action) {
            action();
        }
    }

    // Função para fechar o modal
    const closeModal = () => {
        return null;
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <form className="bg-white rounded-lg shadow-lg w-full max-w-lg" >
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center px-4 py-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="text-gray-500 hover:text-gray-800"></button>
        </div>

        {/* Separador */}
        <hr className="border-t border-gray-300 w-3/4 mx-auto" />

        {/* Corpo do Modal */}
        <div className="p-4">
            {inputs?.map((input) => (
                <Input label={input.label}/>
            ))}
        </div>

        {/* Separador */}
        <hr className="border-t border-gray-300 w-3/4 mx-auto" />

        {/* Rodapé do Modal */}
        <div className="flex justify-end px-4 py-2">
          <button type="button" className="bg-red-600 text-white px-5 py-1 rounded hover:bg-red-700 transition" onClick={closeModal}>
            x Cancelar
          </button>
          <button type="button" className="bg-green-600 text-white px-5 py-1 rounded hover:bg-green-700 transition ml-3" onClick={heandledSubmit}>
            + Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
