import React, { useState } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import POSAnalyzer from './components/POSAnalyzer';
import NERAnalyzer from './components/NERAnalyzer';
import DependencyParser from './components/DependencyParser';
import Translator from './components/Translator';
import CFGGeminiParser from './components/CFGGeminiParser';
import SemanticRoleAnalyzer from './components/SemanticRoleAnalyzer';
import LanguagesList from './components/LanguagesList';
import './App.css';

const AppContent = () => {
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
      case 'pos':
        return <POSAnalyzer />;
      case 'ner':
        return <NERAnalyzer />;
      case 'dependency':
        return <DependencyParser />;
      case 'cfg-gemini':
        return <CFGGeminiParser />;
      case 'semantic':
        return <SemanticRoleAnalyzer />;
      case 'translate':
        return <Translator />;
      case 'languages':
        return <LanguagesList />;
      default:
        return <POSAnalyzer />;
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
      <AppContent />
    </ThemeProvider>
  );
}

export default App;