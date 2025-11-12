import { TextInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import useFormData from '@/hooks/useFormData';
import ProductGroup from '@/types/models/ProductGroup';
import { useEffect, useState } from 'react'; // 1. Importar useState

interface ProductGroupFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: ProductGroup) => Promise<void>;
  objectData?: ProductGroup;
}

export default function ProductGroupFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: ProductGroupFormModalProps) {
  const { data, setData, updateField, reset } = useFormData<ProductGroup>({
    id: 0,
    name: '',
  });

  // 2. Estado para armazenar os erros de validação
  const [errors, setErrors] = useState({ name: '' });

  useEffect(() => {
    if (!isOpen) return;
    if (objectData) {
      setData(objectData);
    } else {
      reset();
    }
    // Limpa os erros ao abrir o modal
    setErrors({ name: '' });
  }, [isOpen, objectData, setData, reset]);

  /**
   * Valida os dados do formulário antes do envio.
   * Retorna true se válido, false caso contrário.
   */
  const validate = (): boolean => {
    const newErrors = { name: '' };
    let isValid = true;

    const trimmedName = data.name.trim();

    
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      newErrors.name = 'O nome deve ter entre 2 e 100 caracteres.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    // 3. Executa a validação local primeiro
    if (!validate()) {
      return; // Interrompe o envio se houver erros locais
    }

    try {
      // 4. Tenta enviar os dados (já validados localmente)
      await onSubmit(data);
      handleClose(); // Fecha o modal apenas em caso de sucesso
    } catch (error: any) {
      // 5. Captura erros do backend (ex: duplicados)
      // Esta verificação assume que a API retorna um 409 para duplicados
      // ou uma mensagem de erro específica.
      if (error?.response?.status === 409 || error?.message?.includes('duplicate')) {
        setErrors((prev) => ({
          ...prev,
          name: 'Este nome de grupo já está em uso.',
        }));
      } else {
        // Erro genérico
        setErrors((prev) => ({
          ...prev,
          name: 'Ocorreu um erro ao salvar. Tente novamente.',
        }));
        console.error('Erro ao submeter o formulário:', error);
      }
    }
  };

  const handleClose = () => {
    reset();
    setErrors({ name: '' }); // Garante que os erros sejam limpos ao fechar
    onClose();
  };

  const title = objectData?.id
    ? 'Editar grupo de produto'
    : 'Cadastrar grupo de produto';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        <TextInput<ProductGroup>
          name='name'
          label='Nome'
          onChange={(attribute, value) => {
            updateField(attribute, value);
            // Opcional: limpar o erro ao começar a digitar
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: '' }));
            }
          }}
          value={data.name}
          required
          error={errors.name} // 6. Passa a mensagem de erro para o componente
        />
      </div>
    </FormModal>
  );
}
