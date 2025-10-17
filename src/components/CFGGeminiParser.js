import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';
import SampleSelector from './SampleSelector';
import { CFG_GEMINI_SAMPLES } from '../config/samples';

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

const Explanation = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  margin-top: 1rem;
  white-space: pre-wrap;
`;

const CFGGeminiParser = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mermaidRef = useRef(null);
  const STORAGE_KEY = 'cfg_gemini_state_v1';

  // Load cached state on mount
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
    } catch (_) {
      // ignore cache errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist state when it changes
  useEffect(() => {
    try {
      const payload = JSON.stringify({ text, result });
      localStorage.setItem(STORAGE_KEY, payload);
    } catch (_) {
      // ignore quota or serialization errors
    }
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
      const response = await apiService.analyzeCFGGemini(text);
      setResult(response);
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

  // Render Mermaid after result changes
  useEffect(() => {
    const renderMermaid = async () => {
      if (!result?.mermaid_code || !mermaidRef.current) return;
      if (!window.mermaid) return;

      try {
        const { svg } = await window.mermaid.render(
          `cfg_${Math.random().toString(36).slice(2)}`,
          result.mermaid_code
        );
        mermaidRef.current.innerHTML = svg;
      } catch (e) {
        // Fallback: show code as preformatted text
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
            <Label theme={theme}>Enter a sentence for CFG parsing (Gemini):</Label>
            <TextArea
              theme={theme}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type any sentence. The backend uses Gemini to infer grammar and return a Mermaid diagram."
            />
            <Button
              theme={theme}
              onClick={analyzeText}
              disabled={loading || !text.trim()}
            >
              {loading && <LoadingSpinner />}
              {loading ? 'Generating CFG...' : 'Generate CFG'}
            </Button>

            {error && (
              <ErrorMessage theme={theme}>
                <strong>Error:</strong> {error}
              </ErrorMessage>
            )}
          </LeftColumn>

          <RightColumn theme={theme}>
            <div>
              <Label theme={theme}>CFG Parse (Mermaid):</Label>
              <ResultCard theme={theme}>
                <MermaidContainer theme={theme}>
                  <div ref={mermaidRef} />
                </MermaidContainer>
                {result?.explanation && (
                  <Explanation theme={theme}>{result.explanation}</Explanation>
                )}
              </ResultCard>
            </div>
          </RightColumn>
        </GridContainer>

        <div>
          <SampleSelector 
            samples={CFG_GEMINI_SAMPLES}
            onSelect={setText}
            label="Sample Sentences (CFG via Gemini)"
          />
        </div>
      </Section>
    </Container>
  );
};

export default CFGGeminiParser;


