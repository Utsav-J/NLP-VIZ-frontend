# Frontend Code Samples - NLP Visualization System (LexiView)

## Project Overview
This document contains crucial code samples from the frontend application that demonstrate key features, API integration, and data presentation patterns.

---

## Table of Contents
1. [API Service Layer](#1-api-service-layer)
2. [State Management & Caching](#2-state-management--caching)
3. [Theme Management](#3-theme-management)
4. [POS Tagging Feature](#4-pos-tagging-feature)
5. [Named Entity Recognition (NER)](#5-named-entity-recognition-ner)
6. [Dependency Parsing with Full-Screen Viewer](#6-dependency-parsing-with-full-screen-viewer)
7. [CFG Parsing with Mermaid Diagrams](#7-cfg-parsing-with-mermaid-diagrams)
8. [Semantic Role Labeling](#8-semantic-role-labeling)
9. [AI Help Integration](#9-ai-help-integration)
10. [Routing & Navigation](#10-routing--navigation)

---

## 1. API Service Layer

### Purpose
Centralized API service using Axios for all backend communication with interceptors for logging and error handling.

### Code Sample: `src/services/api.js`

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} for ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Methods
export const apiService = {
  // POS Analysis
  analyzePOS: async (text) => {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    const response = await api.post('/pos', { text: text.trim() });
    return response.data;
  },

  // NER Analysis
  analyzeNER: async (text) => {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    const response = await api.post('/ner', { text: text.trim() });
    return response.data;
  },

  // Dependency Parsing
  analyzeDependency: async (text) => {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    const response = await api.post('/dependency', { text: text.trim() });
    return response.data;
  },

  // CFG Parsing via Gemini
  analyzeCFGGemini: async (text) => {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    const response = await api.post('/cfg-gemini', { text: text.trim() });
    return response.data;
  },

  // Semantic Role Labeling
  analyzeSemantic: async (text) => {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    const response = await api.post('/semantic', { text: text.trim() });
    return response.data;
  },

  // AI Help
  getAIHelp: async (resultText) => {
    if (!resultText || resultText.trim().length === 0) {
      throw new Error('Result text cannot be empty');
    }
    const response = await api.post('/ai-help', { text: resultText.trim() });
    return typeof response.data === 'string' 
      ? response.data 
      : JSON.stringify(response.data);
  },

  // Translation
  translateText: async (text, targetLanguage) => {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    const response = await api.post('/translate', {
      text: text.trim(),
      target_language: targetLanguage,
    });
    return response.data;
  },
};
```

**Key Features:**
- Axios interceptors for request/response logging
- Centralized error handling
- Input validation before API calls
- Consistent response format handling

---

## 2. State Management & Caching

### Purpose
Persist user data across tab switches and page reloads using localStorage.

### Code Sample: State Persistence Pattern

```javascript
// Example from POSAnalyzer.js
const POSAnalyzer = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const STORAGE_KEY = 'pos_analyzer_state_v1';

  // Load cached state on component mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          if (typeof parsed.text === 'string') setText(parsed.text);
          if (parsed.analysis) setAnalysis(parsed.analysis);
        }
      }
    } catch (_) {
      // Silently ignore cache errors
    }
  }, []);

  // Persist state whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ text, analysis }));
    } catch (_) {
      // Silently ignore storage errors (quota exceeded, etc.)
    }
  }, [text, analysis]);

  // ... rest of component
};
```

**Benefits:**
- Data persists across sessions
- Improved user experience (no data loss on refresh)
- Separate storage keys for each feature
- Graceful error handling

---

## 3. Theme Management

### Purpose
Provide light/dark mode with React Context API and styled-components integration.

### Code Sample: `src/context/ThemeContext.js`

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Load theme preference from localStorage
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });

  // Persist theme preference
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const theme = isDark ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Theme Configuration: `src/theme.js`

```javascript
export const lightTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    success: '#10b981',
    error: '#ef4444',
    // ... more colors
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
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
    text: '#f1f5f9',
    // ... more colors
  },
  // ... shadows and borderRadius
};
```

**Key Features:**
- Context API for global state
- localStorage for persistence
- Seamless theme switching
- Typed theme object for consistency

---

## 4. POS Tagging Feature

### Purpose
Analyze and visualize Part-of-Speech tags with interactive tooltips and color-coding.

### Code Sample: API Call & Data Presentation

```javascript
// From POSAnalyzer.js

