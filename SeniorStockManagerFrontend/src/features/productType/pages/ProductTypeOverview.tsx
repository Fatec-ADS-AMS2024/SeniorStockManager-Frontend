import { useEffect, useState } from 'react';
import ProductTypeService from '../services/productTypeService';
import ProductType from '@/types/models/ProductType';
import Table from '@/components/Table';
import { CheckCircle, Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import Modal from '@/components/GenericModal';

const inputs = [
  {
    label: 'Id',
    attribute: 'id',
    defaultValue: '',
    locked: true,
  },
  {
    label: 'Nome',
    attribute: 'Name',
    defaultValue: '',
  },
];

export default function ProductTypeOverview() {
  const columns = ['Nome'];
  const [data, setData] = useState<ProductType[]>([]);
  const [originalData, setOriginalData] = useState<ProductType[]>([]);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);

  const fetchData = async () => {
    const res = await ProductTypeService.getAll();
    if (res.success && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]); // Salva os dados originais
    } else {
      alert(`Erro ao buscar dados: ${res.message}`);
    }
  };

  // Pega os dados ja cadastrados para mostrar na tabela
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData); // Restaura os dados originais
      return;
    }
  };

  // Pega os valores de uma linha baseado em seu id
  const getRowValues = (id: number) => {
    const existingRow = data.find((row) => row.id === id);
    return existingRow;
  };

  const openCloseModalRegister = () => {
    setModalRegister((isOpen) => !isOpen);
  };

  // Abre a modal para edição pegando os dados da linha
  const openCloseModalEdit = (id?: number) => {
    if (!id) {
      setModalEdit((isOpen) => !isOpen);
      return;
    }

    const rowValues = getRowValues(id);
    if (rowValues) {
      inputs.forEach((input) => {
        input.defaultValue = String(
          rowValues[input.attribute as keyof ProductType]
        );
      });
    } else {
      alert('Registro não encontrado');
      return;
    }

    setModalEdit((isOpen) => !isOpen);
  };

  // Abre a modal para deleção pegando os dados da linha
  const openCloseModalDelete = (id?: number) => {
    if (!id) {
      setModalDelete((isOpen) => !isOpen);
      return;
    }

    // Necessário para funcionar
    const rowValues = getRowValues(id);
    if (rowValues) {
      inputs.forEach((input) => {
        input.defaultValue = String(
          rowValues[input.attribute as keyof ProductType]
        );
      });
    } else {
      alert('Registro não encontrado');
      return;
    }

    setModalDelete((isOpen) => !isOpen);
  };

  const openCloseModalInfo = () => {
    setModalInfo((isOpen) => !isOpen);
  };

  const registerProductType = async (model: ProductType) => {
    const res = await ProductTypeService.create({
      ...model,
      id: Number(model.id),
    });
    if (res.success) {
      alert(`Tipo de produto ${res.data?.name} criada com sucesso!`);
      setModalRegister(false);
      await fetchData();
    } else {
      alert(res.message);
    }
  };

  const editProductType = async (id: number, model: ProductType) => {
    const res = await ProductTypeService.update(id, model);
    if (res.success) {
      alert(`Tipo de produto ${res.data?.name} atualizada com sucesso!`);
      setModalEdit(false);
      await fetchData();
    } else {
      alert(res.message);
    }
  };

  const deleteProductType = async (id: number) => {
    const res = await ProductTypeService.deleteById(id);
    if (res.success) {
      setModalDelete(false);
      setModalInfo(true);
      await fetchData();
    } else {
      alert(res.message);
    }
  };

  // Essa função cria botões que tem acesso ao id da linha onde eles aparecem
  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() => openCloseModalEdit(id)}
        className='text-edit hover:text-hoverEdit'
      >
        <Pencil className='size-6' weight='fill' />
      </button>
      <button
        onClick={() => openCloseModalDelete(id)}
        className='text-danger hover:text-hoverDanger'
      >
        <Trash className='size-6' weight='fill' />
      </button>
    </>
  );

  return (
    <div>
      <BreadcrumbPageTitle title='Cadastro de Tipo de Produto' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar
            action={handleSearch}
            placeholder='Buscar Tipo de Produto...'
          />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCloseModalRegister}
          />
          <Modal<ProductType>
            title='Cadastrar Tipo de Produto'
            inputs={inputs}
            action={registerProductType}
            statusModal={modalRegister}
            closeModal={openCloseModalRegister}
            type='create'
          />
          <Modal<ProductType>
            type='update'
            title='Editar Tipo de Produto'
            inputs={inputs}
            action={(productType) =>
              editProductType(productType.id, productType)
            }
            statusModal={modalEdit}
            closeModal={() => openCloseModalEdit()}
          />
          <Modal<ProductType>
            type='delete'
            title='Deseja realmente excluir esse Tipo de Produto?'
            msgInformation='Ao excluir este Tipo de Produto, ela será removida permanentemente do sistema.'
            action={(productType) => deleteProductType(productType.id)}
            statusModal={modalDelete}
            closeModal={() => openCloseModalDelete()}
            inputs={inputs}
          />
          <Modal<ProductType>
            type='info'
            msgInformation='Tipo de Produto excluida com sucesso!'
            icon={
              <CheckCircle size={90} className='text-success' weight='fill' />
            }
            statusModal={modalInfo}
            closeModal={openCloseModalInfo}
          />
        </div>
        <Table
          columns={columns}
          data={data}
          actions={(id) => <Actions id={id} />}
        />
      </div>
    </div>
  );
}
