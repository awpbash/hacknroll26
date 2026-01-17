import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --bg-primary: #0a0e27;
    --bg-secondary: #151932;
    --bg-tertiary: #1e2139;
    --bg-hover: #252a48;

    --text-primary: #ffffff;
    --text-secondary: #b8b9cf;
    --text-muted: #787a9d;

    --accent-primary: #6366f1;
    --accent-secondary: #8b5cf6;
    --accent-success: #10b981;
    --accent-warning: #f59e0b;
    --accent-error: #ef4444;

    --border-color: #2a2e4a;
    --border-hover: #404563;

    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.5);
    --shadow-xl: 0 20px 50px rgba(0, 0, 0, 0.6);

    --glow-primary: 0 0 20px rgba(99, 102, 241, 0.3);
    --glow-success: 0 0 20px rgba(16, 185, 129, 0.3);
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

  /* Scrollbar styling for dark theme */
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

  /* React Flow dark theme overrides */
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
