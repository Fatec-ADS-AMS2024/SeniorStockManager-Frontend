import { useEffect, useState } from "react";
import CarrierService from "../../services/CarrierService";
import Carrier from "../../types/models/Carrier";
import Table from "../../components/Table";
import { CheckCircle, Pencil, Plus, Trash } from "@phosphor-icons/react";
import BreadcrumbPageTitle from "../../components/BreadcrumbPageTitle";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Modal from "../../components/GenericModal";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";

export default function CarrierRegistration() {
  const columns = ["Descrição", "Abreviação"];
  const [data, setData] = useState<Carrier[]>([]);
  const [originalData, setOriginalData] = useState<Carrier[]>([]);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const navigate = useNavigate();
  

  const fetchData = async () => {
    const carrier = new CarrierService();
    const res = await carrier.getAll();
    if (res.code === 200 && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]); // Salva os dados originais
    } else {
      console.error("Erro ao buscar dados:", res.message);
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

    const filteredData = originalData.filter((carrier) =>
      carrier.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  // Abre a modal para deleção pegando os dados da linha
  const openCloseModalDelete = (id?: number) => {
    if (!id) {
      setModalDelete((isOpen) => !isOpen);
      return;
    }

    setModalDelete((isOpen) => !isOpen);
  };

  const openCloseModalInfo = () => {
    setModalInfo((isOpen) => !isOpen);
  };

  const deleteCarrier = async (id: number) => {
    const carrier = new CarrierService();
    const res = await carrier.delete(id);
    if (res.code === 200) {
      setModalDelete(false);
      setModalInfo(true)
      await fetchData();
    } else {
      alert(res.message);
    }
  };

  // Essa função cria botões que tem acesso ao id da linha onde eles aparecem
  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() => navigate(`/registrations/carrier/${id}`)}
        className="text-edit hover:text-hoverEdit"
      >
        <Pencil className="size-6" weight="fill" />
      </button>
      <button
        onClick={() => openCloseModalDelete(id)}
        className="text-danger hover:text-hoverDanger"
      >
        <Trash className="size-6" weight="fill" />
      </button>
    </>
  );

  return (
    <div>
      <BreadcrumbPageTitle title="Cadastro de Unidade de Medida" />
      <div className="bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10">
        <div className="flex items-center justify-between mb-4">
          <SearchBar action={handleSearch} placeholder="Buscar Fornecedor ..." />
          <Button
            label="Adicionar"
            icon={<Plus />}
            iconPosition="left"
            color="success"
            size="medium"
            onClick={() => navigate(routes.FORM_CARRIER.replace(':id', '0'))}
          />
          <Modal<Carrier>
            type="delete"
            title="Deseja realmente excluir essa Unidade de Medida?"
            msgInformation="Ao excluir esta Unidade de Medida, ela será removida permanentemente do sistema."
            action={(carrier) => deleteCarrier(carrier.id)}
            statusModal={modalDelete}
            closeModal={() => openCloseModalDelete()}
          />
          <Modal<Carrier>
            type="info"
            msgInformation="Unidade de Medida excluida com sucesso!"
            icon={<CheckCircle size={90} className="text-success" weight="fill" />}
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