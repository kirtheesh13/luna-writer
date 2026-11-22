import React, { createContext, useContext, useEffect, useState } from 'react';
import { FontSize, FontType, ReadingWidthType, ThemeType } from '@/types';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  font: FontType;
  setFont: (font: FontType) => void;
  readingWidth: ReadingWidthType;
  setReadingWidth: (width: ReadingWidthType) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    return (localStorage.getItem('luna_theme') as ThemeType) || 'midnight';
  });

  const [font, setFontState] = useState<FontType>(() => {
    return (localStorage.getItem('luna_font') as FontType) || 'sans';
  });

  const [readingWidth, setReadingWidthState] = useState<ReadingWidthType>(() => {
    return (localStorage.getItem('luna_width') as ReadingWidthType) || 'comfortable';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('luna_font_size') as FontSize) || 'normal';
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const setTheme = (t: ThemeType) => {
    setThemeState(t);
    localStorage.setItem('luna_theme', t);
  };

  const setFont = (f: FontType) => {
    setFontState(f);
    localStorage.setItem('luna_font', f);
  };

  const setReadingWidth = (w: ReadingWidthType) => {
    setReadingWidthState(w);
    localStorage.setItem('luna_width', w);
  };

  const setFontSize = (s: FontSize) => {
    setFontSizeState(s);
    localStorage.setItem('luna_font_size', s);
  };

  useEffect(() => {
    // Apply theme attribute to html and body
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.setAttribute('data-font', font);
  }, [font]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        font,
        setFont,
        readingWidth,
        setReadingWidth,
        fontSize,
        setFontSize,
        isCustomizerOpen,
        setIsCustomizerOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
