import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";
import Card from "../../components/Card"



export default function RegisterPage() {
  const { theme } = useContext(ThemeContext);
  return(
 
  <Card />
  );
}
