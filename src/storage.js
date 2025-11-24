const STORAGE_KEYS = {
  lessons: "writingLessons",
  draft1: "draft1",
  draft2: "draft2",
  draft1Submitted: "draft1Submitted",
  draft2Submitted: "draft2Submitted",
  teacherFeedback: "teacherFeedback",
  feedbackSubmitted: "feedbackSubmitted",
  draftEvaluated: "draftEvaluated", // 평가 완료 상태 추적
};

const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readJSON = (key, fallback) => {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage`, error);
    return fallback;
  }
};

const writeJSON = (key, value) => {
  if (!isBrowser) return;
  try {
    const valueStr = JSON.stringify(value);
    window.localStorage.setItem(key, valueStr);
    // 커스텀 이벤트로 같은 탭에서도 알림 (storage 이벤트는 다른 탭에서만 발생)
    window.dispatchEvent(new CustomEvent("localStorageChange", { 
      detail: { key, newValue: valueStr, value } 
    }));
    // 다른 탭/앱에 변경사항 알림
    window.dispatchEvent(new StorageEvent("storage", { key, newValue: valueStr }));
  } catch (error) {
    console.warn(`Failed to write ${key} to localStorage`, error);
  }
};

export const loadLessons = (defaults) =>
  readJSON(STORAGE_KEYS.lessons, defaults);

export const saveLessons = (lessons) =>
  writeJSON(STORAGE_KEYS.lessons, lessons);

export const loadDraftMap = (key) => readJSON(STORAGE_KEYS[key], {});

export const saveDraftMap = (key, value) => writeJSON(STORAGE_KEYS[key], value);

export const loadSubmittedMap = (key) => readJSON(STORAGE_KEYS[key], {});

export const saveSubmittedMap = (key, value) =>
  writeJSON(STORAGE_KEYS[key], value);

export const loadTeacherFeedback = () =>
  readJSON(STORAGE_KEYS.teacherFeedback, {});

export const saveTeacherFeedback = (value) =>
  writeJSON(STORAGE_KEYS.teacherFeedback, value);

export const loadFeedbackSubmitted = () =>
  readJSON(STORAGE_KEYS.feedbackSubmitted, {});

export const saveFeedbackSubmitted = (value) =>
  writeJSON(STORAGE_KEYS.feedbackSubmitted, value);

export const loadDraftEvaluated = () =>
  readJSON(STORAGE_KEYS.draftEvaluated, {});

export const saveDraftEvaluated = (value) =>
  writeJSON(STORAGE_KEYS.draftEvaluated, value);

export const storageHelpers = {
  loadLessons,
  saveLessons,
  loadDraftMap,
  saveDraftMap,
  loadSubmittedMap,
  saveSubmittedMap,
  loadTeacherFeedback,
  saveTeacherFeedback,
  loadFeedbackSubmitted,
  saveFeedbackSubmitted,
  loadDraftEvaluated,
  saveDraftEvaluated,
};


