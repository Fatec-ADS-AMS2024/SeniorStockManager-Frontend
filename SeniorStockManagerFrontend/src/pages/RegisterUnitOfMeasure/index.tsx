import SearchBar from "../../components/SearchBar";
import Modal    from "../../components/GenericModal";
import Breadcrumb from "../../components/Breadcrumb";
import PageTitle from "../../components/PageTitle";

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
        <div>
            <PageTitle title="Unidade de Medida"/>
            <Breadcrumb/>
            <SearchBar 
                placeholder="Digite aqui..." 
                action={console.log} 
            />
            <Modal 
                title="Unidade de medida" 
                inputs={inputs} 
                action={console.log}
            />
            
        </div>
    );
}