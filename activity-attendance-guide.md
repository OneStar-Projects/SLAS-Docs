# 活動出席（QR 簽到）

> 本文檔面向 Demo 執行人、UAT 測試人與業務培訓人員，目標是讓使用者**不依賴開發人員陪同**，也能完成 QR 簽到、手動補簽與出席終結。
>
> 本指南基於 `SLAS_PRO` / `SLAS_UI` 當前實現撰寫。
> 出席模組支援：QR 碼自助簽到/簽退、管理員手動與批次處理、活動結束後的自動終結（補缺席），並可串接 BPMN `attendance_review` 做出席稽核。
> 角色稱呼以 DB `SYSTEM_ROLE.NAME` 為權威名（見 `roles-menus-permissions-matrix.md`）。

---

## 1. 模組概覽

### 1.1 業務目標

記錄參與者在活動現場的出席情況（簽到/簽退），自動判定遲到/早退/缺席，並在活動結束後終結出席資料，供後續報告與統計使用。

### 1.2 觸發條件

- 簽到/簽退：活動進行期間，由參與者掃 QR 或由管理員手動處理。
- 自動終結：活動結束日的**次日 00:00** 由系統觸發。

### 1.3 出席結果總覽

| 出席類型（`attendanceType`） | 業務含義 |
|:--|:--|
| `CHECK_IN` | 已簽到 |
| `CHECK_OUT` | 已簽退 |
| `NOT_CHECKED_OUT` | 已簽到但未簽退（終結時補記） |
| `ABSENT` | 缺席（應到未簽到） |

> 細分出席判定 `AttendanceStatusEnum`：`NOT_CHECKED_IN` / `CHECKED_IN_ONLY` / `FULLY_ATTENDED` / `LATE_CHECK_IN`（遲到）/ `EARLY_CHECK_OUT`（早退）/ `ABSENT`。

### 1.4 與其他模組的關係

- 「應到名單」來自「活動報名」最終 `APPROVED` 名冊與獲接受的嘉賓邀請。
- 出席結果是「事件/活動報告」與統計的資料來源；自動終結還會把活動轉為 `COMPLETED`。

---

## 2. 角色與職責

| 角色（`SYSTEM_ROLE.NAME`） | 職責 |
|:--|:--|
| `Student` / `Guest`（參與者） | 掃 QR 自助簽到/簽退 |
| `Group Leader`（`sg_leader`, 114）/ `Supervisor`（`supervisor`, 116） | 出示 QR、手動補簽、批次簽到/簽退、批次標記缺席（需通過 `ActivityAccessGuard.canManageAttendance`） |
| `Coordinator`（`coordinator`, 115） | 出席稽核（BPMN `attendance_review`）審核人，確認出席資料準確性 |
| 系統（排程） | 活動結束次日 00:00 自動終結，補 `NOT_CHECKED_OUT` / `ABSENT`，活動轉 `COMPLETED` |

> 出席稽核 `attendanceReviewTask` 的指派為 Flowable 候選組 `115`（`Coordinator`）；不通過時 `attendanceCorrectionTask` 退回發起人（`startUserId`）更正後重提。

---

## 3. 流程圖

### 3.1 出席主流程

```mermaid
flowchart TD
    A[活動開始, 管理員出示 QR] --> B{參與者操作}
    B -- 掃碼簽到 --> C[CHECK_IN<br/>method=QR_CODE]
    B -- 管理員手動 --> C2[CHECK_IN<br/>method=MANUAL]
    C --> D[活動進行中]
    C2 --> D
    D --> E{簽退?}
    E -- 掃碼/手動簽退 --> F[CHECK_OUT]
    E -- 未簽退 --> G[暫無簽退記錄]
    F --> H[活動結束]
    G --> H
    H --> I[結束次日 00:00<br/>autoFinalizeAttendanceIfTimeout]
    I --> J[已簽到未簽退 → NOT_CHECKED_OUT]
    I --> K[應到未簽到 → ABSENT]
    J --> L[活動轉 COMPLETED]
    K --> L
```

### 3.2 出席稽核（BPMN `attendance_review`）

```mermaid
flowchart TD
    A[提交出席記錄] --> B[AttendanceDataCheckTask<br/>系統校驗資料]
    B --> C[attendanceReviewTask<br/>審核人確認準確性]
    C --> D{審核結果}
    D -- 通過 --> E[AttendanceConfirmTask<br/>確認並更新統計]
    D -- 不通過 --> F[attendanceCorrectionTask<br/>更正後重提]
    F --> C
    E --> G[流程結束]
```

---

## 4. 關鍵步驟詳述

