import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.surfaceSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background: ${props => props.theme.colors.border};
    transform: translateY(-1px);
  }
`;

const ToggleButton = styled.div`
  width: 48px;
  height: 24px;
  background: ${props => props.isDark ? props.theme.colors.primary : props.theme.colors.textMuted};
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
`;

const ToggleSlider = styled.div`
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${props => props.isDark ? '26px' : '2px'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const ToggleLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
`;

const ThemeToggle = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <ToggleContainer theme={theme} onClick={toggleTheme}>
      <ToggleButton theme={theme} isDark={isDark}>
        <ToggleSlider theme={theme} isDark={isDark} />
      </ToggleButton>
      <ToggleLabel theme={theme}>
        {isDark ? 'Dark' : 'Light'}
      </ToggleLabel>
    </ToggleContainer>
  );
};

export default ThemeToggle;
