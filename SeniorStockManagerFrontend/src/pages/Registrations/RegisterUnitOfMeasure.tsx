import SearchBar from "../../components/SearchBar";
import Modal    from "../../components/GenericModal";
import Breadcrumb_PageTitle from "../../components/BreadcrumbPageTitle";
import Button from "../../components/Button";
import { Plus } from "@phosphor-icons/react";
import { useState } from "react";

const inputs = [
    {
        label: "Sigla",
    }, 
    {
        label: "Descrição",
    }
]

export default function Register_Unit_Of_Measure() {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
        console.log(showModal);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return(
        <div className="bg-neutralLighter">
            <Breadcrumb_PageTitle title="Unidade de Medida"/>
            <div className="mt-8 px-4 flex items-center flex-row justify-between">
                <SearchBar
                    placeholder="Buscar Unidade de Medida"
                    action={console.log}
                />
                <Button
                    label="Adicionar Unidade"
                    icon={<Plus size={24} />}
                    color="success"
                    size="large"
                    onClick={openModal}
                    className="mr-5 w-80"
                />
                <Modal
                    title="Unidade de medida"
                    inputs={inputs}
                    action={console.log}
                    statusModal={showModal}
                    closeModal={closeModal}
                />
            </div>
            
        </div>
    );
}