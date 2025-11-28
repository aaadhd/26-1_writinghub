# 1st/2nd Draft 상태 조합 전체 케이스 분석 (정확한 계산)

## 상태 변수 정의

### 기본 상태 (이미 거부 포함)
- **draft1Status**: `available`, `saved`, `completed`, `rejected` (4가지)
  - `rejected` = 피드백 거부됨
- **draft2Status**: `available`, `saved`, `completed`, `rejected` (4가지)
  - `rejected` = 피드백 거부됨

### 피드백 상태 (completed 상태에서만 의미 있음)
- **1st Draft 피드백** (draft1Status가 `completed`일 때만):
  - 피드백 없음 (대기중)
  - 피드백 입수 (feedbackSubmitted: true)
- **2nd Draft 피드백** (draft2Status가 `completed`일 때만):
  - 피드백 없음 (대기중)
  - 승인됨 (approved, reportAvailable: true)

---

## 정확한 케이스 계산

### 기본 조합: 4 × 4 = 16가지

각 조합에 피드백 상태를 추가:

#### 1. draft1Status: `available`, draft2Status: `available`
- 피드백 상태: 없음 (둘 다 피드백 대상 아님)
- **케이스 수: 1개**

#### 2. draft1Status: `available`, draft2Status: `saved`
- 피드백 상태: 없음
- **케이스 수: 1개**

#### 3. draft1Status: `available`, draft2Status: `completed`
- 2nd Draft 피드백: 없음 / 승인됨 (2가지)
- **케이스 수: 2개**

#### 4. draft1Status: `available`, draft2Status: `rejected`
- 피드백 상태: 없음 (거부는 이미 상태에 포함)
- **케이스 수: 1개**

#### 5. draft1Status: `saved`, draft2Status: `available`
- 피드백 상태: 없음
- **케이스 수: 1개**

#### 6. draft1Status: `saved`, draft2Status: `saved`
- 피드백 상태: 없음
- **케이스 수: 1개**

#### 7. draft1Status: `saved`, draft2Status: `completed`
- 2nd Draft 피드백: 없음 / 승인됨 (2가지)
- **케이스 수: 2개**

#### 8. draft1Status: `saved`, draft2Status: `rejected`
- 피드백 상태: 없음
- **케이스 수: 1개**

#### 9. draft1Status: `completed`, draft2Status: `available`
- 1st Draft 피드백: 없음 / 입수 (2가지)
- **케이스 수: 2개**

#### 10. draft1Status: `completed`, draft2Status: `saved`
- 1st Draft 피드백: 없음 / 입수 (2가지)
- **케이스 수: 2개**

#### 11. draft1Status: `completed`, draft2Status: `completed`
- 1st Draft 피드백: 없음 / 입수 (2가지)
- 2nd Draft 피드백: 없음 / 승인됨 (2가지)
- **케이스 수: 2 × 2 = 4개**

#### 12. draft1Status: `completed`, draft2Status: `rejected`
- 1st Draft 피드백: 없음 / 입수 (2가지)
- 피드백 상태: 없음 (2nd는 거부 상태)
- **케이스 수: 2개**

#### 13. draft1Status: `rejected`, draft2Status: `available`
- 피드백 상태: 없음 (1st는 거부 상태)
- **케이스 수: 1개**

#### 14. draft1Status: `rejected`, draft2Status: `saved`
- 피드백 상태: 없음
- **케이스 수: 1개**

#### 15. draft1Status: `rejected`, draft2Status: `completed`
- 2nd Draft 피드백: 없음 / 승인됨 (2가지)
- **케이스 수: 2개**

#### 16. draft1Status: `rejected`, draft2Status: `rejected`
- 피드백 상태: 없음 (둘 다 거부 상태)
- **케이스 수: 1개**

---

## 총 케이스 수 계산

| 조합 | 케이스 수 |
|------|----------|
| available × available | 1 |
| available × saved | 1 |
| available × completed | 2 |
| available × rejected | 1 |
| saved × available | 1 |
| saved × saved | 1 |
| saved × completed | 2 |
| saved × rejected | 1 |
| completed × available | 2 |
| completed × saved | 2 |
| completed × completed | 4 |
| completed × rejected | 2 |
| rejected × available | 1 |
| rejected × saved | 1 |
| rejected × completed | 2 |
| rejected × rejected | 1 |

**총합: 26개 케이스**

---

## 상세 설명

### 피드백 상태가 의미 있는 경우

