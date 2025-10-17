import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const Panel = styled.div`
  margin-top: 1rem;
  background: ${props => props.theme.colors.surfaceSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.sm};
  overflow: hidden;
`;

const Header = styled.div`
  background: ${props => props.theme.colors.border};
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const Body = styled.div`
  padding: 1.25rem 1.5rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.8;
  font-size: 14px;

  p {
    margin: 0 0 1rem 0;
  }

  ul {
    margin: 0.5rem 0 1rem 1.5rem;
    padding: 0;
  }

  li {
    margin: 0.5rem 0;
  }

  strong {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
  }

  code {
    background: ${props => props.theme.colors.surface};
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
  }
`;

const AIHelpPanel = ({ title = 'AI Help', content }) => {
  const { theme } = useTheme();
  if (!content) return null;

  let displayText = '';
  try {
    // Try parsing JSON content if it's a JSON string
    const parsed = JSON.parse(content);
    
    // If it has a "justification" field, extract that
    if (parsed && typeof parsed === 'object' && parsed.justification) {
      displayText = parsed.justification;
    } else if (typeof parsed === 'string') {
      displayText = parsed;
    } else if (typeof parsed === 'object') {
      displayText = JSON.stringify(parsed, null, 2);
    } else {
      displayText = String(parsed);
    }
  } catch (_) {
    displayText = content;
  }

  // Format the text for better readability
  const formatText = (text) => {
    // Replace literal \n with actual line breaks
    text = text.replace(/\\n/g, '\n');
    
    // Split into paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((para, idx) => {
      para = para.trim();
      
      // Check if it's a bullet point section
      if (para.includes('\n-   ')) {
        const parts = para.split('\n-   ');
        const intro = parts[0];
        const bullets = parts.slice(1);
        
        return (
          <div key={idx}>
            {intro && <p>{intro}</p>}
            <ul>
              {bullets.map((bullet, bIdx) => {
                // Format bold text (** text **)
                const formattedBullet = bullet.split(/\*\*(.*?)\*\*/).map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                );
                return <li key={bIdx}>{formattedBullet}</li>;
              })}
            </ul>
          </div>
        );
      }
      
      // Regular paragraph - format bold text
      const formattedPara = para.split(/\*\*(.*?)\*\*/).map((part, i) => 
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      );
      
      return <p key={idx}>{formattedPara}</p>;
    });
  };

  return (
    <Panel theme={theme}>
      <Header theme={theme}>{title}</Header>
      <Body theme={theme}>
        {formatText(displayText)}
      </Body>
    </Panel>
  );
};

export default AIHelpPanel;


