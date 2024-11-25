import SearchBar from "../../components/SearchBar";
import Modal    from "../../components/GenericModal";
import Breadcrumb_PageTitle from "../../components/BreadcrumbPageTitle";

const inputs = [
    {
        label: "Sigla ",
    }, 
    {
        label: "Descrição",
    }
]

export default function Register_Unit_Of_Measure() {
    return(
        <div className="bg-neutralLighter">
            <Breadcrumb_PageTitle title="Unidade de Medida"/>
            <div className="mt-8 px-4 flex flex-wrap items-center gap-8">
                <SearchBar
                    placeholder="Buscar Unidade de Medida"
                    action={console.log}
                />
                <Modal
                    title="Unidade de medida"
                    inputs={inputs}
                    action={console.log}
                />
            </div>
            
        </div>
    );
}