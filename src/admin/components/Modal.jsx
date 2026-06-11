export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        <header className="admin-modal-header">
          <h2 id="admin-modal-title">{title}</h2>
          <button onClick={onClose} aria-label="Close modal">✕</button>
        </header>
        <div className="admin-modal-body">{children}</div>
        {footer && <footer className="admin-modal-footer">{footer}</footer>}
      </div>
    </div>
  );
}
