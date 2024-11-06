import { ReactNode, createContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: string;
  fontSize: number;
  toggleTheme: (newTheme: string) => void;
  changeFontSize: (newFontSize: number) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  fontSize: 16,
  changeFontSize() {},
  toggleTheme() {},
});

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') ?? 'light';
    const savedFontSize = Number(localStorage.getItem('fontSize')) || 16;
    setTheme(savedTheme);
    setFontSize(savedFontSize);
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.style.setProperty(
      '--font-size',
      `${savedFontSize}px`,
    );
  }, []);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const changeFontSize = (newFontSize: number) => {
    if (newFontSize < 0 || newFontSize > 44) return; 
    setFontSize(newFontSize);
    localStorage.setItem('fontSize', `${newFontSize}`);

    
    document.documentElement.style.setProperty(
      '--font-size',
      `${newFontSize}px`,
    );
  };

  return (
    <ThemeContext.Provider
      value={{ theme, fontSize, toggleTheme, changeFontSize }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
