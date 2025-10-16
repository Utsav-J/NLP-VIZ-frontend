import React, { useState } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import POSAnalyzer from './components/POSAnalyzer';
import NERAnalyzer from './components/NERAnalyzer';
import Translator from './components/Translator';
import LanguagesList from './components/LanguagesList';
import './App.css';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('pos');

  const tabs = [
    { id: 'pos', label: 'POS Analysis' },
    { id: 'ner', label: 'NER Analysis' },
    { id: 'translate', label: 'Translation' },
    { id: 'languages', label: 'Languages' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pos':
        return <POSAnalyzer />;
      case 'ner':
        return <NERAnalyzer />;
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