// API Call with loading states
const analyzeText = useCallback(async () => {
  if (!text.trim()) {
    setError('Please enter some text to analyze');
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const result = await apiService.analyzePOS(text);
    setAnalysis(result);
    setAiHelp(null); // Clear previous AI help
  } catch (err) {
    console.error('POS analysis error:', err);
    setError(
      err.response?.data?.detail || 
      err.message || 
      'Failed to analyze text. Please check your connection and try again.'
    );
  } finally {
    setLoading(false);
  }
}, [text]);

// Data Presentation: Render highlighted tokens
const renderHighlightedText = () => {
  if (!analysis || !analysis.tokens) return null;

  return analysis.tokens.map((token, index) => (
    <Token
      key={index}
      theme={theme}
      pos={token.pos}
      title={`${token.pos}: ${token.text}`}
    >
      {token.text}
      <Tooltip theme={theme}>
        <strong>{token.pos}</strong><br />
        Tag: {token.tag}<br />
        Lemma: {token.lemma}<br />
        Dep: {token.dep}<br />
        Position: {token.start}-{token.end}
      </Tooltip>
    </Token>
  ));
};
```

### Styled Components for Interactive Visualization

```javascript
const Token = styled.span`
  position: relative;
  background: ${props => posColors[props.pos] || posColors.default}40;
  border-radius: 3px;
  padding: 2px 4px;
  margin: 1px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => posColors[props.pos] || posColors.default}80;
    transform: translateY(-1px);
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  padding: 8px 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;

  ${Token}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;
```

**Key Features:**
- Color-coded POS tags
- Interactive tooltips on hover
- Detailed token information (lemma, dependency, position)
- Smooth animations

---

## 5. Named Entity Recognition (NER)

### Purpose
Identify and classify named entities with visual highlighting and color-coding.

### Code Sample: Entity Rendering Logic

```javascript
// From NERAnalyzer.js

const renderHighlightedText = () => {
  if (!analysis || !analysis.entities) return text;

  const entities = analysis.entities;
  const textArray = text.split('');
  
  // Create a map of character positions to entities
  const entityMap = {};
  entities.forEach(entity => {
    for (let i = entity.start; i < entity.end; i++) {
      entityMap[i] = entity;
    }
  });

  return textArray.map((char, index) => {
    const entity = entityMap[index];
    
    if (entity && index === entity.start) {
      // Start of entity - render the full entity span
      const entityText = text.slice(entity.start, entity.end);
      return (
        <Entity
          key={index}
          theme={theme}
          entityType={entity.label}
          title={`${entity.label}: ${entity.text}`}
        >
          {entityText}
          <Tooltip theme={theme}>
            <strong>{entity.label}</strong><br />
            Text: {entity.text}<br />
            Position: {entity.start}-{entity.end}
          </Tooltip>
        </Entity>
      );
    } else if (entityMap[index]) {
      // Middle or end of entity - skip (already rendered)
      return null;
    } else {
      // Regular character
      return char;
    }
  }).filter(Boolean);
};
```

### Entity Styling

```javascript
const Entity = styled.span`
  position: relative;
  background: ${props => entityColors[props.entityType] || entityColors.default}40;
  border: 2px solid ${props => entityColors[props.entityType] || entityColors.default};
  border-radius: 4px;
  padding: 2px 6px;
  margin: 1px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => entityColors[props.entityType] || entityColors.default}60;
    transform: translateY(-1px);
  }
`;
```

**Key Features:**
- Character-level entity mapping
- Multi-word entity support
- Color-coded by entity type (PERSON, ORG, GPE, etc.)
- Hover tooltips with detailed information

---

## 6. Dependency Parsing with Full-Screen Viewer

### Purpose
Display dependency parse trees as SVG diagrams with a modal full-screen viewer.

### Code Sample: SVG Rendering & Modal Integration

