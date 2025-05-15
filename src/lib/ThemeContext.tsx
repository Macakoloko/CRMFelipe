import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
};

const defaultColors = {
  primary: '158 32% 32%', // Default primary color (sage)
  secondary: '22 90% 16%', // Default secondary color (rust)
  background: '152 26% 15%', // Default background
  card: '152 26% 10%', // Default card background
  text: '37 74% 95%', // Default text color (cream)
};

// Predefined theme options
export const themeOptions = {
  forest: {
    primary: '158 32% 32%',
    secondary: '22 90% 16%',
    background: '152 26% 15%',
    card: '152 26% 10%',
    text: '37 74% 95%',
  },
  ocean: {
    primary: '200 70% 40%',
    secondary: '220 60% 30%',
    background: '210 30% 15%',
    card: '210 30% 10%',
    text: '0 0% 95%',
  },
  sunset: {
    primary: '25 90% 50%',
    secondary: '350 80% 40%',
    background: '20 20% 15%',
    card: '20 20% 10%',
    text: '40 30% 95%',
  },
  lavender: {
    primary: '270 50% 40%',
    secondary: '300 70% 30%',
    background: '280 20% 15%',
    card: '280 20% 10%',
    text: '0 0% 95%',
  },
};

export type LogoType = 'image' | 'text';

type Logo = {
  type: LogoType;
  path?: string;
  name: string;
  text?: string;
  fontSize?: string;
  fontWeight?: string;
};

const defaultLogo = {
  type: 'image' as LogoType,
  path: '/lovable-uploads/94174d70-177d-4594-803f-abf234f836ca.png',
  name: 'Default Logo',
};

export const logoOptions = [
  {
    type: 'image' as LogoType,
    path: '/lovable-uploads/94174d70-177d-4594-803f-abf234f836ca.png',
    name: 'Default Logo',
  },
  {
    type: 'image' as LogoType,
    path: '/assets/logo-alt-1.png',
    name: 'Alternate Logo 1',
  },
  {
    type: 'image' as LogoType,
    path: '/assets/logo-alt-2.png',
    name: 'Alternate Logo 2',
  },
  {
    type: 'image' as LogoType,
    path: '/assets/logo-alt-3.png',
    name: 'Alternate Logo 3',
  },
];

interface ThemeContextType {
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
  logo: Logo;
  setLogo: (logo: Logo) => void;
  applyTheme: (themeName: keyof typeof themeOptions) => void;
  currentTheme: string;
  customText: string;
  setCustomText: (text: string) => void;
  useTextLogo: boolean;
  setUseTextLogo: (useText: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [colors, setColors] = useState<ThemeColors>(() => {
    const savedColors = localStorage.getItem('app-theme-colors');
    return savedColors ? JSON.parse(savedColors) : defaultColors;
  });

  const [logo, setLogo] = useState<Logo>(() => {
    const savedLogo = localStorage.getItem('app-logo');
    return savedLogo ? JSON.parse(savedLogo) : defaultLogo;
  });

  const [customText, setCustomText] = useState<string>(() => {
    return localStorage.getItem('app-logo-text') || 'Sua Empresa';
  });

  const [useTextLogo, setUseTextLogo] = useState<boolean>(() => {
    return localStorage.getItem('app-use-text-logo') === 'true';
  });

  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    return localStorage.getItem('app-theme-name') || 'forest';
  });

  // Apply theme colors to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--card', colors.card);
    root.style.setProperty('--foreground', colors.text);
    root.style.setProperty('--card-foreground', colors.text);
    root.style.setProperty('--popover-foreground', colors.text);
    root.style.setProperty('--primary-foreground', colors.text);
    root.style.setProperty('--secondary-foreground', colors.text);
    
    localStorage.setItem('app-theme-colors', JSON.stringify(colors));
  }, [colors]);

  // Save logo choice
  useEffect(() => {
    localStorage.setItem('app-logo', JSON.stringify(logo));
  }, [logo]);

  // Save custom text
  useEffect(() => {
    localStorage.setItem('app-logo-text', customText);
  }, [customText]);

  // Save use text logo preference
  useEffect(() => {
    localStorage.setItem('app-use-text-logo', useTextLogo.toString());
  }, [useTextLogo]);

  // Apply a predefined theme
  const applyTheme = (themeName: keyof typeof themeOptions) => {
    const theme = themeOptions[themeName];
    if (theme) {
      setColors(theme);
      setCurrentTheme(themeName);
      localStorage.setItem('app-theme-name', themeName);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        colors, 
        setColors, 
        logo, 
        setLogo, 
        applyTheme,
        currentTheme,
        customText,
        setCustomText,
        useTextLogo,
        setUseTextLogo
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 