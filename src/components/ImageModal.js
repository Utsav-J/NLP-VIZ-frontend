import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  overflow: auto;
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.lg};

  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10000;
  line-height: 1;

  &:hover {
    background: ${props => props.theme.colors.error}dd;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  padding-right: 3rem;
`;

const ImageModal = ({ isOpen, onClose, title, children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent theme={theme} onClick={(e) => e.stopPropagation()}>
        <CloseButton theme={theme} onClick={onClose} title="Close (Esc)">
          ×
        </CloseButton>
        {title && <Title theme={theme}>{title}</Title>}
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ImageModal;

