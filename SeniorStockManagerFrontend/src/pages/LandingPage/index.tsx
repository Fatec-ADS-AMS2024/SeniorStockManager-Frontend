import { useContext } from "react";
import fotoEntradaSistema from "../../assets/images/fotoEntradaSistema.jpg";
import { ThemeContext } from "../../context/ThemeContext";

export default function LandingPage() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex">
      <div className="w-[40%] h-full bg-surface flex flex-col justify-center">
        <h1 className="text-secondary font-bold text-5xl mx-16">
          Plataforma de ferramentas para gerenciar o cuidado e bem-estar de
          idosos.
        </h1>
        <p className="text-textSecondary font-semibold text-2xl mt-2 mx-16">
          Plataforma de recursos para administrar o cuidado e a qualidade de
          vida de idosos
        </p>
        <button className="bg-primary h-14 w-52 mt-5 rounded text-surface font-semibold hover:bg-hoverButton hover:scale-105 transition-colors mx-16 text-lg">
          Fazer login
        </button>
      </div>
      <img
        src={fotoEntradaSistema}
        alt="Foto Entrada do Sistema"
        className={`w-[60%] h-full object-cover ${theme === "high-contrast" ? "grayscale" : "grayscale-0"}`}
      />
    </div>
  );
}
