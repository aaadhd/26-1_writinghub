import PropTypes from "prop-types";
import LessonCard from "./LessonCard.jsx";

const menuItems = ["Writing Activity", "Progress", "Report", "Portfolio"];

const WritingActivity = ({ lessons, onStepClick, onReportClick, teacherFeedbackMap, onResetLesson }) => {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo-circle">
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            Writing<br />Hub
          </div>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item}
              className={`sidebar-item ${
                item === "Writing Activity" ? "active" : ""
              }`}
              type="button"
            >
              <span style={{ fontSize: '20px', marginRight: '4px' }}>
                {item === "Writing Activity" ? "✏️" :
                 item === "Progress" ? "🔄" :
                 item === "Report" ? "📊" : "📁"}
              </span>
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="activity-main">
        <header className="activity-header">
          <div className="user-badge">
            <span>Aria</span>
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>👤</span>
            <span style={{ fontSize: '10px', opacity: 0.7 }}>MAG?</span>
          </div>
          <p className="activity-pill">📖 Essay Engineers: Technician</p>
          <h1>Writing Activity</h1>
          <p className="activity-subtitle">Language Composition</p>
          <p className="activity-subtitle">* Select an activity to begin.</p>
        </header>

        <section className="lesson-row">
          {lessons.map((lesson) => {
            // 1st Draft 피드백 상태 확인 (2nd Draft 버튼 UI에 사용)
            const feedbackKey = `${lesson.id}_draft1`;
            const hasFeedback = Boolean(teacherFeedbackMap?.[feedbackKey]);
            // 1st Draft 피드백 완료 시 2nd Draft 버튼 색상 구분 (피드백 완료 여부와 상관없이 2nd Draft 작성 가능)
            // 2nd Draft completed일 때는 레포트 버튼 표시
            const hasDraft1Feedback = hasFeedback && (lesson.draft2Status === "available" || lesson.draft2Status === "completed");

            return (
              <div key={lesson.id} style={{ position: 'relative' }}>
                <LessonCard
                  lesson={lesson}
                  onStepClick={onStepClick}
                  onReportClick={onReportClick}
                  hasDraft1Feedback={hasDraft1Feedback}
                />
                {onResetLesson && (
                  <button
                    type="button"
                    onClick={() => onResetLesson(lesson.id)}
                    style={{
                      marginTop: '12px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      backgroundColor: '#f05252',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      width: '100%',
                      fontWeight: '500',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#d43f3f'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f05252'}
                  >
                    Reset
                  </button>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

WritingActivity.propTypes = {
  lessons: PropTypes.arrayOf(PropTypes.object).isRequired,
  onStepClick: PropTypes.func.isRequired,
  onReportClick: PropTypes.func.isRequired,
  teacherFeedbackMap: PropTypes.object,
  onResetLesson: PropTypes.func,
};

export default WritingActivity;

