import { useEffect, useState } from 'react';
import UnitOfMeasureService from '../services/unitOfMeasureService';
import UnitOfMeasure from '@/types/models/UnitOfMeasure';
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
    label: 'Abreviação',
    attribute: 'abbreviation',
    defaultValue: '',
  },
  {
    label: 'Descrição',
    attribute: 'description',
    defaultValue: '',
  },
];

export default function UnitOfMeasureOverview() {
  const columns = ['Descrição', 'Abreviação'];
  const [data, setData] = useState<UnitOfMeasure[]>([]);
  const [originalData, setOriginalData] = useState<UnitOfMeasure[]>([]);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);

  const fetchData = async () => {
    const res = await UnitOfMeasureService.getAll();
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

    const filteredData = originalData.filter((unitOfMeasure) =>
      unitOfMeasure.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
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
          rowValues[input.attribute as keyof UnitOfMeasure]
        );
      });
    } else {
      alert('Registro não encontrado');
      return;
    }

    setModalEdit((isOpen) => !isOpen);
  };
  const validate = (unitOfMeasure: UnitOfMeasure) => {
    if (unitOfMeasure.abbreviation.trim() === '') {
      alert('Abreviação não pode ser nula ou vazia');
      return false;
    }
    if (unitOfMeasure.description.trim() === '') {
      alert('Descrição não pode ser nula ou vazia');
      return false;
    }
    if (unitOfMeasure.description.trim().length > 50) {
      alert('Campo descrição deve conter menos de 50 caracteres');
      return false;
    }
    if (unitOfMeasure.abbreviation.trim().length > 50) {
      alert('Campo abreviação deve conter menos de 50 caracteres');
      return false;
    }

    return true;
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
          rowValues[input.attribute as keyof UnitOfMeasure]
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

  const registerUnitOfMeasure = async (model: UnitOfMeasure) => {
    if (!validate(model)) return;

    const res = await UnitOfMeasureService.create({
      ...model,
      id: Number(model.id),
    });
    if (res.success) {
      alert(`Unidade de medida ${res.data?.description} criada com sucesso!`);
      setModalRegister(false);
      await fetchData();
    } else {
      alert(res.message);
    }
  };

  const editUnitOfMeasure = async (id: number, model: UnitOfMeasure) => {
    if (!validate(model)) return;

    const res = await UnitOfMeasureService.update(id, model);
    if (res.success) {
      alert(
        `Unidade de medida ${res.data?.description} atualizada com sucesso!`
      );
      setModalEdit(false);
      await fetchData();
    } else {
      alert(res.message);
    }
  };

  const deleteUnitOfMeasure = async (id: number) => {
    const res = await UnitOfMeasureService.deleteById(id);
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
      <BreadcrumbPageTitle title='Cadastro de Unidade de Medida' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar
            action={handleSearch}
            placeholder='Buscar Unidade de Medida...'
          />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCloseModalRegister}
          />
          <Modal<UnitOfMeasure>
            title='Cadastrar Unidade de Medida'
            inputs={inputs}
            action={registerUnitOfMeasure}
            statusModal={modalRegister}
            closeModal={openCloseModalRegister}
            type='create'
          />
          <Modal<UnitOfMeasure>
            type='update'
            title='Editar Unidade de Medida'
            inputs={inputs}
            action={(unitOfMeasure) =>
              editUnitOfMeasure(unitOfMeasure.id, unitOfMeasure)
            }
            statusModal={modalEdit}
            closeModal={() => openCloseModalEdit()}
          />
          <Modal<UnitOfMeasure>
            type='delete'
            title='Deseja realmente excluir essa Unidade de Medida?'
            msgInformation='Ao excluir esta Unidade de Medida, ela será removida permanentemente do sistema.'
            action={(unitOfMeasure) => deleteUnitOfMeasure(unitOfMeasure.id)}
            statusModal={modalDelete}
            closeModal={() => openCloseModalDelete()}
            inputs={inputs}
          />
          <Modal<UnitOfMeasure>
            type='info'
            msgInformation='Unidade de Medida excluida com sucesso!'
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
