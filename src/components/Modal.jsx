import PropTypes from "prop-types";

const Modal = ({ isOpen, title, children, onClose, actions = [] }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {actions.length > 0 && (
          <div className="modal-actions">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`modal-btn ${action.variant || "primary"}`}
                disabled={action.disabled}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.oneOf(["primary", "secondary", "danger"]),
    })
  ),
};

export default Modal;

