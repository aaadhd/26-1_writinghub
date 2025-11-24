import PropTypes from "prop-types";
import Modal from "./Modal.jsx";

const statusCopy = {
  saved: "Saved",
  completed: "Submitted",
  available: "Available",
  rejected: "Rejected",
};

const DraftPreviewModal = ({
  isOpen,
  onClose,
  lessonTitle,
  stepLabel,
  status,
  content,
  readOnly = false,
  onEdit,
}) => {
  const actions = readOnly || !onEdit ? [] : [
      {
        label: "계속 편집",
        onClick: () => {
          onClose();
          onEdit();
        },
        variant: "primary",
      },
    ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${lessonTitle} · ${stepLabel}`}
      actions={actions}
    >
      <div className="preview-status">Status: {statusCopy[status] || status}</div>
      {content ? (
        <div className="preview-content">
          <h4>{content.title || "Untitled"}</h4>
          <p>{content.body || "내용이 없습니다."}</p>
        </div>
      ) : (
        <p>아직 저장된 내용이 없습니다.</p>
      )}
      {readOnly && <p className="preview-readonly">리포트 완료 상태로 읽기 전용입니다.</p>}
    </Modal>
  );
};

DraftPreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lessonTitle: PropTypes.string.isRequired,
  stepLabel: PropTypes.string.isRequired,
  status: PropTypes.string,
  content: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
  }),
  readOnly: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default DraftPreviewModal;


