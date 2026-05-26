# 系統通知與郵件通知

> 本文檔說明 SLAS 各業務流程在「什麼環節、向誰、用什麼方式」發出通知。
>
> 本指南基於 `SLAS_PRO` 當前實現撰寫，面向 Demo / UAT / 業務培訓人員，以及需要排查「為什麼沒收到通知 / 收到了站內信但沒郵件」的支援人員。
> 全文兩個基礎概念貫穿：**渠道**（站內信 vs 郵件）與**發送路徑**（決定渠道與收件人的那段代碼）。先讀第 1 章理解架構，再按第 2 章查具體流程。

---

## 1. 通知架構總覽（先讀）

### 1.1 兩個渠道

| 渠道 | 中文 | 落地 | 用戶在哪看 |
|:--|:--|:--|:--|
| **站內信** | 系統通知 | 寫入 `notify_message` 表（`NotifyMessageSendApi` / `NotifySendService`） | 站內「通知中心」 |
| **郵件** | Email | 經 `MailSendService` 套用郵件模板，寫 `mail_log`，由 SMTP 寄出（可走 Quartz 隊列） | 收件人信箱 |

> 一條業務通知可能**只發站內信**、**只發郵件**、或**兩者都發**——由「發送路徑」決定（見 §1.3）。

### 1.2 四條發送路徑

代碼裡有四套並存的發送機制，決定渠道/收件人的邏輯各不相同。看通知行為前要先認出它走哪條：

| 路徑 | 入口 | 渠道決定方式 | 內容來源 | 同步/異步 | 典型使用者 |
|:--|:--|:--|:--|:--|:--|
| **A. 模板渠道路徑** | `UnifiedNotificationService.sendMultilingualNotification(...)` → `AsyncNotificationService` | 讀 `notify_template.channels`（`1`=站內信 / `2`=郵件 / `3`=兩者），**預設僅站內信** | 資料庫多語模板 | **異步** | 報名、定時提醒、活動狀態 |
| **B. BPM 流程完成路徑** | `BpmProcessCompletionNotificationApi.sendSingleProcessCompletionNotification(...)` → `BpmNotificationDispatcher` | **恆定兩者**（站內信 + 郵件），不看模板 | **程式碼動態組裝**（多語 i18n，無 DB 模板） | 同步（dispatcher 內部可異步） | 各審批流「通過/退回/拒絕」終態 |
| **C. 設定門控路徑** | `NotificationMailIntegrationService.sendApprovalNotification / sendActivityStatusNotification / ...` | 依 `notification_setting` 用戶設定逐項判斷渠道與事件開關 | 資料庫模板 | 同步 | 管理員可配置的審批/狀態/報告/培訓提醒 |
| **D. BPM 任務創建路徑** | `BpmTaskEventListener`（監聽 `TASK_CREATED`/`TASK_ASSIGNED`）→ `BpmTaskNotificationAsyncService.sendTaskCreatedNotificationAsync(...)` | 視流程而定：BPM 程式碼組裝者（`BpmNotificationDispatcher`）**恆定雙發**；走 DB 模板者依路徑 A 規則 | 程式碼組裝或 DB 模板（依流程） | **異步** | 每個審批節點「待你審批」推送 + 申請人「已提交」確認 |

> 路徑 D 是「流程進行中」的逐節點推送：每當流程流轉到一個審批任務節點（任務被創建/指派），就向該節點的候選審批人推一條「待審」通知；部分流程同時向申請人推一條「已提交」確認。它與路徑 B（流程**完成**時的終態通知）互補——B 管終點，D 管中途每一站。
> 路徑 D 僅對白名單流程生效（`activity_promotion_approval`、`enrollment_list_approval`、`activity_publish`、`incident_report_audit`、`activity_report_audit`、`student_org_registration`、`student_org_appeal`、`activity_summary_approval`、`guest_invitation_review`），其餘流程的任務創建不主動推送，只在待辦列表出現。

