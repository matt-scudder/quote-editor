import React, { useEffect, useRef } from 'react';

interface BaseModalProps {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButtonInHeader?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({
  onClose,
  children,
  title,
  showCloseButtonInHeader = true,
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalContentRef}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg text-gray-900 dark:text-gray-100 transform transition-all`}
      >
        {title && (
          <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
            <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
            {showCloseButtonInHeader && (
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                onClick={onClose}
                aria-label="Close modal"
              >
                &times;
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
