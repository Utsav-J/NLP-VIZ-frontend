import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.text};
  font-size: 16px;
`;

const SamplesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const SampleCard = styled.button`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 80px;

  &:hover {
    background: ${props => props.theme.colors.surfaceSecondary};
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

const SampleTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SampleIcon = styled.span`
  font-size: 16px;
`;

const SamplePreview = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 13px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SampleSelector = ({ samples, onSelect, label = 'Sample Texts' }) => {
  const { theme } = useTheme();

  const handleSelect = (sample) => {
    onSelect(sample.text);
  };

  const getIcon = (index) => {
    const icons = ['📝', '💼', '🏢', '🎓', '📰', '💰', '🌍', '⚡', '🍕', '🤖'];
    return icons[index % icons.length];
  };

  return (
    <Container theme={theme}>
      <Label theme={theme}>{label}</Label>
      <SamplesContainer theme={theme}>
        {samples.map((sample, index) => (
          <SampleCard
            key={sample.id}
            theme={theme}
            onClick={() => handleSelect(sample)}
            type="button"
          >
            <SampleTitle theme={theme}>
              <SampleIcon>{getIcon(index)}</SampleIcon>
              {sample.title}
            </SampleTitle>
            <SamplePreview theme={theme}>{sample.text}</SamplePreview>
          </SampleCard>
        ))}
      </SamplesContainer>
    </Container>
  );
};

export default SampleSelector;
