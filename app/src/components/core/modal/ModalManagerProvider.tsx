import React, { createContext, useContext } from 'react';
import { useModalManager } from './ModalManager';
import Modal from './Modal';

const ModalManagerContext = createContext<ReturnType<typeof useModalManager> | undefined>(undefined);

function ModalManagerProvider({ children }: { children: React.ReactNode }) {
  const modalManager = useModalManager();

  return (
    <ModalManagerContext.Provider value={modalManager}>
      {children}
      {modalManager.currentModal && (
        <Modal
          title={modalManager.currentModal.title}
          content={modalManager.currentModal.content}
          closeModal={modalManager.closeCurrentModal}
          button={modalManager.currentModal.button}
        />
      )}
    </ModalManagerContext.Provider>
  );
}

function useModal() {
  const context = useContext(ModalManagerContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalManagerProvider');
  }
  return context;
}

export { ModalManagerProvider, useModal };
