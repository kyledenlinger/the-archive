import { useRef } from 'react';
import { Dialog } from './Dialog';

/** A yes/no question. Focus starts on the safe answer (cancel). */
export function ConfirmDialog({
  open,
  question,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  question: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog open={open} onClose={onCancel} labelledBy="confirm-question" role="alertdialog" variant="center" initialFocus={cancelRef}>
      <p id="confirm-question" className="font-serif text-xl text-amber-100 leading-relaxed mb-8">
        {question}
      </p>
      <div className="flex flex-wrap gap-4 justify-end">
        <button
          type="button"
          onClick={onConfirm}
          className="px-6 py-3 rounded-full border border-amber-900/50 text-amber-300 font-serif hover:bg-amber-900/20 transition-colors"
        >
          {confirmLabel}
        </button>
        <button
          ref={cancelRef}
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-full bg-amber-900 text-amber-100 border border-amber-700/50 font-serif hover:bg-amber-800 transition-colors"
        >
          {cancelLabel}
        </button>
      </div>
    </Dialog>
  );
}
