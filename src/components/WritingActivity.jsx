import PropTypes from "prop-types";
import LessonCard from "./LessonCard.jsx";

const menuItems = ["Writing Activity", "Progress", "Report", "Portfolio"];

const WritingActivity = ({ lessons, onStepClick, onReportClick, teacherFeedbackMap }) => {
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
            // 1st Draft 피드백이 있고, 2nd Draft가 available이면 피드백 도착 표시
            const feedbackKey = `${lesson.id}_draft1`;
            const hasFeedback = Boolean(teacherFeedbackMap?.[feedbackKey]);
            const hasDraft1Feedback = hasFeedback && lesson.draft2Status === "available";

            console.log(`Lesson ${lesson.id}:`, {
              feedbackKey,
              hasFeedback,
              draft2Status: lesson.draft2Status,
              hasDraft1Feedback,
              teacherFeedbackMap
            });

            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onStepClick={onStepClick}
                onReportClick={onReportClick}
                hasDraft1Feedback={hasDraft1Feedback}
              />
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
};

export default WritingActivity;


