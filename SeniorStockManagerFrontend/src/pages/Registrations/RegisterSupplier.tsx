import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SupplierService from "../../services/supplierService";
import Supplier from "../../types/models/Supplier";
import Table from "../../components/Table";
import { CheckCircle, Pencil, Plus, Trash, XCircle } from "@phosphor-icons/react";
import BreadcrumbPageTitle from "../../components/BreadcrumbPageTitle";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Modal from "../../components/GenericModal";

const isValidCPF = (cpf: string): boolean => {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const digits = cpf.split("").map(el => +el);
  const rest = (count: number): number => {
    return ((digits.slice(0, count).reduce((soma, el, index) => {
      return soma + el * (count + 1 - index);
    }, 0) * 10) % 11) % 10;
  };
  return rest(9) === digits[9] && rest(10) === digits[10];
};

const isValidCNPJ = (cnpj: string): boolean => {
  if (typeof cnpj !== "string") return false;
  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14 || !!cnpj.match(/(\d)\1{13}/)) return false;
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  return true;
};

const formatCPFCNPJ = (value: string): string => {
  const cleaned = (value || "").replace(/\D/g, "");
  if (cleaned.length <= 11) {
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return cleaned
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

const formatPhone = (value: string): string => {
  const cleaned = (value || "").replace(/\D/g, "");
  if (cleaned.length <= 10) {
    return cleaned
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return cleaned
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

const formatCEP = (value: string): string => {
  return (value || "")
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
};

const validateSupplier = (supplier: Partial<Supplier>, allSuppliers: Supplier[]): string | null => {
  const cleanedCpfCnpj = (supplier.cpfCnpj || "").replace(/\D/g, "");
  const cleanedPhone = (supplier.phone || "").replace(/\D/g, "");
  const cleanedPostalCode = (supplier.postalCode || "").replace(/\D/g, "");
  const trimmedCorporateName = supplier.corporateName?.trim().toLowerCase();
  const isCpf = cleanedCpfCnpj.length <= 11;

  if (!isCpf) {
    if (!trimmedCorporateName || trimmedCorporateName.length < 3 || trimmedCorporateName.length > 150) {
      return "Razão Social é obrigatória e deve ter entre 3 e 150 caracteres.";
    }
    if (allSuppliers.some(s => s.id !== supplier.id && s.corporateName.toLowerCase() === trimmedCorporateName)) {
      return "Já existe um fornecedor com esta Razão Social.";
    }
  }

  if (!supplier.tradeName || supplier.tradeName.trim().length < 3 || supplier.tradeName.trim().length > 150) {
    return "Nome é obrigatório e deve ter entre 3 e 150 caracteres.";
  }
  if (!supplier.cpfCnpj) {
    return "CPF/CNPJ é obrigatório.";
  }
  if (cleanedCpfCnpj.length === 11) {
    if (!isValidCPF(cleanedCpfCnpj)) return "CPF inválido.";
  } else if (cleanedCpfCnpj.length === 14) {
    if (!isValidCNPJ(cleanedCpfCnpj)) return "CNPJ inválido.";
  } else {
    return "CPF/CNPJ inválido.";
  }
  if (allSuppliers.some(s => s.id !== supplier.id && (s.cpfCnpj || "").replace(/\D/g, "") === cleanedCpfCnpj)) {
    return "Já existe um fornecedor com este CPF/CNPJ.";
  }
  if (supplier.email && !/^\S+@\S+\.\S+$/.test(supplier.email)) {
    return "Email com formato inválido.";
  }
  if (!supplier.phone) {
    return "Telefone é obrigatório.";
  }
  if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
    return "Telefone inválido. Deve conter 10 ou 11 dígitos.";
  }
  if (!supplier.postalCode || cleanedPostalCode.length !== 8) {
    return "CEP deve ter 8 dígitos numéricos.";
  }
  if (!supplier.street || supplier.street.trim().length < 2) {
    return "Rua/Avenida é obrigatória e deve ter no mínimo 2 caracteres.";
  }
  if (!supplier.number || supplier.number.trim().length < 1) {
    return "Número é obrigatório.";
  }
  if (!supplier.district || supplier.district.trim().length < 2) {
    return "Bairro é obrigatório e deve ter no mínimo 2 caracteres.";
  }
  if (!supplier.city || supplier.city.trim().length < 2) {
    return "Cidade é obrigatória e deve ter no mínimo 2 caracteres.";
  }
  if (!supplier.state || supplier.state.trim().length < 2) {
    return "Estado é obrigatório e deve ter no mínimo 2 caracteres.";
  }

  return null;
};

const SupplierList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const columns = ["Nome", "CPF/CNPJ", "Razão Social"];
  const [data, setData] = useState<Supplier[]>([]);
  const [originalData, setOriginalData] = useState<Supplier[]>([]);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [infoIcon, setInfoIcon] = useState<JSX.Element | undefined>(undefined);
  

  const fetchData = async () => {
    const supplierService = new SupplierService();
    const res = await supplierService.getAll();
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

  const openCloseModalInfo = () => setModalInfo(false);

  const showInfoModal = (message: string, type: "success" | "error") => {
    setInfoMessage(message);
    setInfoIcon(
      type === "success" ? (
        <CheckCircle size={90} className="text-success" weight="fill" />
      ) : (
        <XCircle size={90} className="text-danger" weight="fill" />
      )
    );
    setModalInfo(true);
  };

  useEffect(() => {
    if (location.state?.message) {
      showInfoModal(location.state.message, "success");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData);
      return;
    }
    const filteredData = originalData.filter((supplier) =>
      (supplier.tradeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.corporateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.cpfCnpj?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setData(filteredData);
  };

  const openCloseModalDelete = (id?: number) => {
    if (!id) {
      setModalDelete(false);
      setCurrentId(null);
      return;
    }
    setCurrentId(id);
    setModalDelete(true);
  };

  const deleteSupplier = async (id: number) => {
    const supplierService = new SupplierService();

    try {
      const res = await supplierService.delete(id);
      if (res.code >= 200 && res.code < 300) {
        setModalDelete(false);
        setCurrentId(null);
        const itemName = data.find(item => item.id === id)?.tradeName || "";
        await fetchData();
        showInfoModal(`Fornecedor "${itemName}" excluído com sucesso!`, "success");
      } else {
        showInfoModal(res.message || "Erro inesperado ao excluir o Fornecedor.", "error");
      }
    } catch (error) {
      console.error("Erro ao tentar excluir o Fornecedor:", error);
      showInfoModal("Erro inesperado ao excluir o Fornecedor.", "error");
    }
  };

  const Actions = ({ id }: { id: number }) => (
    <>
      <button onClick={() => navigate(`/registrations/supplier/${id}`)} className="text-edit hover:text-hoverEdit">
        <Pencil className="size-6" weight="fill" />
      </button>
      <button onClick={() => openCloseModalDelete(id)} className="text-danger hover:text-hoverDanger">
        <Trash className="size-6" weight="fill" />
      </button>
    </>
  );

  return (
    <div>
      <BreadcrumbPageTitle title="Cadastro de Fornecedor" />
      <div className="bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10">
        <Modal<Supplier>
          type="delete"
          title="Deseja realmente excluir esse Fornecedor?"
          msgInformation="Ao excluir este Fornecedor, ele será removido permanentemente do sistema."
          action={() => { if (currentId !== null) deleteSupplier(currentId); }}
          statusModal={modalDelete}
          closeModal={() => openCloseModalDelete()}
        />
        <Modal<Supplier>
          type="info"
          msgInformation={infoMessage}
          icon={infoIcon}
          statusModal={modalInfo}
          closeModal={openCloseModalInfo}
        />
        <div className="flex items-center justify-between mb-4">
          <SearchBar action={handleSearch} placeholder="Buscar Fornecedor..." />
          <Button label="Adicionar" icon={<Plus />} iconPosition="left" color="success" size="medium" onClick={() => navigate('/registrations/supplier/new')} />
        </div>
        <Table
          columns={columns}
          data={data?.map(row => ({
            id: row.id,
            "Nome": row.tradeName,
            "CPF/CNPJ": formatCPFCNPJ(row.cpfCnpj || ""),
            "Razão Social": row.corporateName || 'N/A'
          }))}
          actions={(id) => <Actions id={id} />}
        />
      </div>
    </div>
  );
};

interface IbgeState { id: number; sigla: string; nome: string; }
interface IbgeCity { id: number; nome: string; }

interface SupplierFormProps {
  isEdit?: boolean;
}

const SupplierForm = ({ isEdit = false }: SupplierFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const supplierService = new SupplierService();

  const [supplier, setSupplier] = useState<Partial<Supplier>>({ addresscomplement: '' });
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [states, setStates] = useState<IbgeState[]>([]);
  const [cities, setCities] = useState<IbgeCity[]>([]);
  const [modalInfo, setModalInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [infoIcon, setInfoIcon] = useState<JSX.Element | undefined>(undefined);

  const isCpf = (supplier.cpfCnpj || "").replace(/\D/g, "").length <= 11;

  const openCloseModalInfo = () => setModalInfo(false);

  const showInfoModal = (message: string, type: "success" | "error") => {
    setInfoMessage(message);
    setInfoIcon(
      type === "success" ? (
        <CheckCircle size={90} className="text-success" weight="fill" />
      ) : (
        <XCircle size={90} className="text-danger" weight="fill" />
      )
    );
    setModalInfo(true);
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (supplier.state) {
      const fetchCities = async () => {
        try {
          const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${supplier.state}/municipios`);
          const data = await response.json();
          setCities(data);
        } catch (error) {
          console.error("Erro ao buscar cidades:", error);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [supplier.state]);

  useEffect(() => {
    if (isCpf) {
      setSupplier(prev => ({ ...prev, corporateName: '' }));
    }
  }, [isCpf]);

  useEffect(() => {
    const fetchDependencies = async () => {
      const allRes = await supplierService.getAll();
      if (allRes.data) setAllSuppliers(allRes.data);

      if (isEdit && id) {
        const res = await supplierService.getById(Number(id));
        if (res.data) {
          setSupplier({
            ...res.data,
            cpfCnpj: formatCPFCNPJ(res.data.cpfCnpj || ""),
            phone: formatPhone(res.data.phone || ""),
            postalCode: formatCEP(res.data.postalCode || ""),
            addresscomplement: res.data.addresscomplement || ''
          });
        } else {
          showInfoModal("Fornecedor não encontrado!", "error");
          navigate("/registrations/supplier");
        }
      }
    };
    fetchDependencies();
  }, [isEdit, id, navigate]);

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        showInfoModal("CEP não encontrado.", "error");
        return;
      }
      setSupplier(prev => ({
        ...prev,
        postalCode: formatCEP(data.cep),
        street: data.logradouro,
        district: data.bairro,
        city: data.localidade,
        state: data.uf,
        addresscomplement: data.complemento || prev.addresscomplement || ''
      }));
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
      showInfoModal("Não foi possível buscar o CEP. Verifique sua conexão.", "error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;

    if (name === "cpfCnpj") {
      value = formatCPFCNPJ(value);
    } else if (name === "phone") {
      value = formatPhone(value);
    } else if (name === "postalCode") {
      value = formatCEP(value);
    }

    if (name === "state") {
      setSupplier(prev => ({ ...prev, state: value, city: "" }));
    } else {
      setSupplier(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateSupplier(supplier, allSuppliers);
    if (validationError) {
      showInfoModal(validationError, "error");
      return;
    }

    const cleanedCpfCnpj = (supplier.cpfCnpj || "").replace(/\D/g, "");
    const cleanedPhone = (supplier.phone || "").replace(/\D/g, "");
    const cleanedPostalCode = (supplier.postalCode || "").replace(/\D/g, "");

    const payload = {
      ...supplier,
      cpfCnpj: cleanedCpfCnpj,
      phone: cleanedPhone,
      postalCode: cleanedPostalCode,
      addresscomplement: supplier.addresscomplement || ''
    };

    const res = isEdit 
      ? await supplierService.update(Number(id), payload as Supplier)
      : await supplierService.create(payload as Supplier);

    if (res.code >= 200 && res.code < 300) {
      const action = isEdit ? "atualizado" : "criado";
      const successMessage = `Fornecedor "${supplier.tradeName}" ${action} com sucesso!`;
      navigate("/registrations/supplier", { state: { message: successMessage } });
    } else {
      showInfoModal(res.message || "Ocorreu um erro.", "error");
    }
  };

  const formInputs: { label: string; name: keyof Supplier; type: string, maxLength?: number }[] = [
    { label: "CPF/CNPJ", name: "cpfCnpj", type: "text", maxLength: 18 },
    { label: "Nome", name: "tradeName", type: "text" },
    { label: "Razão Social", name: "corporateName", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Telefone", name: "phone", type: "text", maxLength: 15 },
    { label: "CEP", name: "postalCode", type: "text", maxLength: 9 },
    { label: "Rua/Avenida", name: "street", type: "text" },
    { label: "Nº", name: "number", type: "text" },
    { label: "Complemento", name: "addresscomplement", type: "text" },
    { label: "Bairro", name: "district", type: "text" },
    { label: "Estado", name: "state", type: "text" },
    { label: "Cidade", name: "city", type: "text" },
  ];

  return (
    <div>
      <Modal<Supplier>
        type="info"
        msgInformation={infoMessage}
        icon={infoIcon}
        statusModal={modalInfo}
        closeModal={openCloseModalInfo}
      />
      <BreadcrumbPageTitle title={isEdit ? "Editar Fornecedor" : "Adicionar Fornecedor"} />
      <div className="bg-neutralWhite p-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formInputs.map(input => {
              if (input.name === 'state') {
                return (
                  <div className="flex flex-col" key={input.name}>
                    <label htmlFor={input.name} className="mb-1 font-semibold">{input.label}</label>
                    <select 
                      id={input.name} 
                      name={input.name} 
                      value={supplier.state || ''} 
                      onChange={handleChange} 
                      className="border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white h-[42px]"
                    >
                      <option value="">Selecione um estado</option>
                      {states.map(s => <option key={s.id} value={s.sigla}>{s.nome}</option>)}
                    </select>
                  </div>
                );
              }
              if (input.name === 'city') {
                return (
                  <div className="flex flex-col" key={input.name}>
                    <label htmlFor={input.name} className="mb-1 font-semibold">{input.label}</label>
                    <select 
                      id={input.name} 
                      name={input.name} 
                      value={supplier.city || ''} 
                      onChange={handleChange} 
                      disabled={!supplier.state} 
                      className="border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white disabled:bg-gray-100 h-[42px]"
                    >
                      <option value="">Selecione uma cidade</option>
                      {cities.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                    </select>
                  </div>
                );
              }
              return (
                <div className="flex flex-col" key={input.name}>
                  <label htmlFor={input.name} className="mb-1 font-semibold">{input.label}</label>
                  <input
                    id={input.name}
                    name={input.name}
                    type={input.type}
                    value={supplier[input.name] as string || ''}
                    onChange={handleChange}
                    onBlur={input.name === 'postalCode' ? handleCepBlur : undefined}
                    maxLength={input.maxLength}
                    disabled={input.name === 'corporateName' && isCpf}
                    required={input.name === 'corporateName' ? !isCpf : undefined}
                    className={`border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-[42px] ${input.name === 'corporateName' && isCpf ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" label="Cancelar" color="danger" onClick={() => navigate('/registrations/supplier')} />
            <Button type="submit" label="Salvar" color="success" />
          </div>
        </form>
      </div>
    </div>
  );
};

const SupplierCreateForm = () => <SupplierForm isEdit={false} />;
const SupplierUpdateForm = () => <SupplierForm isEdit={true} />;

export default function SupplierPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isNew = location.pathname.endsWith('/new');

  if (isNew) return <SupplierCreateForm />;
  if (id) return <SupplierUpdateForm />;
  return <SupplierList />;
}