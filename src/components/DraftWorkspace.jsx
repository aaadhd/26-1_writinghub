import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const DraftWorkspace = ({
  lesson,
  step,
  draft1,
  draft2,
  teacherFeedback,
  draft1Submitted,
  draft2Submitted,
  onBack,
  onSaveDraft1,
  onSubmitDraft1,
  onSaveDraft2,
  onSubmitDraft2,
  onRejectDraft2,
}) => {
  const [draft1Title, setDraft1Title] = useState(draft1?.title || "");
  const [draft1Body, setDraft1Body] = useState(draft1?.body || "");
  const [draft2Title, setDraft2Title] = useState(draft2?.title || "");
  const [draft2Body, setDraft2Body] = useState(draft2?.body || "");

  useEffect(() => {
    setDraft1Title(draft1?.title || "");
    setDraft1Body(draft1?.body || "");
  }, [draft1, lesson?.id]);

  useEffect(() => {
    // draft2가 이미 저장되어 있으면 기존 내용 유지 (피드백 도착 시에도 유지)
    // draft2가 없거나 lesson이 변경된 경우에만 초기화
    if (draft2?.title || draft2?.body) {
      setDraft2Title(draft2.title || "");
      setDraft2Body(draft2.body || "");
    } else if (!draft2) {
      // draft2가 없을 때만 초기화
      setDraft2Title("");
      setDraft2Body("");
    }
  }, [draft2, lesson?.id]);

  // Save와 Submit 모두 본문 10자 이상일 때 활성화
  const canSaveDraft1 = draft1Body.trim().length >= 10;
  const canSubmitDraft1 = draft1Body.trim().length >= 10;
  const canSaveDraft2 = draft2Body.trim().length >= 10;
  const canSubmitDraft2 = draft2Body.trim().length >= 10;

  const hasDraft2Progress = useMemo(
    () => Boolean(draft2?.body?.trim()),
    [draft2]
  );

  if (!lesson) {
    return (
      <div className="workspace-empty">
        <p>선택된 레슨이 없습니다.</p>
        <button type="button" onClick={onBack}>
          돌아가기
        </button>
      </div>
    );
  }

  const handleSaveDraft1 = () => {
    onSaveDraft1({
      title: draft1Title,
      body: draft1Body,
    });
    alert("저장되었습니다.");
    onBack();
  };

  const handleSubmitDraft1 = () => {
    onSubmitDraft1({
      title: draft1Title,
      body: draft1Body,
    });
    // finalizeDraft1Submit에서 처리되므로 여기서는 alert만 표시하지 않음
    // StudentApp의 finalizeDraft1Submit에서 alert와 onBack 처리
  };

  const handleSaveDraft2 = () => {
    onSaveDraft2({
      title: draft2Title,
      body: draft2Body,
    });
    alert("저장되었습니다.");
    onBack();
  };

  const handleSubmitDraft2 = () => {
    onSubmitDraft2({
      title: draft2Title,
      body: draft2Body,
    });
    // StudentApp의 handleSubmitDraft2에서 alert와 onBack 처리
  };

  const isDraft1Submitted = draft1Submitted === "true";
  const isDraft2Submitted = draft2Submitted === "true";

  // rejected 상태일 때는 수정 가능
  const isDraft1Locked = isDraft1Submitted && lesson.draft1Status !== "rejected";
  const isDraft2Locked = isDraft2Submitted && lesson.draft2Status !== "rejected";

  // 2nd Draft 제출 시 1st Draft는 읽기 전용 (1st Draft가 completed면 절대 수정 불가)
  const is1stDraftLockedBySubmission =
    lesson.draft2Status === "completed" &&
    draft2Submitted === "true";

  const renderFirstDraft = () => {
    // 메시지 우선순위: rejected > 2nd Draft 제출 후 읽기 전용 > 일반 제출됨
    const showRejectedMessage = lesson.draft1Status === "rejected";
    const showLockedBySubmissionMessage = !showRejectedMessage && is1stDraftLockedBySubmission;
    const showRegularLockedMessage = !showRejectedMessage && !showLockedBySubmissionMessage && isDraft1Locked;

    return (
      <div className="workspace-card">
        <h3>1st Draft</h3>
        {showRejectedMessage && (
          <p style={{ color: "#f05252", fontSize: "14px", marginBottom: "12px" }}>
            선생님이 수정을 요청했습니다. 다시 작성해주세요.
          </p>
        )}
        {showLockedBySubmissionMessage && (
          <div style={{
            background: "#e3f2fd",
            border: "2px solid #1976d2",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "16px"
          }}>
            <strong style={{ color: "#1565c0", fontSize: "15px" }}>
              📌 2nd Draft를 이미 제출했습니다
            </strong>
            <p style={{ marginTop: "8px", marginBottom: "0", fontSize: "14px", color: "#424242" }}>
              1st Draft는 읽기 전용입니다. 수정이 필요한 경우 선생님께 문의하세요.
            </p>
          </div>
        )}
        {showRegularLockedMessage && (
          <p style={{ color: "#7a849f", fontSize: "14px", marginBottom: "12px" }}>
            제출된 Draft입니다. 수정할 수 없습니다.
          </p>
        )}
      <label>
        Title
        <input
          value={draft1Title}
          onChange={(e) => setDraft1Title(e.target.value)}
          placeholder="Draft title"
          disabled={isDraft1Locked || is1stDraftLockedBySubmission}
        />
      </label>
      <label>
        Body
        <textarea
          value={draft1Body}
          onChange={(e) => setDraft1Body(e.target.value)}
          placeholder="Write at least 20 characters..."
          rows={10}
          disabled={isDraft1Locked || is1stDraftLockedBySubmission}
        />
      </label>
      <div className="workspace-actions">
        <button
          type="button"
          onClick={handleSaveDraft1}
          disabled={!canSaveDraft1 || isDraft1Locked || is1stDraftLockedBySubmission}
        >
          Save 1st Draft
        </button>
        <button
          type="button"
          onClick={handleSubmitDraft1}
          disabled={!canSubmitDraft1 || isDraft1Locked || is1stDraftLockedBySubmission}
          className="primary"
        >
          Submit 1st Draft
        </button>
      </div>
    </div>
    );
  };

  const renderSecondDraft = () => (
    <div className="workspace-grid">
      <div className="workspace-column">
        <div className="workspace-card">
          <h4>1st Draft (Reference)</h4>
          {draft1?.body ? (
            <>
              <strong>{draft1.title || "Untitled"}</strong>
              <p style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{draft1.body}</p>
            </>
          ) : (
            <p style={{ color: '#999' }}>No 1st Draft available</p>
          )}
        </div>
        <div className="workspace-card">
          <h4>Teacher Feedback</h4>
          {teacherFeedback?.text ? (
            <p style={{ whiteSpace: 'pre-wrap' }}>{teacherFeedback.text}</p>
          ) : (
            <p style={{ color: '#999' }}>No feedback yet</p>
          )}
        </div>
      </div>

      <div className="workspace-column">
        <div className="workspace-card">
          <h3>2nd Draft</h3>

          {/* 피드백 도착 안내 (1st Draft 피드백이 있고 2nd Draft가 available일 때) */}
          {teacherFeedback?.text && lesson.draft2Status === "available" && (
            <div style={{
              background: "#e8f5e9",
              border: "2px solid #4caf50",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "16px"
            }}>
              <strong style={{ color: "#2e7d32", fontSize: "15px" }}>
                ✅ 1st Draft 피드백이 도착했습니다
              </strong>
              <p style={{ marginTop: "8px", marginBottom: "0", fontSize: "14px", color: "#424242" }}>
                왼쪽의 Teacher Feedback을 참고하여 2nd Draft를 작성하세요.
              </p>
            </div>
          )}

          {isDraft2Locked && (
            <p style={{ color: "#7a849f", fontSize: "14px", marginBottom: "12px" }}>
              제출된 Draft입니다. 수정할 수 없습니다.
            </p>
          )}
          {lesson.draft2Status === "rejected" && (
            <p style={{ color: "#f05252", fontSize: "14px", marginBottom: "12px" }}>
              선생님이 수정을 요청했습니다. 다시 작성해주세요.
            </p>
          )}

          {/* Quick Action Buttons */}
          {draft1?.body && !isDraft2Locked && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              background: '#f8f9fa',
              borderRadius: '8px',
              display: 'flex',
              gap: '8px'
            }}>
              <button
                type="button"
                onClick={() => {
                  setDraft2Title('');
                  setDraft2Body('');
                }}
                disabled={isDraft2Locked}
                style={{
                  padding: '8px 16px',
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: isDraft2Locked ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  opacity: isDraft2Locked ? 0.5 : 1
                }}
              >
                📄 Fresh Page
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft2Title(draft1Title);
                  setDraft2Body(draft1Body);
                }}
                disabled={isDraft2Locked}
                style={{
                  padding: '8px 16px',
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: isDraft2Locked ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  opacity: isDraft2Locked ? 0.5 : 1
                }}
              >
                ✏️ Revise 1st Draft
              </button>
            </div>
          )}

          <label>
            Title
            <input
              value={draft2Title}
              onChange={(e) => setDraft2Title(e.target.value)}
              placeholder="Draft title"
              disabled={isDraft2Locked}
            />
          </label>
          <label>
            Body
            <textarea
              value={draft2Body}
              onChange={(e) => setDraft2Body(e.target.value)}
              placeholder={draft1?.body ? "Revise based on feedback or start fresh..." : "Write your 2nd draft..."}
              rows={10}
              disabled={isDraft2Locked}
            />
          </label>
          <div className="workspace-actions">
            <button
              type="button"
              onClick={handleSaveDraft2}
              disabled={!canSaveDraft2 || isDraft2Locked}
            >
              Save 2nd Draft
            </button>
            <button
              type="button"
              className="primary"
              onClick={handleSubmitDraft2}
              disabled={!canSubmitDraft2 || isDraft2Locked}
            >
              Submit 2nd Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="workspace-shell">
      <button type="button" className="back-btn" onClick={onBack}>
        ← Writing Activity
      </button>
      <div className="workspace-header">
        <div>
          <p className="workspace-pill">{lesson.subtitle}</p>
          <h2>
            {lesson.title} · {step === "draft1" ? "1st Draft" : "2nd Draft"}
          </h2>
        </div>
      </div>
      {step === "draft1" ? renderFirstDraft() : renderSecondDraft()}
    </div>
  );
};

DraftWorkspace.propTypes = {
  lesson: PropTypes.object,
  step: PropTypes.oneOf(["draft1", "draft2"]).isRequired,
  draft1: PropTypes.object,
  draft2: PropTypes.object,
  teacherFeedback: PropTypes.object,
  draft1Submitted: PropTypes.string,
  draft2Submitted: PropTypes.string,
  onBack: PropTypes.func.isRequired,
  onSaveDraft1: PropTypes.func.isRequired,
  onSubmitDraft1: PropTypes.func.isRequired,
  onSaveDraft2: PropTypes.func.isRequired,
  onSubmitDraft2: PropTypes.func.isRequired,
  onRejectDraft2: PropTypes.func,
};

export default DraftWorkspace;

