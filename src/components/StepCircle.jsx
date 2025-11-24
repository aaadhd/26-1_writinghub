// src/components/StepCircle.jsx
import React from "react";
import "../styles.css";

export default function StepCircle({
  status = "available",  // 🔥 default = available (파란 진입 가능)
  label,
  onClick,
  disabled = false,
  hasFeedback = false,  // 피드백 도착 여부
}) {
  const stateClass = {
    locked: "step-locked",
    available: "step-available",     // 파란 진입 버튼
    saved: "step-saved",             // 노란 디스크
    rejected: "step-rejected",       // 빨간 다시하기
    completed: "step-completed",     // 초록 체크
  }[status] || "step-available";

  const isDisabled = disabled || status === "locked";

  return (
    <button
      type="button"
      className={`step-circle-wrapper ${isDisabled ? "step-disabled" : ""}`}
      onClick={() => !isDisabled && onClick?.()}
    >
      <div className={`step-circle ${stateClass}`}>
        <StatusIcon status={status} hasFeedback={hasFeedback} />
      </div>
      <span className="step-circle-label">{label}</span>
    </button>
  );
}

function StatusIcon({ status, hasFeedback }) {
  const iconClass = "step-circle-img";

  // 피드백 도착 시 report.png 아이콘 표시 (available 상태에서만)
  if (hasFeedback && status === "available") {
    return <img src="/button/report.png" alt="Feedback Available" className={iconClass} />;
  }

  switch (status) {
    case "available": // 파란 진입 가능
      return <img src="/button/start.png" alt="Start" className={iconClass} />;

    case "saved": // 노란 저장됨
      return <img src="/button/saved.png" alt="Saved" className={iconClass} />;

    case "rejected": // 빨간 다시하기
      return <img src="/button/rejected.png" alt="Rejected" className={iconClass} />;

    case "completed": // 초록 완료
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

