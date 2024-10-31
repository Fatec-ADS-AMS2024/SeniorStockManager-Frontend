import { useContext } from "react";
import logo from "../../assets/logo.png";
import {
  CircleHalf,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
} from "@phosphor-icons/react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Header() {
  const { theme, fontSize, toggleTheme, changeFontSize } =
    useContext(ThemeContext);

  const changeTheme = () => {
    if (theme === "light") {
      toggleTheme("high-contrast");
    } else {
      toggleTheme("light");
    }
  };

  const increaseFontSize = () => {
    changeFontSize(fontSize + 2);
  };
  const decreaseFontSize = () => {
    changeFontSize(fontSize - 2);
  };

  return (
    <header className="h-16 bg-surface flex overflow-hidden items-center justify-between">
      <img
        src={logo}
        alt="logo do sistema"
        className={`aspect-square size-14 object-cover ml-2 ${
          theme === "high-contrast" ? "grayscale" : "grayscale-0"
        }`}
      />

      <div className="h-full flex gap-4 items-center p-4 text-primary text-2xl">
        <button onClick={increaseFontSize}>
          <MagnifyingGlassPlus weight="bold" />
        </button>
        <button onClick={decreaseFontSize}>
          <MagnifyingGlassMinus weight="bold" />
        </button>
        <button onClick={changeTheme}>
          <CircleHalf weight="fill" />
        </button>
      </div>
    </header>
  );
}
