export const lightTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceSecondary: '#f1f5f9',
    text: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};

export const darkTheme = {
  colors: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    background: '#0f172a',
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    border: '#334155',
    borderLight: '#475569',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};

// POS Tag colors for highlighting
export const posColors = {
  NOUN: '#fbbf24',
  VERB: '#34d399',
  ADJ: '#f87171',
  ADV: '#60a5fa',
  PRON: '#a78bfa',
  DET: '#fb7185',
  ADP: '#fde047',
  CONJ: '#86efac',
  CCONJ: '#86efac',
  NUM: '#fbbf24',
  PUNCT: '#94a3b8',
  PART: '#fbbf24',
  AUX: '#34d399',
  SCONJ: '#86efac',
  INTJ: '#a78bfa',
  SYM: '#94a3b8',
  X: '#64748b',
  default: '#64748b',
};

// Entity type colors
export const entityColors = {
  PERSON: '#ef4444',
  ORG: '#3b82f6',
  GPE: '#10b981',
  MONEY: '#f59e0b',
  DATE: '#8b5cf6',
  TIME: '#06b6d4',
  PERCENT: '#84cc16',
  default: '#64748b',
};
