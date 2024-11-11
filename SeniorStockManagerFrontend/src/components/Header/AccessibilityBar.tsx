import { useContext } from "react";
import {
  CircleHalf,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
} from "@phosphor-icons/react";
import { ThemeContext } from "../../context/ThemeContext";

export default function AccessibilityBar() {
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
    <div className="h-8 w-full flex gap-2 items-center justify-end text-primary text-base p-1 border-b-[1px]">
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
  );
}
