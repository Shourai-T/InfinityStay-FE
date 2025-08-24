import React from "react";

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-midnight-900/70 z-50">
      <div className="bg-gradient-luxury rounded-2xl shadow-luxury w-[90%] max-w-[400px] h-[200px] flex flex-col justify-between p-6 animate-fade-in-up">
        {/* Message */}
        <p className="text-lg font-heading text-midnight-100">{message}</p>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-lavender-700 text-lavender-100 hover:bg-lavender-600 transition shadow"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-royal-600 text-white shadow-royal hover:bg-royal-500 transition"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