1. **1st Draft 피드백** (draft1Status가 `completed`일 때만):
   - 피드백 없음: 제출 후 피드백 대기중
   - 피드백 입수: Teacher가 피드백 제출함 (feedbackSubmitted: true, draftEvaluated: feedback_submitted)

2. **2nd Draft 피드백** (draft2Status가 `completed`일 때만):
   - 피드백 없음: 제출 후 승인/거부 대기중
   - 승인됨: Teacher가 승인함 (draftEvaluated: approved, reportAvailable: true)

3. **거부 상태** (`rejected`):
   - 이미 기본 조합에 포함됨
   - 피드백 거부를 의미
   - 추가 피드백 상태 변수 불필요

---

## 시스템 조건 및 규칙

### 1. 1st Draft 제출 시 2nd Draft 내용 삭제
**조건**: 1st Draft 제출 시 2nd Draft에 진행 내용이 있는 경우
- `hasDraft2Progress = true`일 때 확인 모달 표시
- 사용자가 확인하면:
  - `draft2Map[lessonId]` 삭제
  - `draft2SubmittedMap[lessonId]` 삭제
  - 2nd Draft 내용 초기화
- **이유**: 1st Draft 피드백을 받고 2nd Draft를 새로 작성하기 위함

### 2. 1st Draft는 completed 상태에서 절대 변경되지 않음
**조건**: 1st Draft가 `completed` 상태인 경우
- 1st Draft는 절대 상태 변경 불가 (영구적으로 `completed` 유지)
- 2nd Draft 거부 시에도 1st Draft 상태는 변경되지 않음
- 2nd Draft는 1st Draft를 참고용(Reference)으로만 사용
- 2nd Draft는 독립적으로 작성 가능 (1st Draft와 무관한 내용도 가능)
- **이유**: 1st Draft는 이미 제출되어 평가된 상태이므로 변경 불가

### 3. rejected 상태에서 저장 시 submitted 초기화
**조건**: rejected 상태에서 Draft 저장 시
- `draft1SubmittedMap[lessonId]` 또는 `draft2SubmittedMap[lessonId]` 삭제
- `draftStatus`가 `rejected` → `saved`로 변경
- **이유**: 거부된 Draft를 수정 중이므로 submitted 상태 초기화

### 4. 재제출 시 draftEvaluated 삭제
**조건**: rejected 상태에서 재제출 시
- `draftEvaluated[lessonId_draftType]` 삭제
- Teacher가 다시 평가할 수 있도록 상태 초기화
- **이유**: 재제출된 Draft는 새로운 평가가 필요함

### 5. 1st Draft 피드백 제출 시 draft2Status 변경
**조건**: 1st Draft 피드백이 제출된 경우
- `draft2Status: "available"`로 설정
- 2nd Draft 작성 가능하도록 상태 변경
- **이유**: 피드백을 받았으므로 2nd Draft 작성 시작 가능

### 6. 2nd Draft 제출 시 1st Draft 읽기 전용
**조건**: 2nd Draft가 `completed`이고 `submitted`인 경우
- 1st Draft는 읽기 전용 (수정 불가)
- 단, 2nd Draft가 `rejected`이면 1st Draft도 수정 가능
- **이유**: 2nd Draft 제출 후 1st Draft는 참고용으로만 사용

### 7. 제출된 Draft 수정 불가 (rejected 제외)
**조건**: Draft가 `submitted`이고 `rejected`가 아닌 경우
- Draft 수정 불가 (읽기 전용)
- `rejected` 상태일 때만 수정 가능
- **이유**: 제출된 Draft는 평가 대기 중이므로 수정 불가

### 8. 2nd Draft 제출 시 reportAvailable 초기화
**조건**: 2nd Draft 제출 시
- `reportAvailable: false`로 설정
- Teacher가 승인하면 `reportAvailable: true`로 변경
- **이유**: 승인 전까지는 리포트 생성 불가

---

## 참고사항

- `rejected` 상태는 이미 기본 조합(16가지)에 포함되어 있어 피드백 거부를 의미합니다.
- 피드백 상태는 `completed` 상태일 때만 추가로 고려됩니다.
- `available`, `saved`, `rejected` 상태는 피드백 상태와 독립적입니다.
- `completed × completed` 조합에서만 1st와 2nd 피드백이 모두 의미가 있어 4가지 케이스가 발생합니다.
- 위의 조건들로 인해 일부 케이스는 자동으로 다른 케이스로 전환됩니다.

