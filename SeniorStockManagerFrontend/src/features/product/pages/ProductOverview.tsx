import { useEffect, useState } from 'react';
import ProductService from '../services/productService';
import Product from '@/types/models/Product';
import Table from '@/components/Table';
import { CheckCircle, Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import Modal from '@/components/GenericModal';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routes/routes';

export default function ProductOverview() {
  const columns = ['Descrição', 'Tipo', 'Grupo'];
  const [data, setData] = useState<Product[]>([]);
  const [originalData, setOriginalData] = useState<Product[]>([]);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  // Pega os dados já cadastrados para mostrar na tabela
  const fetchData = async () => {
    const product = new ProductService();
    const res = await product.getAll();
    if (res.code === 200 && res.data) {
      setData([...res.data.data]);
      setOriginalData([...res.data.data]); // Salva os dados originais
    } else {
      console.error('Erro ao buscar dados:', res.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData); // Restaura os dados originais
      return;
    }

    const filteredData = originalData.filter((product) =>
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  // Abre o modal para deleção, armazenando o ID do produto
  const openCloseModalDelete = (id?: number) => {
    setModalDelete((isOpen) => !isOpen);
    if (id) {
      setProductToDelete(id);
    } else {
      setProductToDelete(null);
    }
  };

  // Abre e fecha o modal de informação
  const openCloseModalInfo = () => {
    setModalInfo((isOpen) => !isOpen);
  };

  // Lógica para excluir o produto
  const deleteProduct = async () => {
    if (productToDelete) {
      const product = new ProductService();
      const res = await product.delete(productToDelete);
      if (res.code === 200) {
        setModalDelete(false);
        setModalInfo(true);
        await fetchData(); // Recarrega a lista
      } else {
        console.error('Erro ao deletar:', res.message);
      }
    }
  };

  // Essa função cria botões que tem acesso ao id da linha onde eles aparecem
  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() =>
          navigate(`${routes.FORM_PRODUCT.replace(':id', String(id))}`)
        }
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
      <BreadcrumbPageTitle title='Cadastro de Produtos' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar action={handleSearch} placeholder='Buscar Produtos...' />
          <Button
            label='Adicionar Produto'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={() => navigate(routes.FORM_PRODUCT.replace(':id', '0'))}
          />
        </div>
        <Table
          columns={columns}
          data={data}
          actions={(id) => <Actions id={id} />}
        />
      </div>

      <Modal
        title='Confirmar Exclusão'
        msgInformation='Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.'
        statusModal={modalDelete}
        closeModal={() => openCloseModalDelete()}
        action={deleteProduct} // Chama a função de exclusão
        type='delete'
      />

      <Modal
        title='Sucesso'
        msgInformation='Produto excluído com sucesso!'
        icon={<CheckCircle size={32} />}
        statusModal={modalInfo}
        closeModal={() => openCloseModalInfo()}
        type='info'
      />
    </div>
  );
}
