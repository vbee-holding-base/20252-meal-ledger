import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
  warningMessage?: string | undefined;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  name,
  warningMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-margin-mobile">
      <div className="modal-overlay absolute inset-0" onClick={onClose} />
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-[24px] p-md relative shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">
              warning
            </span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Bạn có chắc muốn xóa?
          </h3>
          <p className="text-body-md text-on-surface-variant">
            Xóa <strong>{name}</strong> khỏi nhóm.
          </p>
          {warningMessage && (
            <div className="flex items-start gap-3 p-3 bg-error-container/30 rounded-xl text-error text-left w-full">
              <span className="material-symbols-outlined text-sm">info</span>
              <p className="text-label-sm font-label-sm">{warningMessage}</p>
            </div>
          )}
          <div className="flex flex-col w-full gap-3 mt-4">
            <button
              className="w-full h-12 rounded-full bg-error text-on-error font-bold active:scale-95 transition-transform"
              onClick={onConfirm}
            >
              Xóa
            </button>
            <button
              className="w-full h-12 rounded-full text-on-surface-variant font-bold active:scale-95 transition-transform"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
