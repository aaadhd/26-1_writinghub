import PropTypes from "prop-types";
import StepCircle from "./StepCircle.jsx";

const LessonCard = ({ lesson, onStepClick, onReportClick, hasDraft1Feedback }) => {
  const dimmed = lesson.reportAvailable;
  const steps = [
    {
      key: "outline",
      label: "Outline",
      status: lesson.outlineStatus,
      hasFeedback: false,
    },
    {
      key: "draft1",
      label: "1st Draft",
      status: lesson.draft1Status,
      hasFeedback: false,
    },
    {
      key: "draft2",
      label: "2nd Draft",
      status: lesson.draft2Status,
      hasFeedback: hasDraft1Feedback || false, // 1st Draft 피드백 완료 시에만 표시
    },
  ];

  return (
    <div className={`lesson-card ${dimmed ? "report-ready" : ""}`}>
      {dimmed && (
        <div className="lesson-badge">
          <img src="/button/prize.png" alt="Prize" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      )}

      <div className="lesson-header">
        <div>
          <p className="lesson-label">{lesson.title}</p>
          <p className="lesson-subtitle">{lesson.subtitle}</p>
        </div>
      </div>

      <div className="lesson-steps-container">
        <div className={`lesson-steps ${dimmed ? "dimmed" : ""}`}>
          {steps.map((step) => (
            <StepCircle
              key={step.key}
              label={step.label}
              status={step.status}
              onClick={() => onStepClick(lesson, step.key, step.status)}
              disabled={step.status === "locked" || dimmed}
              hasFeedback={step.hasFeedback}
            />
          ))}
        </div>
        {dimmed && (
          <button
            className="report-overlay-btn"
            onClick={() => onReportClick(lesson)}
          >
            <img src="/button/report.png" alt="Report" className="report-overlay-img" />
          </button>
        )}
      </div>
    </div>
  );
};

LessonCard.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    outlineStatus: PropTypes.string.isRequired,
    draft1Status: PropTypes.string.isRequired,
    draft2Status: PropTypes.string.isRequired,
    reportAvailable: PropTypes.bool,
  }).isRequired,
  onStepClick: PropTypes.func.isRequired,
  onReportClick: PropTypes.func.isRequired,
  hasDraft1Feedback: PropTypes.bool,
};

export default LessonCard;
