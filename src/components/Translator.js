import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';
import SampleSelector from './SampleSelector';
import { TRANSLATION_SAMPLES } from '../config/samples';

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
    font-size: 16px; /* Prevent zoom on iOS */
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    min-height: 150px;
    padding: 1rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
  }

  @media (max-width: 768px) {
    padding: 14px 18px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 14px;
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

const ResultCard = styled.div`
  background: ${props => props.theme.colors.surfaceSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  margin-top: 2rem;
  max-height: 400px;
  overflow-y: auto;
`;

const ResultTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
`;

const ResultText = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  font-size: 16px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  margin-bottom: 1.5rem;
  min-height: 120px;
  max-height: 200px;
  overflow-y: auto;
`;

const ResultMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const MetaValue = styled.span`
  color: ${props => props.theme.colors.textSecondary};
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

const Translator = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [languages, setLanguages] = useState({});
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const STORAGE_KEY = 'translator_state_v1';

  // Load cached state and supported languages on component mount
  useEffect(() => {
    // Load cached state
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          if (typeof parsed.text === 'string') setText(parsed.text);
          if (typeof parsed.targetLanguage === 'string') setTargetLanguage(parsed.targetLanguage);
          if (parsed.translation) setTranslation(parsed.translation);
        }
      }
    } catch (_) {
      // ignore
    }

    const loadLanguages = async () => {
      try {
        const langs = await apiService.getLanguages();
        setLanguages(langs);
      } catch (err) {
        console.error('Failed to load languages:', err);
        setError('Failed to load supported languages. Please refresh the page.');
      }
    };

    loadLanguages();
  }, []);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ text, targetLanguage, translation })
      );
    } catch (_) {
      // ignore
    }
  }, [text, targetLanguage, translation]);

  const translateText = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    if (!targetLanguage) {
      setError('Please select a target language');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.translateText(text, targetLanguage);
      setTranslation(result);
    } catch (err) {
      console.error('Translation error:', err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Failed to translate text. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [text, targetLanguage]);

  const languageOptions = Object.entries(languages).map(([code, name]) => (
    <option key={code} value={code}>
      {name.charAt(0).toUpperCase() + name.slice(1)} ({code.toUpperCase()})
    </option>
  ));

  return (
    <Container theme={theme}>
      <Section theme={theme}>
        <GridContainer theme={theme}>
          <LeftColumn theme={theme}>
            <Label theme={theme}>Text to translate:</Label>
            <TextArea
              theme={theme}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter or paste text here to translate..."
            />
            
            <Label theme={theme}>Target language:</Label>
            <Select
              theme={theme}
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              disabled={Object.keys(languages).length === 0}
            >
              {languageOptions}
            </Select>

            <Button
              theme={theme}
              onClick={translateText}
              disabled={loading || !text.trim() || !targetLanguage}
            >
              {loading && <LoadingSpinner />}
              {loading ? 'Translating...' : 'Translate Text'}
            </Button>
            
            {error && (
              <ErrorMessage theme={theme}>
                <strong>Error:</strong> {error}
              </ErrorMessage>
            )}
          </LeftColumn>

          <RightColumn theme={theme}>
            <div>
              <Label theme={theme}>Translation Results:</Label>
              {translation ? (
                <ResultCard theme={theme}>
                  {/* <ResultTitle theme={theme}>Translation Result</ResultTitle>
                  
                  <div>
                    <Label theme={theme}>Original Text:</Label>
                    <ResultText theme={theme}>{translation.original_text}</ResultText>
                  </div> */}

                  <div>
                    <Label theme={theme}>Translated Text:</Label>
                    <ResultText theme={theme}>{translation.translated_text}</ResultText>
                  </div>

                  <ResultMeta theme={theme}>
                    <MetaItem theme={theme}>
                      <MetaLabel theme={theme}>Source Language:</MetaLabel>
                      <MetaValue theme={theme}>
                        {languages[translation.source_language]?.charAt(0).toUpperCase() + 
                         languages[translation.source_language]?.slice(1) || translation.source_language}
                      </MetaValue>
                    </MetaItem>
                    
                    <MetaItem theme={theme}>
                      <MetaLabel theme={theme}>Target Language:</MetaLabel>
                      <MetaValue theme={theme}>
                        {languages[translation.target_language]?.charAt(0).toUpperCase() + 
                         languages[translation.target_language]?.slice(1) || translation.target_language}
                      </MetaValue>
                    </MetaItem>
                    
                    <MetaItem theme={theme}>
                      <MetaLabel theme={theme}>Confidence:</MetaLabel>
                      <MetaValue theme={theme}>
                        {Math.round(translation.confidence * 100)}%
                      </MetaValue>
                    </MetaItem>
                  </ResultMeta>
                </ResultCard>
              ) : (
                <ResultCard theme={theme}>
                  <div style={{ 
                    textAlign: 'center', 
                    color: theme.colors.textMuted,
                    padding: '2rem',
                    fontSize: '16px'
                  }}>
                    Enter text, select language, and click "Translate Text" to see results...
                  </div>
                </ResultCard>
              )}
            </div>
          </RightColumn>
        </GridContainer>

        <SampleSection theme={theme}>
          <SampleSelector 
            samples={TRANSLATION_SAMPLES} 
            onSelect={setText}
            label="Sample Texts for Translation"
          />
        </SampleSection>
      </Section>
    </Container>
  );
};

export default Translator;
