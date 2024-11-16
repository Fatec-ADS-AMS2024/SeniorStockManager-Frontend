import SearchBar from "../../components/SearchBar";

export default function Register_Unit_Of_Measure() {
    return(
        <SearchBar placeholder="Pesquisar ..." action={(searchTerm: string) => console.log(searchTerm)}/>
    );
}