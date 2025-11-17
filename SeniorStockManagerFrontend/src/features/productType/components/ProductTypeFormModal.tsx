import { SelectInput, TextInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import { ProductGroupService } from '@/features/productGroup';
import useFormData from '@/hooks/useFormData';
import { useModalForm } from '@/hooks/useModalForm'; // 1. Importar o hook
import ProductGroup from '@/types/models/ProductGroup';
import ProductType from '@/types/models/ProductType';
import { useEffect, useState } from 'react';

interface ProductTypeFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: ProductType) => Promise<void>;
  objectData?: ProductType;
}

// 2. Definir um tipo para o estado de erros
type ValidationErrors = {
  name?: string;
  productGroupId?: string;
  api?: string; // Para erros gerais da API (ex: duplicados)
};

export default function ProductTypeFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: ProductTypeFormModalProps) {
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const { data, setData, updateField, reset } = useFormData<ProductType>({
    id: 0,
    name: '',
    productGroupId: 0,
  });

  // 3. Adicionar estado de erros e hook de submissão
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { isSubmitting, handleSubmit: handleFormSubmit } = useModalForm();

  const fetchProductGroups = async () => {
    const res = await ProductGroupService.getAll();
    if (res.success && res.data) {
      setProductGroups(res.data);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchProductGroups();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (objectData) {
      setData(objectData);
    } else {
      reset();
    }
    // 4. Limpar erros ao abrir o modal
    setErrors({});
  }, [isOpen, objectData, setData, reset]);

  /**
   * Valida os dados do formulário de acordo com os critérios de aceite.
   * @returns true se o formulário for válido, false caso contrário.
   */
  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    // AC 1: O campo name deve ter entre 2 e 100 caracteres.
    const nameLength = data.name.trim().length;
    if (nameLength < 2 || nameLength > 100) {
      newErrors.name = 'O nome deve ter entre 2 e 100 caracteres.';
    }

    // AC 2: O campo productGroupId não deve ser nulo
    if (!data.productGroupId || data.productGroupId === 0) {
      newErrors.productGroupId = 'Selecione um grupo de produto.';
    }

    setErrors(newErrors);
    // Retorna true se não houver chaves no objeto de erros
    return Object.keys(newErrors).length === 0;
  };

  // 5. Atualizar handleSubmit para incluir validação e tratamento de erros
  const handleSubmit = async () => {
    // Roda a validação do cliente primeiro
    if (!validate()) {
      return;
    }

    // Limpa erros de API anteriores
    setErrors((prev) => ({ ...prev, api: undefined }));

    try {
      // Usa o hook para tratar a submissão
      await handleFormSubmit(
        () => onSubmit(data), // Função que executa a submissão (vem da prop)
        handleClose // Callback de sucesso (fecha o modal)
      );
    } catch (error: any) {
      // AC 3: Captura erros da API (ex: duplicados)
      console.error('Form submission error:', error);
      const apiError =
        error.message ||
        'Erro ao salvar. Verifique se já existe um registro com este nome.';
      setErrors((prev) => ({ ...prev, api: apiError }));
    }
  };

  const handleClose = () => {
    setErrors({}); // Limpa erros ao fechar
    onClose();
  };

  const title = objectData?.id
    ? 'Editar tipo de produto'
    : 'Cadastrar tipo de produto';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
      isSubmitting={isSubmitting} // Passa o estado de submissão para o modal
    >
      <div className='flex flex-col gap-4'>
        {/* 6. Exibir erro da API */}
        {errors.api && (
          <div className='rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700'>
            {errors.api}
          </div>
        )}

        <TextInput<ProductType>
          name='name'
          label='Nome'
          onChange={updateField}
          value={data.name}
          required
          error={errors.name} // 7. Passar erro para o componente
          disabled={isSubmitting} // Desabilitar durante a submissão
        />
        <SelectInput<ProductType>
          name='productGroupId'
          label='Grupo'
          onChange={updateField}
          value={data.productGroupId}
          options={productGroups.map((group) => ({
            label: group.name,
            value: group.id,
          }))}
          required
          error={errors.productGroupId} // 8. Passar erro para o componente
          disabled={isSubmitting} // Desabilitar durante a submissão
        />
      </div>
    </FormModal>
  );
}