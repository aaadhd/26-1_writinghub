import { useEffect, useState, useMemo, useCallback } from "react";
import {
  loadLessons,
  saveLessons,
  loadDraftMap,
  loadSubmittedMap,
  loadTeacherFeedback,
  saveTeacherFeedback,
  loadFeedbackSubmitted,
  saveFeedbackSubmitted,
  loadDraftEvaluated,
  saveDraftEvaluated,
} from "./storage.js";
import Modal from "./components/Modal.jsx";
import "./styles.css";

const initialLessons = [
  {
    id: 1,
    title: "Lesson 1",
    subtitle: "Persuasive Essays",
    outlineStatus: "completed",
    draft1Status: "available",
    draft2Status: "available",
    reportAvailable: false,
  },
  {
    id: 2,
    title: "Lesson 2",
    subtitle: "Personal Narrative",
    outlineStatus: "completed",
    draft1Status: "available",
    draft2Status: "available",
    reportAvailable: false,
  },
  {
    id: 3,
    title: "Lesson 3",
    subtitle: "Opinion Letters",
    outlineStatus: "available",
    draft1Status: "available",
    draft2Status: "available",
    reportAvailable: false,
  },
  {
    id: 4,
    title: "Lesson 4",
    subtitle: "Compare & Contrast",
    outlineStatus: "available",
    draft1Status: "available",
    draft2Status: "available",
    reportAvailable: false,
  },
  {
    id: 5,
    title: "Lesson 5",
    subtitle: "Informational Essays",
    outlineStatus: "available",
    draft1Status: "available",
    draft2Status: "available",
    reportAvailable: false,
  },
  {
    id: 6,
    title: "Lesson 6",
    subtitle: "Research Writing",
    outlineStatus: "available",
    draft1Status: "available",
    draft2Status: "available",
    reportAvailable: false,
  },
];

