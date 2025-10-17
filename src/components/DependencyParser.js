import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';
import SampleSelector from './SampleSelector';
import { DEPENDENCY_SAMPLES } from '../config/samples';

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

const ResultContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  min-height: 300px;
  max-height: 600px;
  overflow-y: auto;
  overflow-x: auto;
`;

const SVGContainer = styled.div`
  width: 100%;
  max-height: 400px;
  overflow: auto;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    max-height: 100%;
  }
`;

const DependencyTable = styled.div`
  margin-top: 2rem;
  background: ${props => props.theme.colors.surfaceSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: ${props => props.theme.colors.border};
  padding: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const TableContent = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: 13px;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:nth-child(even) {
    background: ${props => props.theme.colors.surface};
  }
`;

const TableCell = styled.div`
  color: ${props => props.theme.colors.text};
  word-break: break-word;
`;

const TableHeaderCell = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PlaceholderText = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textMuted};
  padding: 3rem;
  font-size: 16px;
  line-height: 1.6;
`;

const DependencyParser = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const STORAGE_KEY = 'dependency_parser_state_v1';

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
      const result = await apiService.analyzeDependency(text);
      setAnalysis(result);
    } catch (err) {
      console.error('Dependency analysis error:', err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Failed to analyze text. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [text]);

  const renderSVG = () => {
    if (!analysis || !analysis.svg) return null;
    
    // Extract SVG dimensions and resize to fit container
    const processedSVG = analysis.svg.replace(
      /width="([^"]*)"\s+height="([^"]*)"/,
      (match, width, height) => {
        const originalWidth = parseFloat(width);
        const originalHeight = parseFloat(height);
        const containerWidth = 600; // Approximate container width
        const containerHeight = 400; // Max container height
        
        const scaleX = containerWidth / originalWidth;
        const scaleY = containerHeight / originalHeight;
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
        
        const newWidth = Math.round(originalWidth * scale);
        const newHeight = Math.round(originalHeight * scale);
        
        return `width="${newWidth}" height="${newHeight}"`;
      }
    );
    
    return (
      <SVGContainer theme={theme}>
        <div dangerouslySetInnerHTML={{ __html: processedSVG }} />
      </SVGContainer>
    );
  };

  const renderDependencyTable = () => {
    if (!analysis || !analysis.dependencies) return null;

    return (
      <DependencyTable theme={theme}>
        <TableHeader theme={theme}>
          <TableRow theme={theme}>
            <TableHeaderCell theme={theme}>Token</TableHeaderCell>
            <TableHeaderCell theme={theme}>POS</TableHeaderCell>
            <TableHeaderCell theme={theme}>Dependency</TableHeaderCell>
            <TableHeaderCell theme={theme}>Head</TableHeaderCell>
            <TableHeaderCell theme={theme}>Children</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableContent theme={theme}>
          {analysis.dependencies.map((dep, index) => (
            <TableRow key={index} theme={theme}>
              <TableCell theme={theme}>{dep.token}</TableCell>
              <TableCell theme={theme}>{dep.pos}</TableCell>
              <TableCell theme={theme}>{dep.dep}</TableCell>
              <TableCell theme={theme}>{dep.head}</TableCell>
              <TableCell theme={theme}>
                {dep.children.length > 0 ? dep.children.join(', ') : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableContent>
      </DependencyTable>
    );
  };

  return (
    <Container theme={theme}>
      <Section theme={theme}>
        <GridContainer theme={theme}>
          <LeftColumn theme={theme}>
            <Label theme={theme}>Enter text for dependency parsing:</Label>
            <TextArea
              theme={theme}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter a single sentence for dependency parsing analysis..."
            />
            <Button
              theme={theme}
              onClick={analyzeText}
              disabled={loading || !text.trim()}
            >
              {loading && <LoadingSpinner />}
              {loading ? 'Analyzing...' : 'Analyze Dependencies'}
            </Button>
            
            {error && (
              <ErrorMessage theme={theme}>
                <strong>Error:</strong> {error}
              </ErrorMessage>
            )}
          </LeftColumn>

          <RightColumn theme={theme}>
            <div>
              <Label theme={theme}>Dependency Analysis Results:</Label>
              <ResultContainer theme={theme}>
                {analysis ? (
                  <>
                    {renderSVG()}
                    {renderDependencyTable()}
                  </>
                ) : (
                  <PlaceholderText theme={theme}>
                    Enter a sentence and click "Analyze Dependencies" to see the dependency tree and relationships...
                  </PlaceholderText>
                )}
              </ResultContainer>
            </div>
          </RightColumn>
        </GridContainer>

        <SampleSection theme={theme}>
          <SampleSelector 
            samples={DEPENDENCY_SAMPLES} 
            onSelect={setText}
            label="Sample Sentences for Dependency Parsing"
          />
        </SampleSection>
      </Section>
    </Container>
  );
};

export default DependencyParser;