- **核心端點**（`ActivityAttendanceController.java`）
  - 自助：`POST /activity/attendance/check-in`、`/check-out`（需登入）。
  - 管理：`POST /activity/attendance/manual-check-in`、`/batch-check-in`、`/batch-check-out`、`/batch-mark-absent`。
  - 查詢：`GET /activity/attendance/enhanced-page`（分頁，按 缺席/已簽到/已簽退/未簽退 分頁籤）、`/detail/{userId}`、`/get`。
- **服務實現**（`ActivityAttendanceServiceImpl`）
  - `autoFinalizeAttendanceIfTimeout(activityId)`：以「活動最晚結束日 + 1 天的 00:00」為截止；到點後，把已簽到未簽退者補 `NOT_CHECKED_OUT`，把已 `APPROVED` 報名/已接受嘉賓但無任何出席記錄者補 `ABSENT`，並把活動轉 `COMPLETED`。
- **QR 碼生成**：`SystemQrCodeServiceImpl`（ZXing），編碼活動 ID + 時間戳；前端 `QRCodePage.vue` 提供**動態**（含倒數刷新）與**靜態**兩種模式。
- **業務規則**
  - 遲到：簽到時間晚於排定開始；早退：簽退時間早於排定結束。
  - 區分學生與嘉賓（嘉賓可能無系統帳號，`userId` 可為 0），嘉賓以 email 去重。
  - 衝突偵測：檢查使用者是否同時報名了時間重疊的活動。
  - 權限：所有管理操作前置 `ActivityAccessGuard.canManageAttendance(activityId)`。

---

## 5. 狀態與資料模型

### 5.1 關鍵欄位（`ActivityAttendanceDO`，表 `activity_attendance`）

`activityId`、`userId`、`studentId`、`attendanceType`、`attendanceTime`、`method`（`QR_CODE` / `MANUAL` / `TOKEN` / `AUTO_MARK_NOT_CHECKED_OUT` / `AUTO_MARK_ABSENT`）、`locationInfo`、`deviceInfo`、`ipAddress`、`isConflictResolved`、`conflictActivities`、`deptId`。

### 5.2 前端入口

`views/organiser/ManageAttendance/`：`index.vue`（活動選擇 + 簽到/簽退 QR 按鈕）、`QRCodePage.vue`（動態/靜態 QR）、`AttendanceBmpIntegration.vue`（出席記錄送入 BPMN 稽核 + 工作流狀態展示）。API 包裝 `api/attendance/attendanceApi.ts`。

---

## 6. 端到端 Demo 指南

### 6.1 準備條件

- 一個進行中、且已有 `APPROVED` 報名名單的活動。
- 至少 2 名已錄取學生帳號（一名演示完整簽到簽退，一名演示缺席）。
- 組織者帳號（可管理該活動出席）。

### 6.2 主線：簽到 → 簽退 → 自動終結

1. **組織者**進 `/organiser/ManageAttendance`，選擇活動，打開「簽到 QR」（`QRCodePage.vue`），可切換動態/靜態模式。
2. **學生 A**掃碼簽到 → 產生 `CHECK_IN`（`method=QR_CODE`）。
   - 驗證點：`enhanced-page` 的「已簽到」頁籤出現學生 A。
3. 活動尾聲，**學生 A**掃「簽退 QR」→ `CHECK_OUT`，判定 `FULLY_ATTENDED`。
4. **學生 B**全程不簽到。
5. 模擬活動結束次日 00:00 觸發 `autoFinalizeAttendanceIfTimeout`：
   - 驗證點：學生 B 補記 `ABSENT`；任何只簽到沒簽退者補 `NOT_CHECKED_OUT`；活動狀態轉 `COMPLETED`。

### 6.3 旁支：手動補簽與批次

1. 組織者對漏簽的學生用「手動簽到」（`manual-check-in`，可填原因）。
2. 用「批次簽到/簽退」一次處理多名；用「批次標記缺席」處理被拒名單。
   - 驗證點：對應 `method` 顯示為 `MANUAL`；分頁籤計數正確。

### 6.4 旁支：出席稽核（選做）

1. 在 `AttendanceBmpIntegration.vue` 提交出席記錄進入 `attendance_review`。
2. 審核人確認準確性 → 通過則確認並更新統計；不通過則進更正任務後重提。

---

## 7. 邊界與已知限制

- 自動終結以「結束日次日 00:00」為界，未到點前不會補缺席，Demo 需模擬時間或等待排程。
- 嘉賓無系統帳號時以 email 識別與去重，請避免重複 email。
- 動態 QR 會依設定秒數刷新，掃碼端需即時取得最新碼。
