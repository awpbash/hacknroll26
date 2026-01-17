import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root[data-theme="dark"] {
    /* Cyber-Architect Theme - Dark Mode Background Colors */
    --bg-primary: #0A0A0F;
    --bg-secondary: #12121A;
    --bg-tertiary: #1A1A28;
    --bg-hover: #222236;

    /* Text Colors */
    --text-primary: #E0E0FF;
    --text-secondary: #AAAACD;
    --text-muted: #8C8CBA;

    /* Cyber Accent Colors */
    --accent-primary: #00B8D4;
    --accent-secondary: #7B1FA2;
    --accent-success: #00E676;
    --accent-warning: #FFA500;
    --accent-error: #FF0066;

    /* Border Colors */
    --border-color: rgba(224, 224, 255, 0.1);
    --border-hover: rgba(0, 184, 212, 0.3);

    /* Shadows with Cyber Glow */
    --shadow-sm: 0 2px 8px rgba(0, 184, 212, 0.15);
    --shadow-md: 0 4px 16px rgba(0, 184, 212, 0.2);
    --shadow-lg: 0 8px 32px rgba(0, 184, 212, 0.25);
    --shadow-xl: 0 16px 48px rgba(0, 184, 212, 0.3);

    /* Neon Glow Effects */
    --glow-primary: 0 0 15px rgba(0, 184, 212, 0.35), 0 0 30px rgba(0, 184, 212, 0.2);
    --glow-secondary: 0 0 15px rgba(123, 31, 162, 0.35), 0 0 30px rgba(123, 31, 162, 0.2);
    --glow-success: 0 0 15px rgba(0, 230, 118, 0.35), 0 0 30px rgba(0, 230, 118, 0.2);

    /* Glass Morphism */
    --glass-bg: rgba(18, 18, 26, 0.7);
    --glass-border: rgba(224, 224, 255, 0.1);

    /* Gradients */
    --gradient-cyber: linear-gradient(135deg, #00B8D4 0%, #7B1FA2 100%);
    --gradient-neon: linear-gradient(135deg, #00E676 0%, #00B8D4 50%, #7B1FA2 100%);
  }

  :root[data-theme="light"] {
    /* Light Mode Background Colors */
    --bg-primary: #F5F7FA;
    --bg-secondary: #FFFFFF;
    --bg-tertiary: #F0F2F5;
    --bg-hover: #E8EAED;

    /* Text Colors */
    --text-primary: #1A1A1A;
    --text-secondary: #5F6368;
    --text-muted: #80868B;

    /* Cyber Accent Colors - Slightly darker for better contrast in light mode */
    --accent-primary: #00838F;
    --accent-secondary: #6A1B9A;
    --accent-success: #00C853;
    --accent-warning: #FF8F00;
    --accent-error: #D32F2F;

    /* Border Colors */
    --border-color: rgba(0, 0, 0, 0.12);
    --border-hover: rgba(0, 131, 143, 0.3);

    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
    --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.15);
    --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.18);
    --shadow-xl: 0 8px 32px rgba(0, 0, 0, 0.2);

    /* Glow Effects - Softer in light mode */
    --glow-primary: 0 0 10px rgba(0, 131, 143, 0.2), 0 0 20px rgba(0, 131, 143, 0.1);
    --glow-secondary: 0 0 10px rgba(106, 27, 154, 0.2), 0 0 20px rgba(106, 27, 154, 0.1);
    --glow-success: 0 0 10px rgba(0, 200, 83, 0.2), 0 0 20px rgba(0, 200, 83, 0.1);

    /* Glass Morphism */
    --glass-bg: rgba(255, 255, 255, 0.8);
    --glass-border: rgba(0, 0, 0, 0.1);

    /* Gradients */
    --gradient-cyber: linear-gradient(135deg, #00838F 0%, #6A1B9A 100%);
    --gradient-neon: linear-gradient(135deg, #00C853 0%, #00838F 50%, #6A1B9A 100%);
  }

  :root {
    /* Default to dark mode */
    --bg-primary: #0A0A0F;
    --bg-secondary: #12121A;
    --bg-tertiary: #1A1A28;
    --bg-hover: #222236;
    --text-primary: #E0E0FF;
    --text-secondary: #AAAACD;
    --text-muted: #8C8CBA;
    --accent-primary: #00B8D4;
    --accent-secondary: #7B1FA2;
    --accent-success: #00E676;
    --accent-warning: #FFA500;
    --accent-error: #FF0066;
    --border-color: rgba(224, 224, 255, 0.1);
    --border-hover: rgba(0, 184, 212, 0.3);
    --shadow-sm: 0 2px 8px rgba(0, 184, 212, 0.15);
    --shadow-md: 0 4px 16px rgba(0, 184, 212, 0.2);
    --shadow-lg: 0 8px 32px rgba(0, 184, 212, 0.25);
    --shadow-xl: 0 16px 48px rgba(0, 184, 212, 0.3);
    --glow-primary: 0 0 15px rgba(0, 184, 212, 0.35), 0 0 30px rgba(0, 184, 212, 0.2);
    --glow-secondary: 0 0 15px rgba(123, 31, 162, 0.35), 0 0 30px rgba(123, 31, 162, 0.2);
    --glow-success: 0 0 15px rgba(0, 230, 118, 0.35), 0 0 30px rgba(0, 230, 118, 0.2);
    --glass-bg: rgba(18, 18, 26, 0.7);
    --glass-border: rgba(224, 224, 255, 0.1);
    --gradient-cyber: linear-gradient(135deg, #00B8D4 0%, #7B1FA2 100%);
    --gradient-neon: linear-gradient(135deg, #00E676 0%, #00B8D4 50%, #7B1FA2 100%);
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  code {
    font-family: 'JetBrains Mono', 'Fira Code', source-code-pro, Menlo, Monaco,
      Consolas, 'Courier New', monospace;
    background: var(--bg-tertiary);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: inherit;
    font-weight: 600;
    color: var(--text-primary);
  }

  a {
    color: var(--accent-primary);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--accent-secondary);
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s ease;
  }

  input, textarea, select {
    font-family: inherit;
    color: var(--text-primary);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: var(--accent-primary);
      box-shadow: var(--glow-primary);
    }
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--bg-hover);
    border-radius: 6px;
    border: 2px solid var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--border-hover);
  }

  /* Selection color */
  ::selection {
    background: var(--accent-primary);
    color: white;
  }

  /* React Flow theme overrides */
  .react-flow {
    background: var(--bg-secondary);
  }

  .react-flow__node {
    background: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    color: var(--text-primary);
    box-shadow: var(--shadow-md);
  }

  .react-flow__node:hover {
    border-color: var(--accent-primary);
    box-shadow: var(--glow-primary);
  }

  .react-flow__node.selected {
    border-color: var(--accent-primary);
    box-shadow: var(--glow-primary);
  }

  .react-flow__edge-path {
    stroke: var(--accent-primary);
    stroke-width: 2;
  }

  .react-flow__edge.selected .react-flow__edge-path {
    stroke: var(--accent-secondary);
  }

  .react-flow__controls {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
  }

  .react-flow__controls-button {
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);

    &:hover {
      background: var(--bg-hover);
    }
  }

  .react-flow__minimap {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
  }

  /* Smooth transitions */
  * {
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }
`;

export default GlobalStyles;
