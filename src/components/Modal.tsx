import React, { useContext } from 'react';
import { Backdrop, Fade, IconButton, Modal as MuiModal, Theme, Typography, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  open?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onClose?: () => void;
}

interface ModalHeaderProps {
  closeButton?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

const ModalContext = React.createContext<{ onClose?: () => void }>({});

const StyledModal = styled(MuiModal)<{ muitheme: Theme }>`
  .contents {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${({ muitheme }) => muitheme.palette.background.paper};
    box-shadow: 3px 3px 3px 3px #333;
  }
`;

const ModalHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 0 10px;
`;

const ModalBody = styled.div`
  padding: 10px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px 10px 10px;
  gap: 10px;
`;

const Modal = ({ open = false, className, style, children, onClose }: ModalProps) => {
  const theme = useTheme();

  return (
    <ModalContext.Provider value={{ onClose }}>
      <StyledModal
        open={open}
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
        muitheme={theme}
      >
        <Fade in={open}>
          <div className={['contents', className].filter(Boolean).join(' ')} style={style}>
            {children}
          </div>
        </Fade>
      </StyledModal>
    </ModalContext.Provider>
  );
};

const ModalHeader = ({ closeButton = true, children }: ModalHeaderProps) => {
  const { onClose } = useContext(ModalContext);

  return (
    <ModalHeaderContainer>
      {children}
      {closeButton && (
        <IconButton onClick={() => onClose?.()}>
          <CloseIcon />
        </IconButton>
      )}
    </ModalHeaderContainer>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