```javascript
// From DependencyParser.js

// Render scaled SVG for container view
const renderSVG = () => {
  if (!analysis || !analysis.svg) return null;
  
  // Scale SVG to fit container
  const processedSVG = analysis.svg.replace(
    /width="([^"]*)"\s+height="([^"]*)"/,
    (match, width, height) => {
      const originalWidth = parseFloat(width);
      const originalHeight = parseFloat(height);
      const containerWidth = 600;
      const containerHeight = 400;
      
      const scaleX = containerWidth / originalWidth;
      const scaleY = containerHeight / originalHeight;
      const scale = Math.min(scaleX, scaleY, 1);
      
      const newWidth = Math.round(originalWidth * scale);
      const newHeight = Math.round(originalHeight * scale);
      
      return `width="${newWidth}" height="${newHeight}"`;
    }
  );
  
  return (
    <SVGContainer theme={theme}>
      <FullScreenButton theme={theme} onClick={() => setIsModalOpen(true)}>
        🔍 View Full Screen
      </FullScreenButton>
      <div dangerouslySetInnerHTML={{ __html: processedSVG }} />w
    </SVGContainer>
  );
};

// Render full-size SVG in modal
const renderFullScreenSVG = () => {
  if (!analysis || !analysis.svg) return null;
  return (
    <FullScreenSVGContainer>
      <div dangerouslySetInnerHTML={{ __html: analysis.svg }} />
    </FullScreenSVGContainer>
  );
};

// Component JSX
return (
  <Container theme={theme}>
    {/* ... input and controls ... */}
    
    <ResultContainer theme={theme}>
      {renderSVG()}
      {renderDependencyTable()}
    </ResultContainer>

    {/* Full-screen modal */}
    <ImageModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Dependency Parse Tree - Full View"
    >
      {renderFullScreenSVG()}
    </ImageModal>
  </Container>
);
```

### Modal Component

```javascript
// From ImageModal.js

const ImageModal = ({ isOpen, onClose, title, children }) => {
  const { theme } = useTheme();

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent theme={theme} onClick={(e) => e.stopPropagation()}>
        <CloseButton theme={theme} onClick={onClose}>×</CloseButton>
        {title && <Title theme={theme}>{title}</Title>}
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};
```

**Key Features:**
- SVG auto-scaling for container view
- Full-screen modal for detailed viewing
- ESC key and click-outside to close
- Prevents body scrolling when modal is open

---

## 7. CFG Parsing with Mermaid Diagrams

### Purpose
Generate and render Context-Free Grammar parse trees using Mermaid.js diagrams.

### Code Sample: Mermaid Integration

```javascript
// From CFGGeminiParser.js

const CFGGeminiParser = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const mermaidRef = useRef(null);

  // API call to generate CFG
  const analyzeText = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter a sentence');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiService.analyzeCFGGemini(text);
      setResult(response); // Contains: { sentence, mermaid_code, explanation }
    } catch (err) {
      setError(
        err.response?.status === 422
          ? 'Invalid request. Ensure JSON body contains "text".'
          : err.response?.data?.detail || err.message || 'Failed to generate CFG parse.'
      );
    } finally {
      setLoading(false);
    }
  }, [text]);

  // Render Mermaid diagram when result changes
  useEffect(() => {
    const renderMermaid = async () => {
      if (!result?.mermaid_code || !mermaidRef.current) return;
      if (!window.mermaid) return;

      try {
        // Generate unique ID for each diagram
        const { svg } = await window.mermaid.render(
          `cfg_${Math.random().toString(36).slice(2)}`,
          result.mermaid_code
        );
        mermaidRef.current.innerHTML = svg;
      } catch (e) {
        // Fallback: show code as text if rendering fails
        mermaidRef.current.innerText = result.mermaid_code;
      }
    };

    renderMermaid();
  }, [result]);

  return (
    <Container theme={theme}>
      {/* Input section */}
      <TextArea
        theme={theme}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type any sentence. The backend uses Gemini to infer grammar."
      />
      
      {/* Mermaid diagram container */}
      <MermaidContainer theme={theme}>
        <div ref={mermaidRef} />
      </MermaidContainer>

      {/* Explanation */}
      {result?.explanation && (
        <Explanation theme={theme}>{result.explanation}</Explanation>
      )}
    </Container>
  );
};
```

### Mermaid Setup in HTML

```html
<!-- From public/index.html -->
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
  window.mermaid && window.mermaid.initialize({ 
    startOnLoad: false, 
    theme: 'default' 
  });
</script>
```

**Key Features:**
- Dynamic Mermaid diagram rendering
- Unique IDs to prevent conflicts
- Fallback to code display if rendering fails
- AI-generated grammar explanations

---

## 8. Semantic Role Labeling

### Purpose
Extract and visualize semantic roles (Agent, Patient, Location, etc.) with Mermaid graphs and data tables.

### Code Sample: Combined Visualization

