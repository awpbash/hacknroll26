// Cyber-Architect Theme Configuration
export const cyberArchitectTheme = {
  colors: {
    primary: {
      50: '#E6F9FF',
      100: '#B3F0FF',
      200: '#80E7FF',
      300: '#4DDDFF',
      400: '#1AD4FF',
      500: '#00D9FF', // Neon Cyan
      600: '#00AACE',
      700: '#007B9C',
      800: '#004C6B',
      900: '#001D39',
      DEFAULT: '#00D9FF',
      foreground: '#000000',
    },
    secondary: {
      50: '#F5E6FF',
      100: '#E6B3FF',
      200: '#D780FF',
      300: '#C84DFF',
      400: '#B91AFF',
      500: '#9D00FF', // Electric Purple
      600: '#7E00CE',
      700: '#5F009C',
      800: '#40006B',
      900: '#210039',
      DEFAULT: '#9D00FF',
      foreground: '#FFFFFF',
    },
    success: {
      50: '#E6FFF5',
      100: '#B3FFE6',
      200: '#80FFD7',
      300: '#4DFFC8',
      400: '#1AFFB9',
      500: '#00FFA3', // Neon Green
      600: '#00CE82',
      700: '#009C62',
      800: '#006B42',
      900: '#003921',
      DEFAULT: '#00FFA3',
      foreground: '#000000',
    },
    warning: {
      50: '#FFF5E6',
      100: '#FFE6B3',
      200: '#FFD780',
      300: '#FFC84D',
      400: '#FFB91A',
      500: '#FFA500', // Neon Orange
      600: '#CE8400',
      700: '#9C6300',
      800: '#6B4200',
      900: '#392100',
      DEFAULT: '#FFA500',
      foreground: '#000000',
    },
    danger: {
      50: '#FFE6F0',
      100: '#FFB3D1',
      200: '#FF80B3',
      300: '#FF4D94',
      400: '#FF1A75',
      500: '#FF0066', // Neon Pink
      600: '#CE0052',
      700: '#9C003E',
      800: '#6B002A',
      900: '#390016',
      DEFAULT: '#FF0066',
      foreground: '#FFFFFF',
    },
    background: {
      DEFAULT: '#0A0A0F', // Deep space background
      foreground: '#E0E0FF',
    },
    foreground: {
      50: '#E0E0FF',
      100: '#C4C4E8',
      200: '#A8A8D1',
      300: '#8C8CBA',
      400: '#7070A3',
      500: '#54548C',
      600: '#383875',
      700: '#1C1C5E',
      800: '#000047',
      900: '#000030',
      DEFAULT: '#E0E0FF',
    },
    content1: {
      DEFAULT: '#12121A', // Card background
      foreground: '#E0E0FF',
    },
    content2: {
      DEFAULT: '#1A1A28', // Secondary card
      foreground: '#E0E0FF',
    },
    content3: {
      DEFAULT: '#222236', // Tertiary card
      foreground: '#E0E0FF',
    },
    content4: {
      DEFAULT: '#2A2A44', // Quaternary card
      foreground: '#E0E0FF',
    },
    default: {
      50: '#F5F5FF',
      100: '#E6E6F5',
      200: '#D7D7EB',
      300: '#C8C8E1',
      400: '#B9B9D7',
      500: '#AAAACD',
      600: '#9B9BC3',
      700: '#8C8CB9',
      800: '#7D7DAF',
      900: '#6E6EA5',
      DEFAULT: '#AAAACD',
      foreground: '#0A0A0F',
    },
  },
  layout: {
    fontSize: {
      tiny: '0.75rem',    // 12px
      small: '0.875rem',  // 14px
      medium: '1rem',     // 16px
      large: '1.125rem',  // 18px
    },
    lineHeight: {
      tiny: '1rem',
      small: '1.25rem',
      medium: '1.5rem',
      large: '1.75rem',
    },
    radius: {
      small: '8px',
      medium: '12px',
      large: '16px',
    },
    borderWidth: {
      small: '1px',
      medium: '2px',
      large: '3px',
    },
    disabledOpacity: 0.5,
    dividerWeight: '1px',
    hoverOpacity: 0.9,
  },
};

// Custom CSS variables for glass morphism and neon effects
export const customCSSVariables = `
  :root {
    /* Cyber-Architect custom variables */
    --cyber-glow-primary: 0 0 20px rgba(0, 217, 255, 0.5), 0 0 40px rgba(0, 217, 255, 0.3);
    --cyber-glow-secondary: 0 0 20px rgba(157, 0, 255, 0.5), 0 0 40px rgba(157, 0, 255, 0.3);
    --cyber-glow-success: 0 0 20px rgba(0, 255, 163, 0.5), 0 0 40px rgba(0, 255, 163, 0.3);

    /* Glass morphism */
    --glass-bg: rgba(18, 18, 26, 0.7);
    --glass-border: rgba(224, 224, 255, 0.1);
    --glass-blur: blur(12px);

    /* Gradients */
    --gradient-cyber: linear-gradient(135deg, #00D9FF 0%, #9D00FF 100%);
    --gradient-neon: linear-gradient(135deg, #00FFA3 0%, #00D9FF 50%, #9D00FF 100%);

    /* Shadows */
    --shadow-cyber-sm: 0 2px 8px rgba(0, 217, 255, 0.15);
    --shadow-cyber-md: 0 4px 16px rgba(0, 217, 255, 0.2);
    --shadow-cyber-lg: 0 8px 32px rgba(0, 217, 255, 0.25);

    /* Animation */
    --transition-cyber: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

// Hero UI Provider theme props
export const heroUIProviderTheme = {
  themes: {
    dark: {
      colors: cyberArchitectTheme.colors,
      layout: cyberArchitectTheme.layout,
    },
  },
  defaultTheme: 'dark',
};
