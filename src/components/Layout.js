import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import StatusIndicator from './StatusIndicator';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
`;

const Header = styled.header`
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 1rem 2rem;
  box-shadow: ${props => props.theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const Main = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  scrollbar-width: thin;

  @media (max-width: 768px) {
    gap: 4px;
    margin-bottom: 1rem;
  }
`;

const Tab = styled.button`
  padding: 16px 32px;
  border: none;
  background: transparent;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.surfaceSecondary};
  }

  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px 18px;
    font-size: 14px;
  }
`;

const Content = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  overflow: hidden;
`;

const Layout = ({ children, activeTab, onTabChange, tabs }) => {
  const { theme } = useTheme();

  return (
    <LayoutContainer theme={theme}>
      <Header theme={theme}>
        <HeaderContent theme={theme}>
          <Logo theme={theme}>NLP Analysis API</Logo>
          <HeaderControls theme={theme}>
            <StatusIndicator />
            <ThemeToggle />
          </HeaderControls>
        </HeaderContent>
      </Header>
      
      <Main theme={theme}>
        <TabContainer theme={theme}>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              theme={theme}
              active={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabContainer>
        
        <Content theme={theme}>
          {children}
        </Content>
      </Main>
    </LayoutContainer>
  );
};

export default Layout;