> 模組自帶的 dispatcher（事故模組 `IncidentNotificationDispatcher`、學生組織與 BPM 共用的 `BpmNotificationDispatcher`）本質都是「站內信 + 郵件雙發」的封裝，歸入路徑 B 的行為模型。

### 1.3 渠道到底怎麼被決定

- **路徑 A（模板）**：開啟 `notify_template` 那筆模板，看 `channels` 欄位。`channels` 為空 → 預設**僅站內信**。所以「站內信收到、郵件沒收到」最常見的原因是模板 `channels` 設成 `1`。
- **路徑 B（BPM 完成）**：寫死兩者都發，與模板無關；它的 `templateCode`（如 `BPM_ACTIVITY_PUBLISH_APPROVED`）只是日誌追蹤標籤，不查表。
- **路徑 C（設定門控）**：先查 `notification_setting` 該類型是否 `enabled`，再查 `channels` 陣列是否含 `email`/`system`，再查事件類型是否在允許清單。任一不過 → 該渠道不發。

### 1.4 收件人怎麼解析

- 多數路徑以 **`userId`** 為主鍵，郵箱在發送時即時解析：先查管理員用戶（`AdminUserService.getUser`），查不到再查成員（`MemberService.getMemberUserEmail`）。解析郵箱時**繞過資料權限**（`DataPermissionUtils.executeIgnore`），避免因權限邊界查不到郵箱。
- **系統用戶（Admin）vs 成員（Member）** 走不同方法（`...ToAdmin` / `...ToMember`，`UserTypeEnum`）。
- 部分通知按 **角色 roleId** 解析收件群（如事故管理層告警 → Dean / SAO Admin / Custodian）。
- 對「非系統用戶」（如受邀嘉賓）可直接用 **郵箱字串** 發，`userId` 傳 `null`、只發郵件。

### 1.5 用戶通知設定（`notification_setting` 預設）

路徑 C 受此設定門控；路徑 A/B **不**讀此設定。預設值（`NotificationSettingServiceImpl`）：

| 設定類型 | 預設 | 渠道 |
|:--|:--|:--|
| `EMAIL_NOTIFICATION` | 開，含 approval/rejection 事件 | 郵件 |
| `ACTIVITY_STATUS` | 開（cancelled/paused/dateChanged/locationChanged） | 郵件 + 站內信 |
| `TRAINING_REMINDER` | 開，提前 7 天，每週 | 郵件 + 站內信 |
| `REPORT_SUBMISSION` | 開，最多 3 次，週末不發 | 郵件 + 站內信 |
| `NOTIFICATION_CENTER` | 開，保留 30 天 | 站內信 |

---

## 2. 各流程的通知環節

> 下表「渠道」欄：**雙發** = 站內信 + 郵件；其餘標明單一渠道。「路徑」對應 §1.2 的 A/B/C。

### 2.1 活動發布審批 `activity_publish`（活動申請）

活動申請從提交起就有主動推送。**申請提交**與**每個審批節點任務創建**走路徑 D（`BpmTaskNotificationAsyncService`，程式碼組裝、`BpmNotificationDispatcher` 雙發）；**流程終態**（通過/退回/拒絕）走路徑 B。

| 環節 / 觸發 | 收件對象 | 渠道 | 路徑 | 備註 |
|:--|:--|:--|:--:|:--|
| 申請提交確認 | 活動申請人（流程發起人 / organizer） | 雙發 | D | `BPM_ACTIVITY_PUBLISH_SUBMITTED`，標題/正文取自 `process.activity_publish.submitted.*` i18n |
| 待審推送（任務創建 / 指派） | 該節點審批人 / 候選人 | 雙發 | D | `BPM_ACTIVITY_PUBLISH_PENDING`，逐節點推送，含活動名/組織/申請人/活動日期/審批連結 |
| 審批通過 → 發布 | 活動申請人 | 雙發 | B | `BPM_ACTIVITY_PUBLISH_APPROVED` |
| 退回（需修改 `RETURNED`） | 活動申請人 | 雙發 | B | 含退回意見（從 BPM 評論抽取） |
| 拒絕（終止） | 活動申請人 | 雙發 | B | `..._REJECTED`，含拒絕原因 |

