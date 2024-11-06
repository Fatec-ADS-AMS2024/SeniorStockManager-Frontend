import { useContext, useState } from "react";
import fotoEntradaSistema from "../../assets/images/fotoLoginSistema.png";
import { ThemeContext } from "../../context/ThemeContext";
import { Envelope, Lock, Eye, EyeSlash } from "@phosphor-icons/react";

export default function LandingPage() {
  const { theme } = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-[40%] w-full h-full bg-surface flex flex-col justify-center items-center px-8 md:px-16">
        <h1 className="text-secondary font-bold text-4xl md:text-5xl mb-8">Login</h1>

        {/* Campo de Email */}
        <div className="flex flex-col w-full max-w-md mb-4">
          <label
            htmlFor="email"
            className="text-lg font-semibold text-textSecondary mb-2 tracking-wide"
          ></label>
          <div className="flex items-center border border-gray-300 rounded">
            <Envelope size={24} className="text-gray-300 mx-2" />
            <input
              id="email"
              type="email"
              className="flex-1 h-12 px-4 focus:outline-none"
              placeholder="Digite seu email"
            />
          </div>
        </div>

        {/* Campo de Senha */}
        <div className="flex flex-col w-full max-w-md mb-4">
          <label
            htmlFor="password"
            className="text-lg font-semibold text-textSecondary mb-2 tracking-wide"
          ></label>
          <div className="flex items-center border border-gray-300 rounded">
            <Lock size={24} className="text-gray-300 mx-2" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="flex-1 h-12 px-4 focus:outline-none"
              placeholder="Digite sua senha"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-300 mx-2"
            >
              {showPassword ? <EyeSlash size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>

        {/* Esqueceu a senha */}
        <p className="text-gray-500 mt-2 cursor-pointer hover:text-blue-500 transition-colors self-end">
          Esqueceu sua senha?
        </p>

        {/* Botão de login */}
        <button className="bg-primary h-12 w-full max-w-md rounded text-surface font-semibold hover:bg-secondary-dark transition-colors text-lg mt-5">
          Fazer login
        </button>
      </div>

      {/* Imagem de fundo */}
      <div className="relative md:w-[50%] w-full h-[50%] md:h-full flex items-center justify-center bg-transparent">
        <img
          src={fotoEntradaSistema}
          alt="Foto Login Sistema"
          className="w-[80%] h-auto object-contain" // Define a largura para 80% e altura automática
        />
      </div>
    </div>
  );
}
