import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';
import SampleSelector from './SampleSelector';
import { SRL_SAMPLES } from '../config/samples';

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

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.text};
  font-size: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
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
    min-height: 180px;
    font-size: 16px;
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

const ResultCard = styled.div`
  background: ${props => props.theme.colors.surfaceSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  margin-top: 2rem;
  max-height: 600px;
  overflow: auto;
`;

const MermaidContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  overflow: auto;
`;

const RolesTable = styled.div`
  margin-top: 1.5rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const RolesHeader = styled.div`
  background: ${props => props.theme.colors.border};
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const RolesRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  font-size: 13px;
`;

const RolesCellHeader = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RolesCell = styled.div`
  color: ${props => props.theme.colors.text};
`;

const Explanation = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  margin-top: 1rem;
  white-space: pre-wrap;
`;

const SemanticRoleAnalyzer = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mermaidRef = useRef(null);
  const STORAGE_KEY = 'semantic_roles_state_v1';

  // Load cached state
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          if (typeof parsed.text === 'string') setText(parsed.text);
          if (parsed.result) setResult(parsed.result);
        }
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ text, result }));
    } catch (_) {}
  }, [text, result]);

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
      setResult(response);
    } catch (err) {
      setError(
        err.response?.status === 422
          ? 'Invalid request. Ensure JSON body contains "text".'
          : err.response?.data?.detail || err.message || 'Failed to analyze semantic roles.'
      );
    } finally {
      setLoading(false);
    }
  }, [text]);

  // Render Mermaid after result changes
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

  return (
    <Container theme={theme}>
      <Section theme={theme}>
        <GridContainer theme={theme}>
          <LeftColumn theme={theme}>
            <Label theme={theme}>Enter a sentence for Semantic Role Labeling (Gemini):</Label>
            <TextArea
              theme={theme}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type any sentence to extract predicate-argument structure (who did what to whom, where, when)."
            />
            <Button
              theme={theme}
              onClick={analyzeText}
              disabled={loading || !text.trim()}
            >
              {loading && <LoadingSpinner />}
              {loading ? 'Analyzing Roles...' : 'Analyze Semantic Roles'}
            </Button>

            {error && (
              <div style={{ marginTop: '1rem' }}>
                <Label theme={theme}>Error:</Label>
                <div style={{
                  background: theme.colors.error + '20',
                  color: theme.colors.error,
                  border: '1px solid ' + theme.colors.error + '40',
                  borderRadius: theme.borderRadius.md,
                  padding: '1rem',
                  fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
                  fontSize: '13px'
                }}>{error}</div>
              </div>
            )}
          </LeftColumn>

          <RightColumn theme={theme}>
            <div>
              <Label theme={theme}>Semantic Roles (Mermaid + Table):</Label>
              <ResultCard theme={theme}>
                <MermaidContainer theme={theme}>
                  <div ref={mermaidRef} />
                </MermaidContainer>

                {result?.roles && result.roles.length > 0 && (
                  <RolesTable theme={theme}>
                    <RolesHeader theme={theme}>
                      <RolesRow theme={theme}>
                        <RolesCellHeader theme={theme}>Word / Span</RolesCellHeader>
                        <RolesCellHeader theme={theme}>Role</RolesCellHeader>
                        <RolesCellHeader theme={theme}>Predicate</RolesCellHeader>
                      </RolesRow>
                    </RolesHeader>
                    {result.roles.map((r, idx) => (
                      <RolesRow key={idx} theme={theme}>
                        <RolesCell theme={theme}>{r.word}</RolesCell>
                        <RolesCell theme={theme}>{r.role}</RolesCell>
                        <RolesCell theme={theme}>{r.predicate}</RolesCell>
                      </RolesRow>
                    ))}
                  </RolesTable>
                )}

                {result?.explanation && (
                  <Explanation theme={theme}>{result.explanation}</Explanation>
                )}
              </ResultCard>
            </div>
          </RightColumn>
        </GridContainer>

        <div>
          <SampleSelector 
            samples={SRL_SAMPLES}
            onSelect={setText}
            label="Sample Sentences (Semantic Roles via Gemini)"
          />
        </div>
      </Section>
    </Container>
  );
};

export default SemanticRoleAnalyzer;