const TeacherApp = () => {
  const [lessons, setLessons] = useState(() => loadLessons(initialLessons));
  const [draft1Map, setDraft1Map] = useState(() => loadDraftMap("draft1"));
  const [draft2Map, setDraft2Map] = useState(() => loadDraftMap("draft2"));
  const [draft1SubmittedMap, setDraft1SubmittedMap] = useState(() =>
    loadSubmittedMap("draft1Submitted")
  );
  const [draft2SubmittedMap, setDraft2SubmittedMap] = useState(() =>
    loadSubmittedMap("draft2Submitted")
  );
  const [teacherFeedbackMap, setTeacherFeedbackMap] = useState(() =>
    loadTeacherFeedback()
  );
  const [feedbackSubmittedMap, setFeedbackSubmittedMap] = useState(() =>
    loadFeedbackSubmitted()
  );
  const [draftEvaluatedMap, setDraftEvaluatedMap] = useState(() =>
    loadDraftEvaluated()
  );
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedDraftType, setSelectedDraftType] = useState("draft1"); // "draft1" or "draft2"
  const [feedbackText, setFeedbackText] = useState("");

  // localStorage 변경 감지 (Student App에서 제출 시 자동 반영)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "draft1" || e.key === "draft1Submitted" || e.key === "draft2" || e.key === "draft2Submitted" || e.key === "draftEvaluated") {
        setDraft1Map(loadDraftMap("draft1"));
        setDraft2Map(loadDraftMap("draft2"));
        setDraft1SubmittedMap(loadSubmittedMap("draft1Submitted"));
        setDraft2SubmittedMap(loadSubmittedMap("draft2Submitted"));
        setDraftEvaluatedMap(loadDraftEvaluated());
        setLessons(loadLessons(initialLessons));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    // 같은 탭에서도 감지하기 위해 주기적 체크 (1초마다)
    const interval = setInterval(() => {
      const newDraft1Map = loadDraftMap("draft1");
      const newDraft2Map = loadDraftMap("draft2");
      const newDraft1SubmittedMap = loadSubmittedMap("draft1Submitted");
      const newDraft2SubmittedMap = loadSubmittedMap("draft2Submitted");
      const newDraftEvaluatedMap = loadDraftEvaluated();
      const newLessons = loadLessons(initialLessons);
      setDraft1Map((prev) => (JSON.stringify(prev) !== JSON.stringify(newDraft1Map) ? newDraft1Map : prev));
      setDraft2Map((prev) => (JSON.stringify(prev) !== JSON.stringify(newDraft2Map) ? newDraft2Map : prev));
      setDraft1SubmittedMap((prev) => (JSON.stringify(prev) !== JSON.stringify(newDraft1SubmittedMap) ? newDraft1SubmittedMap : prev));
      setDraft2SubmittedMap((prev) => (JSON.stringify(prev) !== JSON.stringify(newDraft2SubmittedMap) ? newDraft2SubmittedMap : prev));
      setDraftEvaluatedMap((prev) => (JSON.stringify(prev) !== JSON.stringify(newDraftEvaluatedMap) ? newDraftEvaluatedMap : prev));
      setLessons((prev) => (JSON.stringify(prev) !== JSON.stringify(newLessons) ? newLessons : prev));
    }, 1000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 제출된 Draft가 있는 레슨 필터링
  const submittedLessons = lessons.filter((lesson) => {
    const hasDraft1 = draft1SubmittedMap[lesson.id] === "true" && draft1Map[lesson.id] && draft1Map[lesson.id].body;
    const hasDraft2 = draft2SubmittedMap[lesson.id] === "true" && draft2Map[lesson.id] && draft2Map[lesson.id].body;
    return hasDraft1 || hasDraft2;
  });

  const updateLesson = (lessonId, updates) => {
    setLessons((prev) => {
      const updated = prev.map((lesson) => {
        if (lesson.id !== lessonId) return lesson;
        return { ...lesson, ...updates };
      });
      saveLessons(updated);
      return updated;
    });
  };

  const handleSelectLesson = (lesson, draftType = "draft1", e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedLesson(lesson);
    setSelectedDraftType(draftType);
    const feedbackKey = `${lesson.id}_${draftType}`;
    const existingFeedback = teacherFeedbackMap[feedbackKey];
    setFeedbackText(existingFeedback?.text || "");
  };

  const handleSaveFeedback = useCallback(() => {
    if (!selectedLesson) return;
    const feedbackKey = `${selectedLesson.id}_${selectedDraftType}`;
    const newFeedback = {
      lessonId: selectedLesson.id,
      text: feedbackText,
    };
    setTeacherFeedbackMap((prev) => {
      const updated = {
        ...prev,
        [feedbackKey]: newFeedback,
      };
      saveTeacherFeedback(updated);
      return updated;
    });
    alert("피드백이 저장되었습니다!");
  }, [selectedLesson, selectedDraftType, feedbackText]);

  const handleSubmitFeedback = useCallback(() => {
    if (!selectedLesson || !feedbackText.trim()) {
      alert("피드백을 입력해주세요.");
      return;
    }
    const feedbackKey = `${selectedLesson.id}_${selectedDraftType}`;
    const newFeedback = {
      lessonId: selectedLesson.id,
      text: feedbackText,
    };
    setTeacherFeedbackMap((prev) => {
      const updated = {
        ...prev,
        [feedbackKey]: newFeedback,
      };
      saveTeacherFeedback(updated);
      return updated;
    });
    // 피드백 제출 상태 저장
    setFeedbackSubmittedMap((prev) => {
      const updated = {
        ...prev,
        [feedbackKey]: "true",
      };
      saveFeedbackSubmitted(updated);
      return updated;
    });

    // 1st Draft 피드백 제출 시 평가 완료 상태 저장
    if (selectedDraftType === "draft1") {
      const evaluationKey = `${selectedLesson.id}_draft1`;
      setDraftEvaluatedMap((prev) => {
        const updated = { ...prev, [evaluationKey]: "feedback_submitted" };
        saveDraftEvaluated(updated);
        return updated;
      });
      updateLesson(selectedLesson.id, {
        draft2Status: "available",
      });
    }
    // 2nd Draft는 handleApproveDraft2에서 처리 (피드백 제출이 아닌 승인으로 리포트 생성)

    alert("피드백이 제출되었습니다! 학생 앱에서 확인할 수 있습니다.");
    setSelectedLesson(null);
    setFeedbackText("");
  }, [selectedLesson, selectedDraftType, feedbackText, updateLesson]);

  const handleRejectDraft = useCallback(() => {
    if (!selectedLesson) return;
    const confirmReject = window.confirm(
      `${selectedLesson.title}의 ${selectedDraftType === "draft1" ? "1st" : "2nd"} Draft를 거부하시겠습니까?`
    );
    if (!confirmReject) return;

    // 평가 완료 상태 저장
    const evaluationKey = `${selectedLesson.id}_${selectedDraftType}`;
    setDraftEvaluatedMap((prev) => {
      const updated = { ...prev, [evaluationKey]: "rejected" };
      saveDraftEvaluated(updated);
      return updated;
    });

    // 거부 시 상태 업데이트 및 즉시 저장
    setLessons((prev) => {
      const updated = prev.map((lesson) => {
        if (lesson.id !== selectedLesson.id) return lesson;
        if (selectedDraftType === "draft1") {
          return { ...lesson, draft1Status: "rejected", reportAvailable: false };
        } else {
          // 2nd Draft 거부 시 1st Draft도 수정 가능하도록 상태 변경
          // 1st Draft가 completed 상태라면 available로 변경하여 재작성 가능하게 함
          const newDraft1Status = lesson.draft1Status === "completed" ? "available" : lesson.draft1Status;
          return {
            ...lesson,
            draft1Status: newDraft1Status,
            draft2Status: "rejected",
            reportAvailable: false
          };
        }
      });
      // 즉시 localStorage에 저장
      saveLessons(updated);
      return updated;
    });

    alert("Draft가 거부되었습니다. 학생이 수정 후 재제출할 수 있습니다.");
    // 모달은 닫지 않고 버튼만 비활성화 (이미 draftEvaluatedMap 업데이트로 비활성화됨)
  }, [selectedLesson, selectedDraftType]);

  const handleApproveDraft2 = useCallback(() => {
    if (!selectedLesson) return;
    const confirmApprove = window.confirm(
      `${selectedLesson.title}의 2nd Draft를 승인하고 리포트를 생성하시겠습니까?`
    );
    if (!confirmApprove) return;

    // 2nd Draft 피드백 저장 (리포트에 표시될 최종 피드백)
    const feedbackKey = `${selectedLesson.id}_draft2`;
    if (feedbackText.trim()) {
      const newFeedback = {
        lessonId: selectedLesson.id,
        text: feedbackText,
      };
      setTeacherFeedbackMap((prev) => {
        const updated = {
          ...prev,
          [feedbackKey]: newFeedback,
        };
        saveTeacherFeedback(updated);
        return updated;
      });
    }

    // 평가 완료 상태 저장
    const evaluationKey = `${selectedLesson.id}_draft2`;
    setDraftEvaluatedMap((prev) => {
      const updated = { ...prev, [evaluationKey]: "approved" };
      saveDraftEvaluated(updated);
      return updated;
    });

    updateLesson(selectedLesson.id, {
      draft2Status: "completed",
      reportAvailable: true,
    });
    alert("2nd Draft가 승인되었습니다. 리포트가 생성되었습니다.");
    setSelectedLesson(null);
    setFeedbackText("");
  }, [selectedLesson, feedbackText, updateLesson]);

  return (
    <div className="app-shell">
      <div className="sidebar">
        <div className="logo-circle">Writing Hub</div>
        <nav className="sidebar-menu">
          <button className="sidebar-item active">Teacher Dashboard</button>
        </nav>
      </div>
      <div className="activity-main">
        <div className="activity-header">
          <p className="activity-pill">Teacher Portal</p>
          <h1>Draft Feedback</h1>
          <p className="activity-subtitle">
            제출된 Draft에 대한 피드백을 작성하거나 거부할 수 있습니다.
          </p>
        </div>

        {submittedLessons.length === 0 ? (
          <div style={{ marginTop: "48px", textAlign: "center" }}>
            <p style={{ color: "#7a849f", fontSize: "16px" }}>
              아직 제출된 1st Draft가 없습니다.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: "32px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {submittedLessons.map((lesson) => {
                const draft1 = draft1Map[lesson.id];
                const draft2 = draft2Map[lesson.id];
                const hasDraft1 = draft1SubmittedMap[lesson.id] === "true" && draft1?.body;
                const hasDraft2 = draft2SubmittedMap[lesson.id] === "true" && draft2?.body;
                const hasFeedback1 = Boolean(teacherFeedbackMap[`${lesson.id}_draft1`]);
                const hasFeedback2 = Boolean(teacherFeedbackMap[`${lesson.id}_draft2`]);
                return (
                  <div
                    key={lesson.id}
                    className="lesson-card"
                    style={{
                      cursor: "pointer",
                      border: selectedLesson?.id === lesson.id ? "2px solid #3e6cf4" : undefined,
                    }}
                  >
                    <div className="lesson-header">
                      <div>
                        <h3 className="lesson-label">{lesson.title}</h3>
                        <p className="lesson-subtitle">{lesson.subtitle}</p>
                      </div>
                      {(hasFeedback1 || hasFeedback2) && (
                        <span
                          style={{
                            background: "#2db67d",
                            color: "#fff",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          피드백 완료
                        </span>
                      )}
                    </div>
                    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      {hasDraft1 && (
                        <div
                          onClick={(e) => handleSelectLesson(lesson, "draft1", e)}
                          style={{
                            padding: "12px",
                            background: "#f5f7fb",
                            borderRadius: "8px",
                            cursor: "pointer",
                            border: selectedLesson?.id === lesson.id && selectedDraftType === "draft1" ? "2px solid #3e6cf4" : "1px solid #dfe3f3",
                          }}
                        >
                          <p style={{ fontWeight: 600, marginBottom: "4px", fontSize: "13px" }}>1st Draft</p>
                          <p style={{ fontWeight: 600, marginBottom: "4px", fontSize: "12px" }}>
                            {draft1.title || "Untitled"}
                          </p>
                          <p
                            style={{
                              color: "#6c7694",
                              fontSize: "12px",
                              lineHeight: "1.4",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {draft1.body}
                          </p>
                        </div>
                      )}
                      {hasDraft2 && (
                        <div
                          onClick={(e) => handleSelectLesson(lesson, "draft2", e)}
                          style={{
                            padding: "12px",
                            background: "#f5f7fb",
                            borderRadius: "8px",
                            cursor: "pointer",
                            border: selectedLesson?.id === lesson.id && selectedDraftType === "draft2" ? "2px solid #3e6cf4" : "1px solid #dfe3f3",
                          }}
                        >
                          <p style={{ fontWeight: 600, marginBottom: "4px", fontSize: "13px" }}>2nd Draft</p>
                          <p style={{ fontWeight: 600, marginBottom: "4px", fontSize: "12px" }}>
                            {draft2.title || "Untitled"}
                          </p>
                          <p
                            style={{
                              color: "#6c7694",
                              fontSize: "12px",
                              lineHeight: "1.4",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {draft2.body}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedLesson && (() => {
          const feedbackKey = `${selectedLesson.id}_${selectedDraftType}`;
          const evaluationKey = `${selectedLesson.id}_${selectedDraftType}`;
          const isSubmitted = feedbackSubmittedMap[feedbackKey] === "true";
          const isEvaluated = draftEvaluatedMap[evaluationKey] !== undefined;
          const isDraft2 = selectedDraftType === "draft2";
          const isDraft2Submitted = draft2SubmittedMap[selectedLesson.id] === "true";

          let actions;
          if (isDraft2 && isDraft2Submitted) {
            actions = [
              {
                label: "취소",
                onClick: () => {
                  setSelectedLesson(null);
                  setFeedbackText("");
                },
                variant: "secondary",
              },
              {
                label: "거부",
                onClick: handleRejectDraft,
                variant: "danger",
                disabled: isEvaluated,
              },
              {
                label: "승인 (리포트 생성)",
                onClick: handleApproveDraft2,
                variant: "primary",
                disabled: isEvaluated,
              },
            ];
          } else {
            actions = [
              {
                label: "취소",
                onClick: () => {
                  setSelectedLesson(null);
                  setFeedbackText("");
                },
                variant: "secondary",
              },
              {
                label: "거부",
                onClick: handleRejectDraft,
                variant: "danger",
                disabled: isSubmitted || isEvaluated,
              },
              {
                label: "저장",
                onClick: handleSaveFeedback,
                variant: "secondary",
                disabled: isSubmitted || isEvaluated,
              },
              {
                label: "제출",
                onClick: handleSubmitFeedback,
                variant: "primary",
                disabled: isSubmitted || isEvaluated,
              },
            ];
          }

          return (
            <Modal
              isOpen={true}
              onClose={() => {
                setSelectedLesson(null);
                setFeedbackText("");
              }}
              title={`${selectedLesson.title} - ${selectedDraftType === "draft1" ? "1st" : "2nd"} Draft Feedback`}
              actions={actions}
            >
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ marginBottom: "12px" }}>학생의 {selectedDraftType === "draft1" ? "1st" : "2nd"} Draft:</h4>
              <div
                style={{
                  background: "#f5f7fb",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <p style={{ fontWeight: 600, marginBottom: "8px" }}>
                  {selectedDraftType === "draft1" 
                    ? (draft1Map[selectedLesson.id]?.title || "Untitled")
                    : (draft2Map[selectedLesson.id]?.title || "Untitled")}
                </p>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                  {selectedDraftType === "draft1"
                    ? (draft1Map[selectedLesson.id]?.body || "")
                    : (draft2Map[selectedLesson.id]?.body || "")}
                </p>
              </div>
              {(() => {
                const isDraft2 = selectedDraftType === "draft2";
                const isDraft2Submitted = draft2SubmittedMap[selectedLesson.id] === "true";

                // 2nd Draft 평가창: 피드백 작성 (리포트에 표시될 최종 코멘트)
                if (isDraft2 && isDraft2Submitted) {
                  return (
                    <>
                      <label style={{ display: "block", marginBottom: "8px" }}>
                        <strong>최종 피드백 (리포트에 표시됩니다):</strong>
                      </label>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="리포트에 표시될 최종 코멘트를 작성하세요... (선택사항)"
                        rows={6}
                        disabled={isEvaluated}
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1px solid #dfe3f3",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontFamily: "inherit",
                          resize: "vertical",
                        }}
                      />
                      <div style={{
                        padding: "12px",
                        background: "#f5f7fb",
                        borderRadius: "8px",
                        marginTop: "12px"
                      }}>
                        <p style={{ color: "#6c7694", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
                          💡 <strong>승인</strong>하면 리포트가 생성되며, <strong>거부</strong>하면 학생이 수정할 수 있습니다.
                        </p>
                      </div>
                    </>
                  );
                }
                
                // 1st Draft 피드백 작성 영역
                return (
                  <>
                    <label style={{ display: "block", marginBottom: "8px" }}>
                      <strong>피드백 작성:</strong>
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="학생의 글에 대한 피드백을 작성하세요..."
                      rows={8}
                      disabled={(() => {
                        const feedbackKey = `${selectedLesson.id}_${selectedDraftType}`;
                        return feedbackSubmittedMap[feedbackKey] === "true";
                      })()}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #dfe3f3",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        resize: "vertical",
                      }}
                    />
                    {(() => {
                      const feedbackKey = `${selectedLesson.id}_${selectedDraftType}`;
                      const isSubmitted = feedbackSubmittedMap[feedbackKey] === "true";
                      const hasFeedback = Boolean(teacherFeedbackMap[feedbackKey]);
                      if (isSubmitted) {
                        return (
                          <p
                            style={{
                              marginTop: "12px",
                              fontSize: "13px",
                              color: "#f05252",
                              fontWeight: 600,
                            }}
                          >
                            제출된 피드백입니다. 수정할 수 없습니다.
                          </p>
                        );
                      }
                      if (hasFeedback) {
                        return (
                          <p
                            style={{
                              marginTop: "12px",
                              fontSize: "13px",
                              color: "#5f6a89",
                            }}
                          >
                            기존 피드백이 있습니다. 수정하거나 새로 작성할 수 있습니다.
                          </p>
                        );
                      }
                      return null;
                    })()}
                  </>
                );
              })()}
            </div>
            </Modal>
          );
        })()}
      </div>
    </div>
  );
};

export default TeacherApp;

