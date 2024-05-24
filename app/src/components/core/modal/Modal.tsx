import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  title: string;
  content: React.ReactNode;
  closeModal: () => void;
  button?: {
    text: string;
    onClick: () => void;
  };
}

function Modal({ title, content, closeModal, button }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  return createPortal(
    <div className="absolute top-0 left-0  inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-80 max-w-full p-4" ref={modalRef}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="mb-4">
          {content}
        </div>
        <div className="flex justify-end space-x-2">
          {button && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              onClick={button.onClick}
            >
              {button.text}
            </button>
          )}
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
