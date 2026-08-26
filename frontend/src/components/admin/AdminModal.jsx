/** Bottom-sheet on mobile, centered dialog on desktop. */
export default function AdminModal({ children, className = '', wide = false, onBackdropClick }) {
  return (
    <div
      className="modal-overlay"
      onClick={onBackdropClick}
      role="presentation"
    >
      <div
        className={`modal-panel space-y-4 ${wide ? 'max-w-2xl' : 'max-w-lg'} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