```javascript
// From SemanticRoleAnalyzer.js

const analyzeText = useCallback(async () => {
  if (!text.trim()) {
    setError('Please enter a sentence');
    return;
  }

  setLoading(true);
  setError(null);
  setResult(null);

  try {
    const response = await apiService.analyzeSemantic(text);
    // Response: { sentence, mermaid_code, roles: [], explanation }
    setResult(response);
  } catch (err) {
    setError(
      err.response?.status === 422
        ? 'Invalid request.'
        : err.response?.data?.detail || err.message
    );
  } finally {
    setLoading(false);
  }
}, [text]);

// Render Mermaid diagram
useEffect(() => {
  const renderMermaid = async () => {
    if (!result?.mermaid_code || !mermaidRef.current) return;
    if (!window.mermaid) return;

    try {
      const { svg } = await window.mermaid.render(
        `srl_${Math.random().toString(36).slice(2)}`,
        result.mermaid_code
      );
      mermaidRef.current.innerHTML = svg;
    } catch (e) {
      mermaidRef.current.innerText = result.mermaid_code;
    }
  };

  renderMermaid();
}, [result]);

// Render roles table
return (
  <>
    {/* Mermaid Graph */}
    <MermaidContainer theme={theme}>
      <div ref={mermaidRef} />
    </MermaidContainer>

    {/* Roles Table */}
    {result?.roles && result.roles.length > 0 && (
      <RolesTable theme={theme}>
        <RolesHeader theme={theme}>
          <RolesRow theme={theme}>
            <RolesCellHeader>Word / Span</RolesCellHeader>
            <RolesCellHeader>Role</RolesCellHeader>
            <RolesCellHeader>Predicate</RolesCellHeader>
          </RolesRow>
        </RolesHeader>
        {result.roles.map((r, idx) => (
          <RolesRow key={idx} theme={theme}>
            <RolesCell>{r.word}</RolesCell>
            <RolesCell>{r.role}</RolesCell>
            <RolesCell>{r.predicate}</RolesCell>
          </RolesRow>
        ))}
      </RolesTable>
    )}

    {/* Explanation */}
    {result?.explanation && (
      <Explanation theme={theme}>{result.explanation}</Explanation>
    )}
  </>
);
```

**Key Features:**
- Dual visualization (graph + table)
- Predicate-argument relationships
- Role identification (Agent, Patient, Location, etc.)
- AI-generated explanations

---

## 9. AI Help Integration

### Purpose
Provide AI-powered explanations for POS and NER analysis results using Gemini.

### Code Sample: AI Help Button & Panel

```javascript
// From POSAnalyzer.js

const [aiHelp, setAiHelp] = useState(null);
const [aiHelpLoading, setAiHelpLoading] = useState(false);

// Get AI explanation
const getAIHelp = useCallback(async () => {
  if (!analysis) return;
  
  setAiHelpLoading(true);
  try {
    // Send analysis results as JSON string
    const resultText = JSON.stringify(analysis, null, 2);
    const help = await apiService.getAIHelp(resultText);
    setAiHelp(help);
  } catch (err) {
    setAiHelp(
      err.response?.data?.detail || err.message || 'Failed to get AI help.'
    );
  } finally {
    setAiHelpLoading(false);
  }
}, [analysis]);

// Render button and panel
return (
  <>
    {analysis && (
      <Button 
        theme={theme} 
        onClick={getAIHelp} 
        disabled={aiHelpLoading}
      >
        {aiHelpLoading && <LoadingSpinner />}
        {aiHelpLoading ? 'Getting AI Help...' : 'Get AI Help'}
      </Button>
    )}
    
    {aiHelp && (
      <AIHelpPanel 
        title="AI Help: POS Analysis" 
        content={aiHelp} 
      />
    )}
  </>
);
```

### AI Help Panel Component

```javascript
// From AIHelpPanel.js

const AIHelpPanel = ({ title = 'AI Help', content }) => {
  const { theme } = useTheme();
  if (!content) return null;

  let displayText = '';
  try {
    const parsed = JSON.parse(content);
    
    // Extract justification field if present
    if (parsed && typeof parsed === 'object' && parsed.justification) {
      displayText = parsed.justification;
    } else if (typeof parsed === 'string') {
      displayText = parsed;
    } else {
      displayText = JSON.stringify(parsed, null, 2);
    }
  } catch (_) {
    displayText = content;
  }

  // Format text with markdown-like syntax
  const formatText = (text) => {
    text = text.replace(/\\n/g, '\n'); // Convert escaped newlines
    
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((para, idx) => {
      para = para.trim();
      
      // Handle bullet points
      if (para.includes('\n-   ')) {
        const parts = para.split('\n-   ');
        const intro = parts[0];
        const bullets = parts.slice(1);
        
        return (
          <div key={idx}>
            {intro && <p>{intro}</p>}
            <ul>
              {bullets.map((bullet, bIdx) => {
                // Format bold text (**text**)
                const formattedBullet = bullet.split(/\*\*(.*?)\*\*/).map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                );
                return <li key={bIdx}>{formattedBullet}</li>;
              })}
            </ul>
          </div>
        );
      }
      
      // Regular paragraph with bold formatting
      const formattedPara = para.split(/\*\*(.*?)\*\*/).map((part, i) => 
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      );
      
      return <p key={idx}>{formattedPara}</p>;
    });
  };

  return (
    <Panel theme={theme}>
      <Header theme={theme}>{title}</Header>
      <Body theme={theme}>
        {formatText(displayText)}
      </Body>
    </Panel>
  );
};
```

