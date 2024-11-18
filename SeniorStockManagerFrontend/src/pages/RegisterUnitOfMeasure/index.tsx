import SearchBar from "../../components/SearchBar";
import Modal    from "../../components/GenericModal";

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