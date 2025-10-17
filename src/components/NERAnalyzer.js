import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { entityColors } from '../theme';
import { apiService } from '../services/api';
import SampleSelector from './SampleSelector';
import { NER_SAMPLES } from '../config/samples';
import AIHelpPanel from './AIHelpPanel';

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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SampleSection = styled.div`
  margin-top: 2rem;
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
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;

  @media (max-width: 768px) {
    min-height: 250px;
    max-height: 350px;
    font-size: 15px;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    min-height: 200px;
    max-height: 300px;
    padding: 1.25rem;
    font-size: 14px;
  }
`;

const Entity = styled.span`
  position: relative;
  background: ${props => entityColors[props.entityType] || entityColors.default}40;
  border: 2px solid ${props => entityColors[props.entityType] || entityColors.default};
  border-radius: 4px;
  padding: 2px 6px;
  margin: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;

  &:hover {
    background: ${props => entityColors[props.entityType] || entityColors.default}60;
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

  ${Entity}:hover & {
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
  margin-bottom: 1rem;
  overflow: hidden;
`;

const LegendHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
  }
`;

const LegendTitle = styled.h4`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 600;
`;

const LegendToggle = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 12px;
  transition: transform 0.2s ease;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const LegendContent = styled.div`
  max-height: ${props => props.expanded ? '200px' : '0'};
  overflow: ${props => props.expanded ? 'auto' : 'hidden'};
  transition: max-height 0.3s ease;
  padding: ${props => props.expanded ? '0 1rem 1rem 1rem' : '0 1rem'};
`;

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
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
  background: ${props => entityColors[props.entityType] || entityColors.default}40;
  border: 2px solid ${props => entityColors[props.entityType] || entityColors.default};
`;

const LegendLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const NERAnalyzer = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiHelp, setAiHelp] = useState(null);
  const [aiHelpLoading, setAiHelpLoading] = useState(false);
  const [legendExpanded, setLegendExpanded] = useState(true);
  const STORAGE_KEY = 'ner_analyzer_state_v1';

  // Load cached state on mount
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
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ text, analysis }));
    } catch (_) {
      // ignore
    }
  }, [text, analysis]);

  const analyzeText = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.analyzeNER(text);
      setAnalysis(result);
      setAiHelp(null);
    } catch (err) {
      console.error('NER analysis error:', err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Failed to analyze text. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [text]);

  const getAIHelp = useCallback(async () => {
    if (!analysis) return;
    setAiHelpLoading(true);
    try {
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
        // Middle or end of entity - don't render (already handled above)
        return null;
      } else {
        // Regular character
        return char;
      }
    }).filter(Boolean);
  };

  const legendItems = [
    { entityType: 'PERSON', label: 'Person' },
    { entityType: 'ORG', label: 'Organization' },
    { entityType: 'GPE', label: 'Geopolitical Entity' },
    { entityType: 'MONEY', label: 'Money' },
    { entityType: 'DATE', label: 'Date' },
    { entityType: 'TIME', label: 'Time' },
    { entityType: 'PERCENT', label: 'Percentage' },
    { entityType: 'LOC', label: 'Location' },
    { entityType: 'EVENT', label: 'Event' },
    { entityType: 'WORK_OF_ART', label: 'Work of Art' },
  ];

  return (
    <Container theme={theme}>
      <Section theme={theme}>
        <GridContainer theme={theme}>
          <LeftColumn theme={theme}>
            <Label theme={theme}>Enter text for NER analysis:</Label>
            <TextArea
              theme={theme}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter or paste text here for Named Entity Recognition..."
            />
            <Button
              theme={theme}
              onClick={analyzeText}
              disabled={loading || !text.trim()}
            >
              {loading && <LoadingSpinner />}
              {loading ? 'Analyzing NER...' : 'Analyze NER'}
            </Button>
            
            {error && (
              <ErrorMessage theme={theme}>
                <strong>Error:</strong> {error}
              </ErrorMessage>
            )}
          </LeftColumn>

          <RightColumn theme={theme}>
            <Legend theme={theme}>
              <LegendHeader theme={theme} onClick={() => setLegendExpanded(!legendExpanded)}>
                <LegendTitle theme={theme}>Entity Type Legend</LegendTitle>
                <LegendToggle theme={theme} expanded={legendExpanded}>▼</LegendToggle>
              </LegendHeader>
              <LegendContent theme={theme} expanded={legendExpanded}>
                <LegendGrid theme={theme}>
                  {legendItems.map((item) => (
                    <LegendItem key={item.entityType} theme={theme}>
                      <LegendColor entityType={item.entityType} />
                      <LegendLabel theme={theme}>{item.label}</LegendLabel>
                    </LegendItem>
                  ))}
                </LegendGrid>
              </LegendContent>
            </Legend>
            
            <div>
              <Label theme={theme}>NER Analysis Results:</Label>
              <HighlightedText theme={theme}>
                {analysis ? renderHighlightedText() : 'Enter text and click "Analyze NER" to see results...'}
              </HighlightedText>
              {analysis && (
                <Button theme={theme} onClick={getAIHelp} disabled={aiHelpLoading} style={{ marginTop: '0.75rem' }}>
                  {aiHelpLoading && <LoadingSpinner />}
                  {aiHelpLoading ? 'Getting AI Help...' : 'Get AI Help'}
                </Button>
              )}
              {aiHelp && (
                <AIHelpPanel title="AI Help: NER Analysis" content={aiHelp} />
              )}
            </div>
          </RightColumn>
        </GridContainer>

        <SampleSection theme={theme}>
          <SampleSelector 
            samples={NER_SAMPLES} 
            onSelect={setText}
            label="Sample Texts for NER Analysis"
          />
        </SampleSection>
      </Section>
    </Container>
  );
};

export default NERAnalyzer;
