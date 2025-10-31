import { useEffect, useState } from 'react';
import ManufacturerService from '../../services/manufacturerService';
import Manufacturer from '../../types/models/Manufacturer';
import Table from '../../components/Table';
import { CheckCircle, Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '../../components/BreadcrumbPageTitle';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import Modal from '../../components/GenericModal';

const inputs = [
  {
    label: 'Id',
    attribute: 'id',
    defaultValue: '',
    locked: true,
  },
  {
    label: 'Nome Corporativo',
    attribute: 'abbreviation',
    defaultValue: '',
  },
  {
    label: 'Nome Comercial',
    attribute: 'description',
    defaultValue: '',
  },
  {
    label: 'CpfCnpj',
    attribute: 'description',
    defaultValue: '',
  },
];

export default function ManufacturerRegistration() {
  const columns = ['Nome Corporativo', 'Nome Comercial', 'CpfCnpj'];
  const [data, setData] = useState<Manufacturer[]>([]);
  const [originalData, setOriginalData] = useState<Manufacturer[]>([]);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);

  const fetchData = async () => {
    const manufacturer = new ManufacturerService();
    const res = await manufacturer.getAll();
    if (res.code === 200 && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]); // Salva os dados originais
    } else {
      console.error('Erro ao buscar dados:', res.message);
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

    const filteredData = originalData.filter((manufacturer) =>
      manufacturer.CorporateName.toLowerCase().includes(
        searchTerm.toLowerCase()
      )
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
        input.defaultValue = rowValues[input.attribute];
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
        input.defaultValue = rowValues[input.attribute];
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

  const registerManufacturer = async (model: Manufacturer) => {
    const manufacturer = new ManufacturerService();
    const res = await manufacturer.create({
      ...model,
      id: Number(model.id),
    });
    if (res.code === 200) {
      alert(`Fabricante ${res.data?.CorporateName} cadastrado com sucesso!`);
      setModalRegister(false);
      await fetchData();
    } else {
      alert(res.message);
    }
  };

  const editManufacturer = async (id: number, model: Manufacturer) => {
    const manufacturer = new ManufacturerService();
    const res = await manufacturer.update(id, model);
    if (res.code === 200) {
      alert(`Fabricante ${res.data?.CorporateName} atualizado com sucesso!`);
      setModalEdit(false);
      await fetchData();
    } else {
      alert(res.message);
    }
  };

  const deleteManufacturer = async (id: number) => {
    const manufacturer = new ManufacturerService();
    const res = await manufacturer.delete(id);
    if (res.code === 200) {
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
      <BreadcrumbPageTitle title='Cadastro de Fabricante' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar action={handleSearch} placeholder='Buscar Fabricante...' />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCloseModalRegister}
          />
          <Modal<Manufacturer>
            title='Cadastrar Fabricante'
            inputs={inputs}
            action={registerManufacturer}
            statusModal={modalRegister}
            closeModal={openCloseModalRegister}
            type='create'
          />
          <Modal<Manufacturer>
            type='update'
            title='Editar Fabricante'
            inputs={inputs}
            action={(manufacturer) =>
              editManufacturer(manufacturer.id, manufacturer)
            }
            statusModal={modalEdit}
            closeModal={() => openCloseModalEdit()}
          />
          <Modal<Manufacturer>
            type='delete'
            title='Deseja realmente excluir esse Fabricante?'
            msgInformation='Ao excluir este Fabricante, ela será removida permanentemente do sistema.'
            action={(manufacturer) => deleteManufacturer(manufacturer.id)}
            statusModal={modalDelete}
            closeModal={() => openCloseModalDelete()}
            inputs={inputs}
          />
          <Modal<Manufacturer>
            type='info'
            msgInformation='Fabricante excluido com sucesso!'
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
