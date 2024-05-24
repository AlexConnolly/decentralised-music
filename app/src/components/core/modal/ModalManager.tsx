import { useState, useCallback } from 'react';

interface Modal {
  title: string;
  content: React.ReactNode;
  button?: {
    text: string;
    onClick: () => void;
  };
}

export const useModalManager = () => {
  const [modals, setModals] = useState<Modal[]>([]);

  const setCurrentModal = useCallback((modal: Modal) => {
    setModals((prevModals) => [modal, ...prevModals]);
  }, []);

  const closeCurrentModal = useCallback(() => {
    setModals((prevModals) => prevModals.slice(1));
  }, []);

  const currentModal = modals.length > 0 ? modals[0] : null;

  return {
    currentModal,
    setCurrentModal,
    closeCurrentModal,
  };
};
