import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import BreadcrumbPageTitle from "../../components/BreadcrumbPageTitle";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import Modal from "../../components/GenericModal";
import { routes } from "../../routes/routes";
import Carrier from "../../types/models/Carrier";
import CarrierService from '../../services/CarrierService'; 
import CarrierType from "../../types/models/CarrierType";
import CarrierGroup from "../../types/models/CarrierGroup";
import CarrierTypeService from "../../services/CarrierTypeService";
import CarrierGroupService from "../../services/CarrierGroupService";


export default function FormCarrier() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== "0";

  // --- ESTADOS PARA OS CAMPOS DE CARRIER ---
  const [corporateName, setCorporateName] = useState<string>("");
  const [tradeName, setTradeName] = useState<string>("");
  const [cpfcnpj, setCpfcnpj] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [addressComplement, setAddressComplement] = useState<string>(""); 
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  
  // Estados para modais e dropdowns (removi UnitOfMeasure)
  const [modalType, setModalType] = useState<boolean>(false);
  const [modalGroup, setModalGroup] = useState<boolean>(false);
  const [carrierTypes, setCarrierTypes] = useState<CarrierType[]>([]);
  const [carrierGroups, setCarrierGroups] = useState<CarrierGroup[]>([]);

  // Função para buscar dados de um Carrier para edição
  const fetchCarrier = useCallback(
    async (carrierId: string) => {
      const carrierService = new CarrierService();
      const res = await carrierService.getById(Number(carrierId));
      if (res.code === 200 && res.data) {
        const c = res.data.data; // 'c' de carrier
        setCorporateName(c.corporateName);
        setTradeName(c.tradeName);
        setCpfcnpj(c.cpfcnpj);
        setStreet(c.street);
        setNumber(c.number);
        setDistrict(c.district);
        setAddressComplement(c.adresscomplement); 
        setCity(c.city);
        setState(c.state);
        setPostalCode(c.postalCode);
        setPhone(c.phone);
        setEmail(c.email);
      } else {
        alert("Transportadora não encontrada!");
        navigate(routes.REGISTER_CARRIER);
      }
    },
    [navigate]
  );

  useEffect(() => {
    getCarrierTypes();
    getCarrierGroups();
    if (isEditing) {
      fetchCarrier(id);
    }
  }, [id, fetchCarrier, isEditing]);


  // Função para submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const carrierData: Carrier = {
      id: isEditing ? Number(id) : 0,
      corporateName,
      tradeName,
      cpfcnpj,
      street,
      number,
      district,
      adresscomplement: addressComplement, 
      city,
      state,
      postalCode,
      phone,
      email,
    };

    const carrierService = new CarrierService();
    const res = isEditing
      ? await carrierService.update(carrierData.id, carrierData)
      : await carrierService.create(carrierData);

    if (res.code === 200 || res.code === 201) {
      alert(`Transportadora ${isEditing ? "atualizada" : "cadastrada"} com sucesso!`);
      navigate(routes.REGISTER_CARRIER);
    } else {
      alert(res.message);
    }
  };

 
  const openModalType = () => setModalType(true);
  const openModalGroup = () => setModalGroup(true);
  const closeModalType = () => setModalType(false);
  const closeModalGroup = () => setModalGroup(false);

  const getCarrierTypes = async () => {
    const service = new CarrierTypeService();
    const res = await service.getAll();
    setCarrierTypes(res.data ?? []);
  };
  const getCarrierGroups = async () => {
    const service = new CarrierGroupService();
    const res = await service.getAll();
    setCarrierGroups(res.data ?? []);
  };

  const registerCarrierType = async (model: CarrierType) => {
    const service = new CarrierTypeService();
    await service.create({ ...model, id: 0 });
    closeModalType();
    getCarrierTypes();
  };
  const registerCarrierGroup = async (model: CarrierGroup) => {
    const service = new CarrierGroupService();
    await service.create({ ...model, id: Number(model.id) });
    closeModalGroup();
    getCarrierGroups();
  };
  
  const inputsType = [{ label: "Nome do Tipo", attribute: "name", type: "text", required: true }];
  const inputsGroup = [{ label: "Nome do Grupo", attribute: "name", type: "text", required: true }];

  return (
    <div>
      <BreadcrumbPageTitle title={isEditing ? "Editar Transportadora" : "Cadastrar Transportadora"} />
      <div className="w-full h-full flex flex-col items-center py-10">
        <form
          className="w-[95%] h-full bg-white shadow-md p-8 flex flex-col justify-center items-center rounded-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="text-textPrimary font-bold text-2xl w-full mb-6">
            Dados da Transportadora
          </h1>

          {/* --- DADOS BÁSICOS --- */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputText label="Razão Social" value={corporateName} action={setCorporateName} property={{ type: "text", required: true }} />
            <InputText label="Nome Fantasia" value={tradeName} action={setTradeName} property={{ type: "text" }} />
            <InputText label="CPF / CNPJ" value={cpfcnpj} action={setCpfcnpj} property={{ type: "text", required: true }} />
          </div>

          {/* --- ENDEREÇO --- */}
          <div className="w-full border-t my-4"></div>
          <h2 className="text-textPrimary font-bold text-xl w-full mb-4">Endereço</h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
             <div className="md:col-span-3">
                <InputText label="Logradouro (Rua, Av.)" value={street} action={setStreet} property={{ type: "text" }} />
             </div>
             <InputText label="Número" value={number} action={setNumber} property={{ type: "text" }} />
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputText label="Complemento" value={addressComplement} action={setAddressComplement} property={{ type: "text" }} />
            <InputText label="Bairro" value={district} action={setDistrict} property={{ type: "text" }} />
            <InputText label="CEP" value={postalCode} action={setPostalCode} property={{ type: "text" }} />
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <InputText label="Cidade" value={city} action={setCity} property={{ type: "text" }} />
            <InputText label="Estado (UF)" value={state} action={setState} property={{ type: "text" }} />
          </div>
          
          {/* --- CONTATO E GRUPOS --- */}
          <div className="w-full border-t my-4"></div>
          <h2 className="text-textPrimary font-bold text-xl w-full mb-4">Contato e Classificação</h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputText label="Telefone" value={phone} action={setPhone} property={{ type: "tel" }} />
              <InputText label="E-mail" value={email} action={setEmail} property={{ type: "email" }} />
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Dropdown para Tipo */}
            <div>
              <label htmlFor="carrier-type" className="block text-sm font-medium text-textPrimary">Tipo:</label>
              <select id="carrier-type" className="p-2 mt-1 block w-full border border-neutral rounded-sm focus:border-neutralDarker sm:text-sm">
                {carrierTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
              </select>
              <button type="button" onClick={openModalType} className="mt-2 text-[12px] text-textSecondary underline hover:text-primary pl-2">Adicionar Tipo</button>
            </div>
            {/* Dropdown para Grupo */}
            <div>
              <label htmlFor="carrier-group" className="block text-sm font-medium text-textPrimary">Grupo:</label>
              <select id="carrier-group" className="p-2 mt-1 block w-full border border-neutral rounded-sm focus:border-neutralDarker sm:text-sm">
                {carrierGroups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
              </select>
              <button type="button" onClick={openModalGroup} className="mt-2 text-[12px] text-textSecondary underline hover:text-primary pl-2">Adicionar Grupo</button>
            </div>
          </div>

          {/* --- BOTÃO DE SUBMISSÃO --- */}
          <div className="flex justify-end w-full gap-4 mt-8">
            <Button label={isEditing ? "Salvar Alterações" : "Cadastrar Transportadora"} color="primary" size="medium" type="submit" />
          </div>
        </form>
      </div>

      {/* --- MODAIS --- */}
      <Modal title="Cadastrar Tipo" inputs={inputsType} action={registerCarrierType} statusModal={modalType} closeModal={closeModalType} type="create" />
      <Modal title="Cadastrar Grupo" inputs={inputsGroup} action={registerCarrierGroup} statusModal={modalGroup} closeModal={closeModalGroup} type="create" />
    </div>
  );
}