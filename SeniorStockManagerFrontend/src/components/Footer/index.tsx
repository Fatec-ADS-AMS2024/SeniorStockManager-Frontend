import logoFatec from "../../assets/logotipoFatec.png";
import logoCPS from "../../assets/logotipoCPS.png";

export default function Footer() {
  return (
    <footer className="h-16 bg-surface flex overflow-hidden p-4 gap-4 justify-end">
      <img src={logoFatec} alt="logotipo fatec" />
      <img src={logoCPS} alt="logotipo centro paula souza" />
    </footer>
  );
}