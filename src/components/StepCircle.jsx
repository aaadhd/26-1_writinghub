import React from "react";

export default function StepCircle({
  status = "available",
  label,
  onClick,
  disabled = false,
  hasFeedback = false,
}) {
  const stateClass = {
    locked: "step-locked",
    available: "step-available",
    saved: "step-saved",
    rejected: "step-rejected",
    completed: "step-completed",
  }[status] || "step-available";

  const isDisabled = disabled || status === "locked";
  // 2nd Draft에 피드백 받았을 때 색상 구분을 위한 클래스
  const feedbackClass = hasFeedback && status === "available" ? "step-has-feedback" : "";

  return (
    <button
      type="button"
      className={`step-circle-wrapper ${isDisabled ? "step-disabled" : ""}`}
      onClick={() => !isDisabled && onClick?.()}
    >
      <div className={`step-circle ${stateClass} ${feedbackClass}`}>
        <StatusIcon status={status} hasFeedback={hasFeedback} />
      </div>
      <span className="step-circle-label">{label}</span>
    </button>
  );
}

function StatusIcon({ status, hasFeedback }) {
  const iconClass = "step-circle-img";

  // 2nd Draft 버튼: 피드백 받았을 때도 start 버튼 사용 (색상으로 구분)
  // 2nd Draft completed일 때는 report 버튼 표시 (레포트 생성)
  if (status === "completed" && hasFeedback) {
    // 2nd Draft 완료되고 피드백 받았을 때 레포트 버튼
    return <img src="/button/report.png" alt="Report Available" className={iconClass} />;
  }

  switch (status) {
    case "available":
      // 피드백 받았든 안 받았든 start 버튼 사용 (색상으로 구분)
      return <img src="/button/start.png" alt="Start" className={iconClass} />;
    case "saved":
      return <img src="/button/saved.png" alt="Saved" className={iconClass} />;
    case "rejected":
      return <img src="/button/rejected.png" alt="Rejected" className={iconClass} />;
    case "completed":
      return <img src="/button/completed.png" alt="Completed" className={iconClass} />;
    case "locked":
    default:
      return (
        <svg className="step-circle-svg" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="#999" opacity="0.5" />
        </svg>
      );
  }
}