> **待審推送覆蓋的節點**（`ACTIVITY_PUBLISH_NOTIFICATION_TASK_KEYS`）：`coordinatorReviewTask`、`eoApprovalTask`、`checkerReviewTask`、`supervisorsReviewTask`、`guestEndorsementTask`、`sponsorshipApprovalTask`、`activityContentApprovalTask`、IRG 三節點（`irgSecretarySelectGroupTask` / `irgMembersVoteTask` / `irgSecretaryReviewSummaryTask`）、VP 三節點（`vpSecretarySelectGroupTask` / `vpMembersVoteTask` / `vpSecretaryCheckConsensusTask`）、`chairPersonDecisionTask`。不在此清單的任務節點不主動推送，僅待辦列表出現。
> 收件人解析：優先用任務 assignee；無 assignee 時依 `supervisorUserIds` 流程變量；再無則由 BPMN 模型候選人計算。
> 存在 legacy 後備發送方法（`notifyMessageSendApi` + `quartzMailSendApi` 直發），現行主路徑為 B/D。

### 2.2 活動推廣審批 `activity_promotion_approval`

| 環節 / 觸發 | 收件對象 | 渠道 | 路徑 | 備註 |
|:--|:--|:--|:--:|:--|
| 申請提交確認 | 推廣建立人（`creator`） | 雙發* | D | `ACTIVITY_PROMOTION_APPLICATION_SUBMITTED`（DB 模板） |
| 待審推送（`supervisorApprovalTask` / `saoAdminTask` 創建） | 對應審核人 / 候選人 | 雙發* | D | `ACTIVITY_PROMOTION_REVIEW_NOTIFICATION`（DB 模板） |
| 審核通過 | 推廣建立人 | 雙發 | B | `BPM_ACTIVITY_PROMOTION_APPROVAL_APPROVED` |
| 拒絕 / 取消 | 推廣建立人 | 雙發 | B | `..._REJECTED` |

> \* 路徑 D 經 DB 模板發送者（提交確認、待審推送）最終渠道仍取決於對應 `notify_template.channels`（見 §1.3）。

### 2.3 活動報名 / 名單審批 `enrollment`

報名相關通知最密集，分「個人報名」與「名單批次審批」兩組。

**個人報名（`UnifiedNotificationService` 多語，路徑 A）：**

| 環節 / 觸發 | 收件對象 | 渠道 | 模板 |
|:--|:--|:--|:--|
| 新報名提交 | 活動組織者（`creatorId`） | 雙發* | `SLAS_NEW_ENROLLMENT_APPLICATION` |
| 報名通過 | 報名學生 | 雙發* | `ENROLLMENT_APPROVED` |
| 報名拒絕 | 報名學生 | 雙發* | `SLAS_ENROLLMENT_REJECTED` |
| 退回修改 | 報名學生 | 雙發* | `ENROLLMENT_RETURN_TO_MODIFY` |
| 撤回 | 報名學生 | 雙發* | `ENROLLMENT_WITHDRAWN` |
| 名額已滿 | 候補/相關學生 | 雙發* | `SLAS_ENROLLMENT_FULL_NOTIFICATION` |

> \* 實際渠道仍取決於對應 `notify_template.channels`（路徑 A 規則）。若只收到站內信，先檢查該模板的 `channels`。

**名單批次審批（`EnrollmentBpmEventListener`）：**

| 環節 / 觸發 | 收件對象 | 渠道 | 路徑 |
|:--|:--|:--|:--:|
| 待審推送（`supervisorApprove` 任務創建） | 該節點 supervisor / 候選人 | 雙發* | D（`SLAS_ENROLLMENT_LIST_REVIEW_NOTIFICATION`，DB 模板） |
| 其餘審批節點（coordinator 等）任務創建 | 對應候選人 | （僅待辦） | — |
| 名單通過 | **全體已報名學生**（批次） | 郵件 | A（批次） |
| 名單通過 | 活動組織者 | 雙發 | B |
| 名單拒絕 / 取消 | **全體 PENDING 學生**（批次） | 郵件 | A（批次） |
| 名單拒絕 / 取消 | 活動組織者 | 雙發 | B |
| 名單凍結 / 最終確認 | 模板配置對象 | 雙發* | A（`ENROLLMENT_FROZEN_NOTIFICATION` / `..._FINAL_CONFIRMED_NOTIFICATION`） |

