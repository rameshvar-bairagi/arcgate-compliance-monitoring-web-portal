'use client';

import React from 'react';
import Button from "@/components/ui/Button";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  size?: 'sm' | "md" | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  isOpen,
  onClose,
  onSave,
  size = 'xl',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      role="dialog"
    >
      {/* Add modal-dialog-scrollable */}
      <div className={`modal-dialog modal-${size} modal-dialog-scrollable`}>
        <div className="modal-content">
          
          {/* Header stays fixed */}
          <div className="modal-header">
            <h4 className="modal-title">{title}</h4>
            <Button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Close"
              variant="primary"
            >
              <span aria-hidden="true">&times;</span>
            </Button>
          </div>

          {/* Scrollable body */}
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {children}
          </div>

          {/* Footer stays fixed */}
          <div className="modal-footer justify-content-between">
            <button type="button" className="btn btn-default" onClick={onClose}>
              Close
            </button>
            {onSave && (
              <button type="button" className="btn btn-primary" onClick={onSave}>
                Save changes
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Modal;
