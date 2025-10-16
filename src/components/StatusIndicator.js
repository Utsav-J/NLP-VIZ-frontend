import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.surfaceSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => 
    props.status === 'connected' ? props.theme.colors.success :
    props.status === 'connecting' ? props.theme.colors.warning :
    props.theme.colors.error
  };
  animation: ${props => props.status === 'connecting' ? 'pulse 1.5s infinite' : 'none'};

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const StatusText = styled.span`
  color: ${props => 
    props.status === 'connected' ? props.theme.colors.success :
    props.status === 'connecting' ? props.theme.colors.warning :
    props.theme.colors.error
  };
`;

const StatusIndicator = () => {
  const { theme } = useTheme();
  const [status, setStatus] = useState('connecting');
  const [lastChecked, setLastChecked] = useState(null);

  const checkStatus = async () => {
    try {
      await apiService.healthCheck();
      setStatus('connected');
      setLastChecked(new Date());
    } catch (error) {
      setStatus('disconnected');
    }
  };

  useEffect(() => {
    // Check immediately
    checkStatus();
    
    // Then check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Backend Online';
      case 'connecting':
        return 'Checking...';
      case 'disconnected':
        return 'Backend Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <StatusContainer theme={theme}>
      <StatusDot theme={theme} status={status} />
      <StatusText theme={theme} status={status}>
        {getStatusText()}
      </StatusText>
    </StatusContainer>
  );
};

export default StatusIndicator;
