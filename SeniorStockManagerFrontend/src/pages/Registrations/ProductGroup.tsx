import { useEffect, useState } from "react";
import ProductGroupService from "../../services/productGroupService";
import ProductGroup from "../../types/models/ProductGroup";
import ProductType from "../../types/models/ProductType";
import ProductTypeService from "../../services/ProductTypeService";
import Table from "../../components/Table";
import { CheckCircle, Pencil, Plus, Trash } from "@phosphor-icons/react";
import BreadcrumbPageTitle from "../../components/BreadcrumbPageTitle";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Modal from "../../components/GenericModal";

const inputs: {
  label: string;
  attribute: keyof ProductGroup;
  defaultValue: string;
}[] = [
  {
    label: "Nome",
    attribute: "name",
    defaultValue: "",
  },
];

export default function ProductGroupRegistration() {
  const columns = ["Nome"];
  const [data, setData] = useState<ProductGroup[]>([]);
  const [originalData, setOriginalData] = useState<ProductGroup[]>([]);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const fetchData = async () => {
    const productGroupService = new ProductGroupService();
    const res = await productGroupService.getAll();
    if (res.code === 200 && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]);
    } else {
      console.error("Erro ao buscar dados:", res.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData);
      return;
    }
    const filteredData = originalData.filter((productGroup) =>
      productGroup.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  const getRowValues = (id: number) => {
    return data.find((row) => row.id === id);
  };

  const openCloseModalRegister = () => {
    setModalRegister((isOpen) => !isOpen);
  };

  const openCloseModalEdit = (id?: number) => {
    if (!id) {
      setModalEdit((isOpen) => !isOpen);
      setCurrentId(null);
      return;
    }

    const rowValues = getRowValues(id);
    if (rowValues) {
      inputs.forEach((input) => {
        input.defaultValue = String(rowValues[input.attribute]);
      });
      setCurrentId(id);
    } else {
      alert("Registro não encontrado");
      return;
    }

    setModalEdit(true);
  };

  const openCloseModalDelete = (id?: number) => {
    if (!id) {
      setModalDelete((isOpen) => !isOpen);
      setCurrentId(null);
      return;
    }

    const rowValues = getRowValues(id);
    if (rowValues) {
      inputs.forEach((input) => {
        input.defaultValue = String(rowValues[input.attribute]);
      });
      setCurrentId(id);
    } else {
      alert("Registro não encontrado");
      return;
    }

    setModalDelete(true);
  };

  const openCloseModalInfo = () => {
    setModalInfo((isOpen) => !isOpen);
  };

  const registerProductGroup = async (model: ProductGroup) => {
    const productGroupService = new ProductGroupService();

    if (!model.name || model.name.trim().length < 3 || model.name.trim().length > 100) {
      alert("Nome deve ter entre 3 e 100 caracteres.");
      return;
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(model.name)) {
      alert("Nome deve conter apenas letras e espaços.");
      return;
    }
    const nameExists = originalData.some(
      (pg) => pg.name.toLowerCase() === model.name.trim().toLowerCase()
    );
    if (nameExists) {
      alert("Já existe um Grupo de Produto com esse nome.");
      return;
    }

    const res = await productGroupService.create(model);
    if (res.code === 200) {
      alert(`Grupo de Produto "${res.data?.name}" criado com sucesso!`);
      setModalRegister(false);
      await fetchData();
    } else if (res.code === 500 && res.message) {
      alert(res.message);
    } else {
      alert(res.message || "Erro inesperado ao criar o Grupo de Produto.");
    }
  };

  const editProductGroup = async (id: number, model: ProductGroup) => {
    const productGroupService = new ProductGroupService();

    if (!model.name || model.name.trim().length < 3 || model.name.trim().length > 100) {
      alert("Nome deve ter entre 3 e 100 caracteres.");
      return;
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(model.name)) {
      alert("Nome deve conter apenas letras e espaços.");
      return;
    }
    const nameExists = originalData.some(
      (pg) => pg.id !== id && pg.name.toLowerCase() === model.name.trim().toLowerCase()
    );
    if (nameExists) {
      alert("Já existe um Grupo de Produto com esse nome.");
      return;
    }

    const res = await productGroupService.update(id, model);
    if (res.code === 200) {
      alert(`Grupo de Produto "${res.data?.name}" atualizado com sucesso!`);
      setModalEdit(false);
      await fetchData();
    } else if (res.code === 500 && res.message) {
      alert(res.message);
    } else {
      alert(res.message || "Erro inesperado ao atualizar o Grupo de Produto.");
    }
  };

const deleteProductGroup = async (id: number) => {
  const productTypeService = new ProductTypeService();
  const productGroupService = new ProductGroupService();

  try {
    // Buscar todos os product types
    const productTypesRes = await productTypeService.getAll();
    if (productTypesRes.code === 200 && productTypesRes.data) {
      const hasLinkedProductTypes = productTypesRes.data.some(pt => pt.productGroupId === id);
      if (hasLinkedProductTypes) {
        alert("Não é possível excluir este Grupo de Produto pois está vinculado a um Tipo de Produto.");
        return;
      }
    } else {
      alert("Erro ao verificar vínculos de Tipo de Produto.");
      return;
    }

    // Se não estiver vinculado, prossegue para exclusão
    const res = await productGroupService.delete(id);

    if (res.code === 200) {
      setModalDelete(false);
      setModalInfo(true);
      await fetchData();
    } else if (res.code === 400 && res.message?.includes("vinculado")) {
      alert("Não é possível excluir este Grupo de Produto pois está vinculado a um Tipo de Produto.");
    } else if (res.code === 500 && res.message) {
      alert(res.message);
    } else {
      alert(res.message || "Erro inesperado ao excluir o Grupo de Produto.");
    }
  } catch (error) {
    console.error("Erro ao tentar excluir o Grupo de Produto:", error);
    alert("Erro inesperado ao excluir o Grupo de Produto.");
  }
};


  const Actions = ({ id }: { id: number }) => (
    <>
      <button onClick={() => openCloseModalEdit(id)} className="text-edit hover:text-hoverEdit">
        <Pencil className="size-6" weight="fill" />
      </button>
      <button onClick={() => openCloseModalDelete(id)} className="text-danger hover:text-hoverDanger">
        <Trash className="size-6" weight="fill" />
      </button>
    </>
  );

  return (
    <div>
      <BreadcrumbPageTitle title="Cadastro de Grupo de Produto" />
      <div className="bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10">
        <div className="flex items-center justify-between mb-4">
          <SearchBar action={handleSearch} placeholder="Buscar Grupo de Produto..." />
          <Button label="Adicionar" icon={<Plus />} iconPosition="left" color="success" size="medium" onClick={openCloseModalRegister} />
          <Modal<ProductGroup>
            title="Cadastrar Grupo de Produto"
            inputs={inputs}
            action={registerProductGroup}
            statusModal={modalRegister}
            closeModal={openCloseModalRegister}
            type="create"
          />
          <Modal<ProductGroup>
            type="update"
            title="Editar Grupo de Produto"
            inputs={inputs}
            action={(model) => {
              if (currentId === null) {
                alert("Id não fornecido");
                return;
              }
              editProductGroup(currentId, { ...model, id: currentId });
            }}
            statusModal={modalEdit}
            closeModal={() => openCloseModalEdit()}
          />
          <Modal<ProductGroup>
            type="delete"
            title="Deseja realmente excluir esse Grupo de Produto?"
            msgInformation="Ao excluir este Grupo de Produto, ele será removido permanentemente do sistema."
            action={() => {
              if (currentId === null) {
                alert("Id não fornecido");
                return;
              }
              deleteProductGroup(currentId);
            }}
            statusModal={modalDelete}
            closeModal={() => openCloseModalDelete()}
          />
          <Modal<ProductGroup>
            type="info"
            msgInformation="Grupo de Produto excluído com sucesso!"
            icon={<CheckCircle size={90} className="text-success" weight="fill" />}
            statusModal={modalInfo}
            closeModal={openCloseModalInfo}
          />
        </div>
        <Table columns={columns} data={data} actions={(id) => <Actions id={id} />} />
      </div>
    </div>
  );
}
