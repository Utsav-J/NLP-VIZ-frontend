import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  position: relative;
  overflow-x: hidden;
`;

const Header = styled.header`
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const LogoText = styled.h2`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}15,
    ${props => props.theme.colors.secondary}15,
    ${props => props.theme.colors.primary}15
  );
  background-size: 200% 200%;
  animation: ${gradientAnimation} 15s ease infinite;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${props => props.theme.colors.primary}20 0%, transparent 70%);
    animation: ${float} 20s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${props => props.theme.colors.secondary}20 0%, transparent 70%);
    animation: ${float} 25s ease-in-out infinite reverse;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}, 
    ${props => props.theme.colors.secondary}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeIn} 1s ease;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: ${props => props.theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 0 3rem 0;
  animation: ${fadeIn} 1s ease 0.2s backwards;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${fadeIn} 1s ease 0.4s backwards;
`;

const CTAButton = styled.button`
  padding: 18px 48px;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}, 
    ${props => props.theme.colors.secondary}
  );
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px ${props => props.theme.colors.primary}50;
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled.a`
  padding: 18px 48px;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  background: transparent;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    transform: translateY(-4px);
    box-shadow: 0 10px 20px ${props => props.theme.colors.primary}30;
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.theme.colors.surface};
  border-top: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 20%;
    right: -10%;
    width: 40%;
    height: 40%;
    background: radial-gradient(circle, ${props => props.theme.colors.primary}10 0%, transparent 70%);
    animation: ${float} 30s ease-in-out infinite;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 10%;
    left: -10%;
    width: 50%;
    height: 50%;
    background: radial-gradient(circle, ${props => props.theme.colors.secondary}10 0%, transparent 70%);
    animation: ${float} 35s ease-in-out infinite reverse;
    border-radius: 50%;
  }
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4rem 0;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease ${props => props.delay || '0s'} backwards;

  &:hover {
    transform: translateY(-8px);
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    
    .icon {
      animation: ${float} 2s ease infinite;
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem 0;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const Footer = styled.footer`
  padding: 3rem 2rem;
  text-align: center;
  background: ${props => props.theme.colors.surface};
  border-top: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const LandingPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: '🏷️',
      title: 'POS Tagging',
      description: 'Analyze part-of-speech tags with interactive visualizations and detailed linguistic information.',
      delay: '0s'
    },
    {
      icon: '🎯',
      title: 'Named Entity Recognition',
      description: 'Identify and classify entities like persons, organizations, locations, and more.',
      delay: '0.1s'
    },
    {
      icon: '🌳',
      title: 'Dependency Parsing',
      description: 'Visualize grammatical relationships and sentence structure with interactive tree diagrams.',
      delay: '0.2s'
    },
    {
      icon: '📊',
      title: 'CFG Parsing',
      description: 'Generate context-free grammar parse trees using advanced AI-powered analysis.',
      delay: '0.3s'
    },
    {
      icon: '🎭',
      title: 'Semantic Role Labeling',
      description: 'Understand who did what to whom with predicate-argument structure analysis.',
      delay: '0.4s'
    },
    {
      icon: '🌐',
      title: 'Translation',
      description: 'Translate text between multiple languages with high-quality neural machine translation.',
      delay: '0.5s'
    }
  ];

  return (
    <Container theme={theme}>
      <Header>
        <LogoSection>
          <LogoImage src={process.env.PUBLIC_URL + '/logo.png'} alt="LexiView Logo" />
          <LogoText theme={theme}>LexiView</LogoText>
        </LogoSection>
        <ThemeToggle />
      </Header>

      <HeroSection theme={theme}>
        <Title theme={theme}>
          LexiView
        </Title>
        <Subtitle theme={theme}>
          Advanced NLP Visualization System • Unlock the power of natural language processing with interactive tools for linguistic analysis, entity recognition, and semantic understanding.
        </Subtitle>
        <ButtonContainer>
          <CTAButton theme={theme} onClick={() => navigate('/app')}>
            Get Started →
          </CTAButton>
          <SecondaryButton 
            theme={theme} 
            href="https://github.com/Utsav-J/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <span>⭐</span> Visit the Repo
          </SecondaryButton>
        </ButtonContainer>
      </HeroSection>

      <FeaturesSection theme={theme}>
        <FeaturesContainer>
          <SectionTitle theme={theme}>Powerful Features</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index} theme={theme} delay={feature.delay}>
                <FeatureIcon className="icon">{feature.icon}</FeatureIcon>
                <FeatureTitle theme={theme}>{feature.title}</FeatureTitle>
                <FeatureDescription theme={theme}>
                  {feature.description}
                </FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <Footer theme={theme}>
        <p>Built with React • Powered by Advanced NLP & AI</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          © 2025 LexiView. All rights reserved.
        </p>
      </Footer>
    </Container>
  );
};

export default LandingPage;