### 2.4 活動報告 / 事故報告 `incident_report_audit`

事故報告通知由 `IncidentNotificationDispatcher` **統一雙發**（站內信 + 郵件，內容程式碼組裝）：

| 環節 / 觸發 | 收件對象 | 渠道 |
|:--|:--|:--|
| 提交確認 | 報告建立人 | 雙發 |
| 待 Supervisor 確認 | 活動 supervisor（清單） | 雙發 |
| Supervisor 確認（有/無事故） | 報告建立人 | 雙發 |
| Supervisor 退回 | 報告建立人 | 雙發 |
| 分類完成 | 報告人 + 全體 supervisor | 雙發 |
| 審批通過 / 拒絕 | 報告建立人 | 雙發 |
| Dean 審閱完成 | 活動 supervisor | 雙發 |
| 進度更新 | 報告建立人 | 雙發 |
| **管理層告警**（嚴重度 HIGH/MEDIUM） | Dean / SAO Admin / Custodian（roleId 129/120/130） | 雙發 |
| **每月提醒**（定時任務 `IncidentQuartzJobs`） | 配置角色清單 | 雙發 |

### 2.5 學生組織註冊 / 申訴 `student_org_*`（group 申請）

group 申請（`student_org_registration`）與申訴（`student_org_appeal`）的逐節點待審推送走路徑 D（`BpmTaskNotificationAsyncService.sendStudentGroupTaskNotification` → `StudentGroupNotificationService.sendPendingTaskNotification`）；其餘節點與終態經 `BpmNotificationDispatcher` 統一雙發，內容程式碼組裝：

| 環節 / 觸發 | 收件對象 | 渠道 | 路徑 |
|:--|:--|:--|:--:|
| 待審推送（任務創建 / 指派） | 該審批節點候選人 / 秘書指定的 checker | 雙發 | D |
| 成員申請 通過 / 拒絕 | 申請人（`member.userId`） | 站內信 | B |
| Summary 退回 / 意見提醒 / 拒絕確認提醒 | 對應審核人清單 | 雙發 | B |
| 流程完成（通過/退回/拒絕） | 發起人（申請人） | 雙發 | B |
| 拒絕子流程啟動 | Summary 審核人（role 138） | 雙發 | B |
| 拒絕最終結果（可操作組 / 知會組） | 申請人/協作者/checker（role 136/132）；審批人/秘書等 | 雙發 | B |

> **待審推送覆蓋的節點**（`STUGROUP_NOTIFICATION_TASK_KEYS`）：註冊主流程 `secretaryCheckTask` / `adminCheckTask` / `academicCheckTask` / `collectOpinionsTask` / `summaryReviewTask` / `finalApprovalTask`；申訴退回重提 `studentResubmitTask`；拒絕子流程 `draftRejectionOpinionTask` / `reviewerConfirmOpinionTask` / `summaryReviewerReviewTask` / `secretaryFinalSubmitTask`。
> 收件人解析：優先用任務 assignee；`adminCheckTask` / `academicCheckTask` 等 checker 節點改用秘書經 `updateReviewer` 設定的 checker 變量（從 `runtimeService` 重新讀取最新流程變量，避免快照過時）；再無則由 BPMN 模型候選人計算。
> 與活動申請不同，group 申請**沒有**獨立的「已提交」確認推送；申請人首先收到的是流程完成（路徑 B）或成員申請結果通知。

### 2.6 培訓 `training`

