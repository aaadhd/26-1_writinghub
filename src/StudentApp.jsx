import { useEffect, useMemo, useState } from "react";
import WritingActivity from "./components/WritingActivity.jsx";
import DraftWorkspace from "./components/DraftWorkspace.jsx";
import DraftPreviewModal from "./components/DraftPreviewModal.jsx";
import Modal from "./components/Modal.jsx";
import {
  loadLessons,
  saveLessons,
  loadDraftMap,
  saveDraftMap,
  loadSubmittedMap,
  saveSubmittedMap,
  loadTeacherFeedback,
  saveTeacherFeedback,
  loadDraftEvaluated,
} from "./storage.js";

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

const stepLabels = {
  outline: "Outline",
  draft1: "1st Draft",
  draft2: "2nd Draft",
};

const CONFIRM_SUBMIT_1ST_DRAFT =
  "You have saved work in 2nd Draft.\n\nSubmitting 1st Draft will clear your current 2nd Draft so you can revise this draft with your teacher's feedback.\n\nDo you want to continue?";

const StudentApp = () => {
  const [lessons, setLessons] = useState(() => loadLessons(initialLessons));
  const [view, setView] = useState("activity");
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [activeStep, setActiveStep] = useState("draft1");

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
  const [draftEvaluatedMap, setDraftEvaluatedMap] = useState(() =>
    loadDraftEvaluated()
  );

  const [previewState, setPreviewState] = useState({
    open: false,
    lessonId: null,
    stepKey: null,
    readOnly: false,
  });
  const [reportLesson, setReportLesson] = useState(null);
  const [confirmState, setConfirmState] = useState(null);

  // localStorage 변경 감지 (Teacher App에서 피드백 추가 시 자동 반영)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "teacherFeedback") {
        setTeacherFeedbackMap(loadTeacherFeedback());
      }
      if (e.key === "writingLessons") {
        const updatedLessons = loadLessons(initialLessons);
        setLessons(updatedLessons);
      }
      if (e.key === "draftEvaluated") {
        setDraftEvaluatedMap(loadDraftEvaluated());
      }
    };

    const handleLocalStorageChange = (e) => {
      if (e.detail.key === "teacherFeedback") {
        setTeacherFeedbackMap(e.detail.value);
      }
      if (e.detail.key === "writingLessons") {
        setLessons(e.detail.value);
      }
      if (e.detail.key === "draftEvaluated") {
        setDraftEvaluatedMap(e.detail.value);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageChange", handleLocalStorageChange);

    // 같은 탭에서도 감지하기 위해 주기적 체크 (1초마다 - 더 빠른 반영)
    const interval = setInterval(() => {
      const newTeacherFeedback = loadTeacherFeedback();
      const newLessons = loadLessons(initialLessons);
      const newDraftEvaluated = loadDraftEvaluated();
      // 상태가 실제로 변경되었을 때만 업데이트
      setTeacherFeedbackMap((prev) => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(newTeacherFeedback);
        return prevStr !== newStr ? newTeacherFeedback : prev;
      });
      setLessons((prev) => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(newLessons);
        return prevStr !== newStr ? newLessons : prev;
      });
      setDraftEvaluatedMap((prev) => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(newDraftEvaluated);
        return prevStr !== newStr ? newDraftEvaluated : prev;
      });
    }, 1000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleLocalStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    saveLessons(lessons);
  }, [lessons]);

  useEffect(() => {
    saveDraftMap("draft1", draft1Map);
  }, [draft1Map]);

  useEffect(() => {
    saveDraftMap("draft2", draft2Map);
  }, [draft2Map]);

  useEffect(() => {
    saveSubmittedMap("draft1Submitted", draft1SubmittedMap);
  }, [draft1SubmittedMap]);

  useEffect(() => {
    saveSubmittedMap("draft2Submitted", draft2SubmittedMap);
  }, [draft2SubmittedMap]);

  useEffect(() => {
    saveTeacherFeedback(teacherFeedbackMap);
  }, [teacherFeedbackMap]);

  // draftEvaluatedMap 변경 시 레슨 상태 업데이트
  useEffect(() => {
    Object.keys(draftEvaluatedMap).forEach((key) => {
      const [lessonIdStr, draftType] = key.split("_");
      const lessonId = parseInt(lessonIdStr);
      const evaluation = draftEvaluatedMap[key];

      if (evaluation === "rejected") {
        // 거부된 경우 해당 draft 상태를 "rejected"로 변경
        updateLesson(lessonId, (lesson) => {
          if (draftType === "draft1" && lesson.draft1Status !== "rejected") {
            return { draft1Status: "rejected" };
          }
          if (draftType === "draft2" && lesson.draft2Status !== "rejected") {
            return { draft2Status: "rejected" };
          }
          return {};
        });
      } else if (evaluation === "approved" && draftType === "draft2") {
        // 2nd Draft가 승인된 경우 reportAvailable을 true로 설정
        updateLesson(lessonId, (lesson) => {
          if (!lesson.reportAvailable) {
            return { reportAvailable: true, draft2Status: "completed" };
          }
          return {};
        });
      }
    });
  }, [draftEvaluatedMap]);

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === activeLessonId) || null,
    [activeLessonId, lessons]
  );

  const updateLesson = (lessonId, updates) => {
    setLessons((prev) =>
      prev.map((lesson) => {
        if (lesson.id !== lessonId) return lesson;
        const updatePayload =
          typeof updates === "function" ? updates(lesson) : updates;
        return { ...lesson, ...updatePayload };
      })
    );
  };

  // 재제출 시 draftEvaluated 삭제하는 헬퍼 함수
  const clearDraftEvaluation = (lessonId, draftType) => {
    const evaluationKey = `${lessonId}_${draftType}`;
    const savedEvaluations = JSON.parse(localStorage.getItem('draftEvaluated') || '{}');
    if (savedEvaluations[evaluationKey]) {
      delete savedEvaluations[evaluationKey];
      localStorage.setItem('draftEvaluated', JSON.stringify(savedEvaluations));
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { key: 'draftEvaluated', value: savedEvaluations }
      }));
      setDraftEvaluatedMap(savedEvaluations);
    }
  };

  const openDraftWorkspace = (lessonId, stepKey) => {
    setActiveLessonId(lessonId);
    setActiveStep(stepKey);
    setView("draft");
  };

  const getDraftContent = (lessonId, stepKey) => {
    if (stepKey === "draft1") return draft1Map[lessonId];
    if (stepKey === "draft2") return draft2Map[lessonId];
    return {
      title: "Outline Snapshot",
      body: "개요 단계에서는 아이디어를 구조화합니다.",
    };
  };

  const openPreview = (lesson, stepKey, readOnly = false) => {
    setPreviewState({
      open: true,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      stepKey,
      stepLabel: stepLabels[stepKey],
      status: lesson[`${stepKey}Status`] || "available",
      content: getDraftContent(lesson.id, stepKey),
      readOnly,
    });
  };

  const handleStepClick = (lesson, stepKey, status) => {
    if (status === "locked") return;
    if (lesson.reportAvailable) {
      openPreview(lesson, stepKey, true);
      return;
    }
    if (stepKey === "outline") {
      openPreview(lesson, stepKey, true);
      return;
    }
    // 각 스텝은 독립적으로 접근 가능 (1st Draft 없이도 2nd Draft 접근 가능)
    // available, saved, completed, rejected 상태 모두 편집 가능
    if (stepKey === "draft1" || stepKey === "draft2") {
      openDraftWorkspace(lesson.id, stepKey);
    } else {
      openPreview(lesson, stepKey, false);
    }
  };

  const handlePreviewEdit = () => {
    if (!previewState.lessonId) return;
    setPreviewState((prev) => ({ ...prev, open: false }));
    openDraftWorkspace(previewState.lessonId, previewState.stepKey);
  };

  const handleBackToActivity = () => {
    setView("activity");
    setActiveLessonId(null);
    setActiveStep("draft1");
  };

  const handleSaveDraft1 = (lessonId, data) => {
    setDraft1Map((prev) => ({ ...prev, [lessonId]: data }));

    // rejected 상태에서 저장하면 submitted를 false로 초기화 (다시 작성 중)
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson?.draft1Status === "rejected") {
      setDraft1SubmittedMap((prev) => {
        const next = { ...prev };
        delete next[lessonId];
        return next;
      });
    }

    updateLesson(lessonId, (lesson) => {
      // rejected 상태에서 저장하면 saved로 변경 (재제출 가능하도록)
      if (lesson.draft1Status === "rejected") {
        return { draft1Status: "saved" };
      }
      return {
        draft1Status: lesson.draft1Status === "completed" ? "completed" : "saved",
      };
    });
  };

  const handleSubmitDraft1 = (lessonId, data, hasDraft2Progress) => {
    if (hasDraft2Progress) {
      setConfirmState({
        lessonId,
        data,
        message: CONFIRM_SUBMIT_1ST_DRAFT,
        onConfirm: () => finalizeDraft1Submit(lessonId, data, true),
      });
    } else {
      finalizeDraft1Submit(lessonId, data, false);
    }
  };

  const finalizeDraft1Submit = (lessonId, data, clearSecondDraft) => {
    setDraft1Map((prev) => ({ ...prev, [lessonId]: data }));
    // rejected 상태에서 재제출하는 경우도 submitted를 "true"로 설정
    setDraft1SubmittedMap((prev) => ({ ...prev, [lessonId]: "true" }));

    if (clearSecondDraft) {
      setDraft2Map((prev) => {
        const next = { ...prev };
        delete next[lessonId];
        return next;
      });
      setDraft2SubmittedMap((prev) => {
        const next = { ...prev };
        delete next[lessonId];
        return next;
      });
    }

    // 재제출 시 draftEvaluated 삭제 (Teacher가 다시 평가할 수 있도록)
    clearDraftEvaluation(lessonId, "draft1");

    // 1st Draft 제출 후 상태 업데이트
    updateLesson(lessonId, {
      draft1Status: "completed",
      reportAvailable: false,
    });

    // Teacher App에서 피드백을 작성하도록 함 (자동 생성하지 않음)
    setConfirmState(null);
    alert("제출했습니다.");
    handleBackToActivity();
  };

  const handleSaveDraft2 = (lessonId, data) => {
    setDraft2Map((prev) => ({ ...prev, [lessonId]: data }));

    // rejected 상태에서 저장하면 submitted를 false로 초기화 (다시 작성 중)
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson?.draft2Status === "rejected") {
      setDraft2SubmittedMap((prev) => {
        const next = { ...prev };
        delete next[lessonId];
        return next;
      });
    }

    updateLesson(lessonId, (lesson) => {
      // rejected 상태에서 저장하면 saved로 변경 (재제출 가능하도록)
      if (lesson.draft2Status === "rejected") {
        return { draft2Status: "saved" };
      }
      return {
        draft2Status: lesson.draft2Status === "completed" ? "completed" : "saved",
      };
    });
  };

  const handleSubmitDraft2 = (lessonId, data) => {
    setDraft2Map((prev) => ({ ...prev, [lessonId]: data }));
    setDraft2SubmittedMap((prev) => ({ ...prev, [lessonId]: "true" }));

    // 재제출 시 draftEvaluated 삭제 (Teacher가 다시 평가할 수 있도록)
    clearDraftEvaluation(lessonId, "draft2");

    // 2nd Draft 제출 시 completed로 변경 (1st Draft는 completed 유지)
    updateLesson(lessonId, {
      draft2Status: "completed",
      reportAvailable: false, // Teacher가 승인하면 true로 변경됨
    });
    alert("제출했습니다. 선생님의 평가를 기다려주세요.");
    handleBackToActivity();
  };


  const reportFeedback = reportLesson
    ? teacherFeedbackMap[`${reportLesson.id}_draft2`] || 
      teacherFeedbackMap[`${reportLesson.id}_draft1`] || 
      teacherFeedbackMap[reportLesson.id] || {
        text: "Final feedback is pending.",
      }
    : null;

  const previewEditAllowed =
    !previewState.readOnly &&
    (previewState.stepKey === "draft1" || previewState.stepKey === "draft2");

  return (
    <>
      {view === "activity" ? (
        <WritingActivity
          lessons={lessons}
          onStepClick={handleStepClick}
          onReportClick={setReportLesson}
          teacherFeedbackMap={teacherFeedbackMap}
        />
      ) : (
        <DraftWorkspace
          lesson={selectedLesson}
          step={activeStep}
          draft1={selectedLesson ? draft1Map[selectedLesson.id] : null}
          draft2={selectedLesson ? draft2Map[selectedLesson.id] : null}
          teacherFeedback={
            selectedLesson
              ? teacherFeedbackMap[
                  `${selectedLesson.id}_${activeStep === "draft1" ? "draft1" : "draft2"}`
                ] || null
              : null
          }
          draft1Submitted={
            selectedLesson ? draft1SubmittedMap[selectedLesson.id] : null
          }
          draft2Submitted={
            selectedLesson ? draft2SubmittedMap[selectedLesson.id] : null
          }
          onBack={handleBackToActivity}
          onSaveDraft1={(data) => {
            if (!selectedLesson) return;
            handleSaveDraft1(selectedLesson.id, data);
          }}
          onSubmitDraft1={(data, hasDraft2Progress) => {
            if (!selectedLesson) return;
            handleSubmitDraft1(selectedLesson.id, data, hasDraft2Progress);
          }}
          onSaveDraft2={(data) => {
            if (!selectedLesson) return;
            handleSaveDraft2(selectedLesson.id, data);
          }}
          onSubmitDraft2={(data) => {
            if (!selectedLesson) return;
            handleSubmitDraft2(selectedLesson.id, data);
          }}
        />
      )}

      <DraftPreviewModal
        isOpen={previewState.open}
        lessonTitle={previewState.lessonTitle || ""}
        stepLabel={previewState.stepLabel || ""}
        status={previewState.status}
        content={previewState.content}
        readOnly={previewState.readOnly}
        onClose={() =>
          setPreviewState((prev) => ({
            ...prev,
            open: false,
          }))
        }
        onEdit={previewEditAllowed ? handlePreviewEdit : undefined}
      />

      <Modal
        isOpen={Boolean(reportLesson)}
        onClose={() => setReportLesson(null)}
        title={reportLesson ? `${reportLesson.title} REPORT` : ""}
      >
        <p className="report-line">Final Score: 4 / 5</p>
        <p className="report-line">Writing Traits: Ideas · Organization · Voice</p>
        <p className="report-line">
          Teacher Comment: {reportFeedback?.text || "Great job!"}
        </p>
      </Modal>

      <Modal
        isOpen={Boolean(confirmState)}
        onClose={() => setConfirmState(null)}
        title="Submit 1st Draft?"
        actions={[
          {
            label: "No",
            onClick: () => setConfirmState(null),
            variant: "secondary",
          },
          {
            label: "Yes",
            onClick: () => {
              if (confirmState?.onConfirm) {
                confirmState.onConfirm();
              }
              setConfirmState(null);
            },
            variant: "primary",
          },
        ]}
      >
        <p className="confirm-text">{confirmState?.message}</p>
      </Modal>
    </>
  );
};

export default StudentApp;

