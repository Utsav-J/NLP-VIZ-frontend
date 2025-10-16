import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { posColors } from '../theme';
import { apiService } from '../services/api';
import SampleSelector from './SampleSelector';
import { POS_SAMPLES } from '../config/samples';

const Container = styled.div`
  padding: 3rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.text};
  font-size: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 250px;
  padding: 1.5rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
  }

  @media (max-width: 768px) {
    min-height: 200px;
    font-size: 16px; /* Prevent zoom on iOS */
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    min-height: 150px;
    padding: 1rem;
  }
`;

const Button = styled.button`
  padding: 16px 32px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 14px 28px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px 24px;
    font-size: 14px;
  }
`;

const HighlightedText = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  font-size: 16px;
  line-height: 1.8;
  min-height: 300px;
  white-space: pre-wrap;
  word-wrap: break-word;

  @media (max-width: 768px) {
    min-height: 250px;
    font-size: 15px;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    min-height: 200px;
    padding: 1.25rem;
    font-size: 14px;
  }
`;

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
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.lg};
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;

  ${Token}:hover & {
    opacity: 1;
    visibility: visible;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${props => props.theme.colors.surface};
  }
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.error}20;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error}40;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  margin-top: 1rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  white-space: pre-wrap;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Legend = styled.div`
  background: ${props => props.theme.colors.surfaceSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  margin-bottom: 1rem;
`;

const LegendTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  font-size: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${props => posColors[props.pos] || posColors.default}40;
  border: 1px solid ${props => posColors[props.pos] || posColors.default};
`;

const LegendLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const POSAnalyzer = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const legendItems = [
    { pos: 'NOUN', label: 'Noun' },
    { pos: 'VERB', label: 'Verb' },
    { pos: 'ADJ', label: 'Adjective' },
    { pos: 'ADV', label: 'Adverb' },
    { pos: 'PRON', label: 'Pronoun' },
    { pos: 'DET', label: 'Determiner' },
    { pos: 'ADP', label: 'Preposition' },
    { pos: 'CONJ', label: 'Conjunction' },
    { pos: 'NUM', label: 'Number' },
    { pos: 'PUNCT', label: 'Punctuation' },
    { pos: 'PART', label: 'Particle' },
    { pos: 'AUX', label: 'Auxiliary' },
    { pos: 'SCONJ', label: 'Subordinating Conjunction' },
    { pos: 'CCONJ', label: 'Coordinating Conjunction' },
    { pos: 'INTJ', label: 'Interjection' },
    { pos: 'SYM', label: 'Symbol' },
    { pos: 'X', label: 'Other' },
  ];

  return (
    <Container theme={theme}>
      <Section theme={theme}>
        
        <Label theme={theme}>Enter text for POS analysis:</Label>
        <TextArea
          theme={theme}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter or paste text here for Part-of-Speech tagging..."
        />

        <SampleSelector 
          samples={POS_SAMPLES} 
          onSelect={setText}
          label="Sample Texts for POS Analysis"
        />
        <Button
          theme={theme}
          onClick={analyzeText}
          disabled={loading || !text.trim()}
        >
          {loading && <LoadingSpinner />}
          {loading ? 'Analyzing POS...' : 'Analyze POS'}
        </Button>
      </Section>

      {error && (
        <ErrorMessage theme={theme}>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      {analysis && (
        <Section theme={theme}>
          <Legend theme={theme}>
            <LegendTitle theme={theme}>POS Tag Legend</LegendTitle>
            <LegendGrid theme={theme}>
              {legendItems.map((item) => (
                <LegendItem key={item.pos} theme={theme}>
                  <LegendColor pos={item.pos} />
                  <LegendLabel theme={theme}>{item.label}</LegendLabel>
                </LegendItem>
              ))}
            </LegendGrid>
          </Legend>
          
          <Label theme={theme}>POS Analysis Results:</Label>
          <HighlightedText theme={theme}>
            {renderHighlightedText()}
          </HighlightedText>
        </Section>
      )}
    </Container>
  );
};

export default POSAnalyzer;