| 環節 / 觸發 | 收件對象 | 渠道 | 備註 |
|:--|:--|:--|:--|
| 合規審批 通過 / 拒絕 | 培訓參與者 | 站內信 | ⚠️ **未完成**：當前 `TrainingBpmEventListener` 收件人 `userId` 硬編碼為 `1L`，且未接郵件——需補實參與者解析 |

### 2.7 嘉賓 `guest`

嘉賓多為非系統用戶，以**郵箱字串**直發郵件：

| 環節 / 觸發 | 收件對象 | 渠道 | 模板 |
|:--|:--|:--|:--|
| 邀請嘉賓 | 嘉賓聯絡郵箱 | 郵件 | `GUEST_INVITATION` |
| 審批後建立嘉賓帳號 | 新嘉賓用戶 | 郵件 | `ACTIVITY_GUEST_WELCOME` |
| Coordinator 代建帳號 | 嘉賓聯絡郵箱 | 郵件 | `GUEST_ACCOUNT_CREATED` |

### 2.8 定時提醒任務（`ActivityReminderJob` 等）

走路徑 A（模板渠道），多數雙發；收件對象視提醒性質而定：

| 任務 / 觸發 | 收件對象 | 渠道 | 模板 |
|:--|:--|:--|:--|
| 活動前 24h / 2h 提醒 | 全體已通過報名者 | 雙發* | `SLAS_ACTIVITY_24H_REMINDER` / `..._2H_REMINDER` |
| 簽到 / 簽退提醒 | 未簽到 / 未簽退者 | 雙發* | `SLAS_CHECK_IN_REMINDER` / `..._CHECK_OUT_REMINDER` |
| 報名開放提醒 | 活動組織者 | 雙發* | `SLAS_ACTIVITY_REGISTRATION_OPENED` |
| 報告提交提醒（結束後 3 天） | 活動組織者 | 雙發* | `SLAS_ACTIVITY_REPORT_SUBMISSION_REMINDER` |
| 自動標記缺席（`AutoMarkAbsentJob`） | 活動組織者 | 郵件 | `ABSENT_NOTIFICATION` |
| 審核窗口結束提醒（`ReviewWindowEndJob`） | 活動組織者 | 郵件 | `REVIEW_WINDOW_REMINDER` |
| 活動完成通知（結束後 2-4h） | 已簽到參與者 | 雙發* | `SLAS_ACTIVITY_COMPLETED_TO_STUDENT` |

> \* 同樣最終取決於模板 `channels`。

---

## 3. 已知缺口與排查注意事項

1. **「站內信有、郵件沒有」**：多半是路徑 A 的 `notify_template.channels` 設成 `1`（僅站內信）。路徑 B（BPM 完成通知）不受此影響，恆定雙發。
2. **培訓合規通知未完成**：收件人硬編碼 `userId=1L`、未接郵件，Demo 時培訓審批通知不可信。
3. **三套機制並存**：同一個「審批通過」可能由 BPM 完成路徑（B，雙發、程式碼內容）發出，與路徑 A 的資料庫模板無關；改模板不會影響 B 的內容/渠道。
4. **郵箱解析失敗即跳過郵件**：若收件人在 admin 與 member 兩處都查不到郵箱，郵件靜默跳過（僅記日誌），站內信仍可能成功。
5. **批次名單通知對學生只發郵件**：名單通過/拒絕對「全體學生」是批次郵件；組織者另收一條雙發。學生若關注站內信中心，批次結果不一定出現在那裡。
6. **角色 roleId 硬編碼**（事故管理層告警 129/120/130 等）：若角色表調整，收件群需同步核對。
7. **路徑 D 另含兩個本文未逐節點展開的流程**：活動總結審批 `activity_summary_approval`（節點 `supervisorReviewTask` / `revisionTask` / `vettingPanelTask` / `majorRevisionTask`）與嘉賓邀請審核 `guest_invitation_review`（節點 `supervisorReviewTask` / `coordinatorCreateAccountTask` / `guestResponseTask`）也會在任務創建時推送待審通知；§2.7 僅列了嘉賓的郵件邀請環節，審核任務推送待補。
