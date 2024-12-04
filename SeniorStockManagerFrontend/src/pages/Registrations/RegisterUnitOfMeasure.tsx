import SearchBar from "../../components/SearchBar";
import Modal    from "../../components/GenericModal";
import Breadcrumb_PageTitle from "../../components/BreadcrumbPageTitle";
import Button from "../../components/Button";
import { CheckCircle, Plus } from "@phosphor-icons/react";
import { useState } from "react";
import UnitOfMeasure from "../../types/models/UnitOfMeasure";


const inputs = [
    {
        attribute: "id",
        defaultValue: "1",
    }
]

export default function Register_Unit_Of_Measure() {
    const [showModal, setShowModal] = useState(false);
    const [informationModal, setInformationModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openInformationModal = () => {
        setInformationModal(true);
    };

    const closeModalInformation = () => {
        setInformationModal(false);
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
                    icon={<Plus size={24}/>}
                    color="success"
                    size="large"
                    onClick={openModal}
                    className="mr-5 w-80"
                />
                <Modal<UnitOfMeasure>
                    type="delete"
                    title="Deseja realmente excluir essa Unidade de Medida?"
                    action={console.log}
                    statusModal={showModal}
                    closeModal={closeModal}
                    msgConfirm="Unidade de Medida excluida com sucesso!"
                    inputs={inputs}
                    optionalAction={openInformationModal}
                />
                <Modal<UnitOfMeasure>
                    type="info"
                    msgInformation="Unidade de Medida excluida com sucesso!"
                    icon={<CheckCircle size={40} className="text-success"/>}
                    statusModal={informationModal}
                    closeModal={closeModalInformation}
                />
            </div>
            
        </div>
    );
}