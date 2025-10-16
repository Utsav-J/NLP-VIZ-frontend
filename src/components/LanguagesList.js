import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';

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

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  margin-bottom: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const LanguagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const LanguageCard = styled.div`
  background: ${props => props.theme.colors.surfaceSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.border};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const LanguageCode = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 4px;
`;

const LanguageName = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: capitalize;
`;

const StatsCard = styled.div`
  background: ${props => props.theme.colors.surfaceSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const StatsTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textMuted};
`;

const LanguagesList = () => {
  const { theme } = useTheme();
  const [languages, setLanguages] = useState({});
  const [filteredLanguages, setFilteredLanguages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadLanguages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.getLanguages();
      setLanguages(result);
      setFilteredLanguages(result);
    } catch (err) {
      console.error('Failed to load languages:', err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Failed to load supported languages. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load languages on component mount
  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  // Filter languages based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLanguages(languages);
      return;
    }

    const filtered = Object.entries(languages).filter(([code, name]) =>
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredLanguages(Object.fromEntries(filtered));
  }, [searchTerm, languages]);

  const languageEntries = Object.entries(filteredLanguages).sort(([a], [b]) => a.localeCompare(b));

  const handleLanguageClick = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      // Could add a toast notification here
      console.log(`Copied ${code} to clipboard`);
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  };

  return (
    <Container theme={theme}>
      <Section theme={theme}>
        <Button
          theme={theme}
          onClick={loadLanguages}
          disabled={loading}
        >
          {loading && <LoadingSpinner />}
          {loading ? 'Loading...' : 'Refresh Languages'}
        </Button>
      </Section>

      {error && (
        <ErrorMessage theme={theme}>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      {Object.keys(languages).length > 0 && (
        <>
          <StatsCard theme={theme}>
            <StatsTitle theme={theme}>Supported Languages</StatsTitle>
            <StatsGrid theme={theme}>
              <StatItem theme={theme}>
                <StatValue theme={theme}>{Object.keys(languages).length}</StatValue>
                <StatLabel theme={theme}>Total Languages</StatLabel>
              </StatItem>
              <StatItem theme={theme}>
                <StatValue theme={theme}>{Object.keys(filteredLanguages).length}</StatValue>
                <StatLabel theme={theme}>Filtered Results</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsCard>

          <Section theme={theme}>
            <Label theme={theme}>Search languages:</Label>
            <SearchInput
              theme={theme}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by language name or code..."
            />
          </Section>

          <LanguagesGrid theme={theme}>
            {languageEntries.map(([code, name]) => (
              <LanguageCard
                key={code}
                theme={theme}
                onClick={() => handleLanguageClick(code)}
                title={`Click to copy ${code}`}
              >
                <LanguageCode theme={theme}>{code.toUpperCase()}</LanguageCode>
                <LanguageName theme={theme}>{name}</LanguageName>
              </LanguageCard>
            ))}
          </LanguagesGrid>

          {languageEntries.length === 0 && (
            <EmptyState theme={theme}>
              No languages found matching "{searchTerm}"
            </EmptyState>
          )}
        </>
      )}
    </Container>
  );
};

export default LanguagesList;