**Key Features:**
- Context-aware AI explanations
- JSON response parsing
- Markdown-style formatting (bold, lists)
- Loading states and error handling

---

## 10. Routing & Navigation

### Purpose
Implement client-side routing with a landing page and main application using React Router.

### Code Sample: App Routing Structure

```javascript
// From App.js

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('pos');

  const tabs = [
    { id: 'pos', label: 'POS Analysis' },
    { id: 'ner', label: 'NER Analysis' },
    { id: 'dependency', label: 'Dependency Parsing' },
    { id: 'cfg-gemini', label: 'CFG Parsing' },
    { id: 'semantic', label: 'Semantic Roles' },
    { id: 'translate', label: 'Translation' },
    { id: 'languages', label: 'Languages' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pos': return <POSAnalyzer />;
      case 'ner': return <NERAnalyzer />;
      case 'dependency': return <DependencyParser />;
      case 'cfg-gemini': return <CFGGeminiParser />;
      case 'semantic': return <SemanticRoleAnalyzer />;
      case 'translate': return <Translator />;
      case 'languages': return <LanguagesList />;
      default: return <POSAnalyzer />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      tabs={tabs}
    >
      {renderTabContent()}
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<MainApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
```

### Landing Page Navigation

```javascript
// From LandingPage.js

import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <HeroSection>
      <Title>LexiView</Title>
      <Subtitle>Advanced NLP Visualization System</Subtitle>
      
      <ButtonContainer>
        {/* Navigate to main app */}
        <CTAButton onClick={() => navigate('/app')}>
          Get Started →
        </CTAButton>
        
        {/* External links */}
        <DropdownContainer>
          <SecondaryButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            ⭐ Visit the Repo
          </SecondaryButton>
          <DropdownMenu isOpen={isDropdownOpen}>
            <DropdownItem href="https://github.com/..." target="_blank">
              🎨 Frontend
            </DropdownItem>
            <DropdownItem href="https://github.com/..." target="_blank">
              ⚙️ Backend
            </DropdownItem>
          </DropdownMenu>
        </DropdownContainer>
      </ButtonContainer>
    </HeroSection>
  );
};
```

**Key Features:**
- React Router for SPA navigation
- Landing page at root (`/`)
- Main application at `/app`
- 404 redirect to landing page
- Programmatic navigation with `useNavigate`

---

## Summary of Key Technologies

### Frontend Stack
- **React 19.2.0** - Component-based UI
- **styled-components 6.1.19** - CSS-in-JS styling
- **react-router-dom 7.9.4** - Client-side routing
- **axios 1.12.2** - HTTP client for API calls
- **Mermaid.js 10** - Diagram rendering

### Key Patterns
1. **API Integration**: Centralized service layer with interceptors
2. **State Management**: React hooks + localStorage for persistence
3. **Theming**: Context API + styled-components
4. **Data Visualization**: Interactive tooltips, color-coding, SVG rendering
5. **Error Handling**: Try-catch blocks with user-friendly error messages
6. **Loading States**: Spinners and disabled buttons during async operations
7. **Responsive Design**: Mobile-first CSS with media queries

### Data Flow
1. User inputs text → Component state
2. Click analyze → API call via `apiService`
3. Loading state shown → Spinner displayed
4. Response received → Parse and update state
5. Data rendered → Styled components with theme
6. Results cached → localStorage for persistence

---

## Conclusion

This frontend application demonstrates modern React patterns with:
- Clean component architecture
- Robust API integration
- Rich data visualizations
- Excellent UX with animations and feedback
- Persistent state management
- Theme customization
- Responsive design

All code samples follow React best practices and maintain consistency across features.

