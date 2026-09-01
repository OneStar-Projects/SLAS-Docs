# 學生組織流程全流程 Demo 指南

> 本文檔面向 Demo 執行人、UAT 測試人與業務培訓人員，目標是讓使用者**不依賴開發人員陪同**，也能完整走完：
>
> 1. 學生組織註冊主流程
> 2. 拒絕／退回子流程
> 3. 註冊申訴流程
> 4. Reviewer Management（評審員管理）

---

## 1. Demo 目標

本次 `org` Demo 建議至少覆蓋以下 3 條主線：

1. **註冊通過主線**
   - 覆蓋：`Registration Administrator → Registration Checker → Registration Referrer → Registration Reviewer → Registration Endorser → Registration Approver`

2. **註冊拒絕／退回子流程**
   - 覆蓋：`Registration Approver -> Rejection Draft -> Reviewer Confirm -> Registration Endorser Review -> Secretary Final Submit`

3. **申訴主線**
   - 覆蓋：`Registration Appeal Reviewer → Registration Appeal Endorser → Registration Appeal Approver`

如時間允許，可再補演示：

4. **Reviewer Management**
   - 演示如何替換 `Registration Checker` / `Registration Referrer`

---

## 2. 參與角色

建議至少準備以下帳號：

| Demo 角色 | 建議系統角色 / 身份 | 用途 |
|:---|:---|:---|
| 註冊申請人 | `Group Leader` | 提交學生組織註冊申請 |
| Registration Administrator | `Registration Administrator` | 初審、指派 Reviewer |
| Registration Checker | `Registration Checker` | 行政審核 |
| Registration Referrer | `Registration Referrer` | 學術審核 |
| Registration Reviewer 1 / 2 / 3 | `Registration Reviewer` | 收集意見 / 拒絕意見確認 |
| Registration Endorser | `Registration Endorser` | 匯總審核 / 拒絕草擬意見審核 |
| Registration Approver | `Registration Approver` | 最終審批 |
| Registration Approver Secretary | `Student Group Registration Approver Secretary` | 最終審批備選 |
| 申訴申請人 | `Group Leader` | 發起申訴 |
| Registration Appeal Reviewer 1 / 2 / 3 | `Registration Appeal Reviewer` | 收集申訴意見 |
| Registration Appeal Endorser | `Registration Appeal Endorser` | 匯總審核 |
| Registration Appeal Approver | `Registration Appeal Approver` | 最終申訴審批 |
| Registration Appeal Approver Secretary | `Student Group Appeal Approver Secretary` | 最終申訴審批備選 |

> 如果環境仍顯示舊角色名稱，例如 `Student Group Registration Secretary`、`Student Group Registration Summary Reviewer`，請按其**等價最新角色名稱**理解。

### 2.1 DEV Demo 帳號清單

> DEV 請使用**本地帳號**方式登入，預設密碼：`admin123`
>
> **2026-08 起的前置條件**：帳密登入對 `USER_SOURCE = SSO` 的帳號受系統參數 `sso.user.allow_default_password` 管控——該值為 `false`（或讀取失敗）時一律擋下，只能走 SSO。DEV / UAT 請先確認此值為 `true`，否則下表帳號可能登不進去。

#### 2.1.1 註冊審批帳號

| 用戶名 | 角色 ID | 最新角色名稱 | Delegate | 審批節點 | 備註 |
|:---|:---:|:---|:---:|:---|:---|
| `S1132367` | - | Group Leader | N | 發起申請 | 註冊申請人 |
| `hro-test-093` | 122 | Registration Administrator | N | Node 1: 秘書審核 | 初審 |
| `hro-test-105` | 136 | Registration Checker | N | Node 2: 行政審核 | 行政 |
| `ro-test-102` | 132 | Registration Referrer | N | Node 3: 學術審核 | 學術 |
| `hro-test-094` | 123 | Registration Reviewer | N | Node 4: 收集意見（多實例） | Reviewer 1 |
| `hro-test-095` | 123 | Registration Reviewer | N | Node 4: 收集意見（多實例） | Reviewer 2 |
| `hro-test-096` | 123 | Registration Reviewer | N | Node 4: 收集意見（多實例） | Reviewer 3 |
| `hro-test-106` | 138 | Registration Endorser | N | Node 5: 匯總審核 | Summary |
| `hro-test-097` | 124 | Registration Approver | Y | Node 6: 最終審批 | Final Approver |
| `hro-test-103` | 134 | Student Group Registration Approver Secretary | - | Node 6: 最終審批（備選） | 備用 |

#### 2.1.2 註冊申訴審批帳號

| 用戶名 | 角色 ID | 最新角色名稱 | Delegate | 審批節點 | 備註 |
|:---|:---:|:---|:---:|:---|:---|
| `S1132367` | - | Group Leader | N | 發起申訴 | 申訴發起人 |
| `hro-test-098` | 125 | Registration Appeal Reviewer | N | Node 1: 收集意見（多實例） | Reviewer 1 |
| `hro-test-099` | 125 | Registration Appeal Reviewer | N | Node 1: 收集意見（多實例） | Reviewer 2 |
| `hro-test-100` | 125 | Registration Appeal Reviewer | N | Node 1: 收集意見（多實例） | Reviewer 3 |
| `hro-test-107` | 139 | Registration Appeal Endorser | N | Node 2: 匯總審核 | Summary |
| `hro-test-101` | 126 | Registration Appeal Approver | Y | Node 3: 最終審批 | Final Approver |
| `hro-test-104` | 135 | Student Group Appeal Approver Secretary | - | Node 3: 最終審批（備選） | 備用 |

#### 2.1.3 其他可用 Group Leader 帳號

- `S1155707`
- `S1154233`
- `S1155654`
- `S1155751`
- `S1155738`
- `S1155923`

### 2.2 建議切號順序

如果只有 1 台電腦演示，建議按下面順序切換帳號：

1. 註冊申請人
2. Registration Administrator
3. Registration Checker
4. Registration Referrer
5. Registration Reviewer 1
6. Registration Reviewer 2
7. Registration Reviewer 3
8. Registration Endorser
9. Registration Approver
10. Registration Administrator
11. Registration Reviewer 1
12. Registration Reviewer 2
13. Registration Reviewer 3
14. Registration Endorser
15. Registration Administrator
16. 申訴申請人
17. Registration Appeal Reviewer 1
18. Registration Appeal Reviewer 2
19. Registration Appeal Reviewer 3
20. Registration Appeal Endorser
21. Registration Appeal Approver

### 2.3 切號執行備忘

1. 每個帳號都先完成至少一次登入。
2. 只有上一個節點提交成功，下一個節點才會收到待辦。
3. Registration 流程的 `122 / 136 / 132` 是順序審核，不要跳過。
4. `123` 和 `125` 都是多實例並行，Demo 時至少切 2–3 個 Reviewer 帳號。
5. 若要演示 Reviewer Management，請在 `122` 完成指派後、`136 / 132` 處理前進行。

---

## 3. 演示前準備

### 3.1 一次性系統配置

在開始 Demo 前，先確認以下條件：

1. **註冊申請人可建立或載入一筆學生組織註冊申請**
   - 可是全新申請
   - 也可以是已退回後重新編輯的申請

2. **註冊審批帳號都能看到待辦**
   - `122 / 136 / 132 / 123 / 138 / 124 / 134`

3. **申訴帳號都能看到待辦**
   - `125 / 139 / 126 / 135`

4. **Reviewer Management 功能可进入**
   - 菜單位置：`管理中心 → 評審員管理`

5. **演示用申請建議具備完整表單內容**
   - 組別基本資料
   - Membership / EXCO / 初始活動草稿等

### 3.2 建議示範資料

建議先準備一筆“容易演示”的註冊申請：

1. 基本資料完整
2. 附件已上傳
3. 至少 3 名 reviewer 可共同評審
4. 申請人知道如何重新提交被退回資料

### 3.3 頁面入口速查

為避免 Demo 時臨場找不到入口，建議先記住以下頁面：

1. **學生組織註冊頁**
   - 路由：`/student/StudentGroupRegister`
   - 用途：新建註冊申請、修改並重新提交
   - 補充：若是 `pending_resubmit`，系統會帶 `resubmitGroupId`

2. **學生組織申訴頁**
   - 路由：`/student/group-appeal?id=<groupId>`
   - 用途：發起申訴、重新提交申訴
   - 補充：申請人也可從 `My Group` 頁面點 `Appeal / Resubmit Appeal`

3. **學生組織審批詳情頁**
   - 路由：`/bpm/student-group-review`
   - 用途：各審批角色打開待辦後處理任務
   - 補充：通常從 `BPM To-do` 點入，不需要手工拼路由

4. **Reviewer Management**
   - 頁面：`管理中心 → 評審員管理`
   - 用途：替換 `Registration Checker / Registration Referrer`

---

## 4. 註冊主線 Demo

### 4.1 申請人：提交學生組織註冊申請

1. 使用 `Group Leader` 登入。
2. 進入 `Student Group Register` 頁面。
3. 依序完成 6 個步驟：
   - `Application Cover`
   - `Organisation Information`
   - `Governing Body / Correspondence`
   - `Annual Operation`
   - `Supporting Documents`
   - `Review & Submit`
4. 在最後一步確認預覽內容後，點擊 `Submit`。

預期結果：

1. 流程啟動。
2. `Registration Administrator` 收到待辦。

### 4.2 Registration Administrator：初審

1. 進入 `BPM To-do`，打開學生組織待辦。
2. 進入 `Student Group Review` 詳情頁。
3. 在 `approval-decision-panel` 中檢查資料。
4. 指派：
   - 1 名 `Registration Checker`
   - 1 名 `Registration Referrer`
5. 點擊 `Select Admin` / `Select Academic` 完成指派。
6. 選擇 `Approve` 並提交。

預期結果：

1. `Registration Checker` 收到行政審核待辦。
2. `Registration Referrer` 还需等待行政通过后才会收到待办。

### 4.3 Registration Checker：行政審核

1. 從 `BPM To-do` 打開 `Admin Check`。
2. 在審批操作區選擇 `Approve`。
3. 如有需要填寫 comment。
4. 提交。

預期結果：

1. `Registration Referrer` 收到學術審核待辦。

### 4.4 Registration Referrer：學術審核

1. 從 `BPM To-do` 打開 `Academic Check`。
2. 在審批操作區選擇 `Approve`。
3. 如有需要填寫 comment。
4. 提交。

預期結果：

1. `Registration Reviewer` 群組收到並行收集意見任務。

### 4.5 Registration Reviewers：收集意見

1. 依序切到 `hro-test-094 / 095 / 096`。
2. 打開 `Student Group Review` 頁面中的 `Collect Opinions` 表單。
3. 每位 reviewer 選擇 `APPROVE / REJECT` 並填寫意見。
4. 點擊 `Submit`。

預期結果：

1. 全部 reviewer 完成後，系統自動彙總意見。
2. `Registration Endorser` 收到匯總審核任務。

### 4.6 Registration Endorser：匯總審核

1. 打開待辦中的 `Summary Review`。
2. 查看 reviewer 意見摘要與 AI Summary Panel。
3. 填寫 summary comment。
4. 點擊 `Submit`。

預期結果：

1. `Registration Approver` 收到最終審批任務。

### 4.7 Registration Approver：最終審批

1. 打開待辦中的 `Final Approval`。
2. 選擇 `Approve`。
3. 如有需要填寫最終 comment。
4. 提交。

預期結果：

1. 流程結束為 `ACTIVE`。
2. 學生組織狀態變為正式有效。

---

## 5. 註冊拒絕／退回子流程 Demo

### 5.1 觸發方式

在 `Registration Approver` 的 `Final Approval` 節點：

1. 選擇 `Reject` 或 `Return`
2. 提交

預期結果：

1. 進入拒絕／退回意見子流程。

### 5.2 Registration Administrator：起草綜合意見

1. 打開 `Draft Rejection Opinion`。
2. 填寫綜合意見。
3. 設定 circulation / reminder 相關天數。
4. 點擊 `Submit`。

### 5.3 Registration Reviewers：確認意見

1. `hro-test-094 / 095 / 096` 依序登入。
2. 打開 `Rejection Opinion Feedback` 表單。
3. 對綜合意見作 `APPROVE / SUGGEST / NO_COMMENT` 反饋。
4. 若選 `SUGGEST`，補充修改建議後提交。

### 5.4 Registration Endorser：審核草擬意見

1. `Registration Endorser` 打開 `summaryReviewerReviewTask`。
2. 查看 reviewer 反饋摘要。
3. 填寫 review comment。
4. 點擊 `Submit`。

### 5.5 Registration Administrator：最終提交意見

1. 回到 `Registration Administrator`。
2. 打開 `secretaryFinalSubmitTask`。
3. 最終確認意見內容。
4. 確認 `finalContent` 已填寫完整。
5. 點擊 `Submit`。

預期結果：

1. 若原決策是 `return`：流程結束為 `PENDING_RESUBMIT`
2. 若原決策是 `reject`：流程結束為 `REJECTED_FINAL`

---

## 6. 申訴主線 Demo

### 6.1 Group Leader：發起申訴

前提：學生組織狀態已是 `REJECTED_FINAL`。

1. 使用 `Group Leader` 登入。
2. 透過以下任一入口進入申訴：
   - `My Group` 頁面點 `Appeal`
   - 或直接打開 `/student/group-appeal?id=<groupId>`
3. 在申訴頁填寫 `Appeal Reason`。
4. 點擊 `Submit`。

預期結果：

1. `Registration Appeal Reviewer` 群組收到並行待辦。

### 6.2 Registration Appeal Reviewers：收集申訴意見

1. 依序切到 `hro-test-098 / 099 / 100`。
2. 每位 reviewer 提交申訴審核意見。

預期結果：

1. 全部 reviewer 完成後，系統自動彙總意見。
2. `Registration Appeal Endorser` 收到匯總審核任務。

### 6.3 Registration Appeal Endorser：匯總審核

1. 打開申訴流程中的 `Summary Review`。
2. 查看 reviewer 意見與摘要。
3. 選擇：
   - `Submit`：送最終審批
   - `Return`：結束為 `APPEAL_RESUBMIT`

### 6.4 Registration Appeal Approver：最終申訴審批

1. 打開 `Final Approval`。
2. 選擇：
   - `Approve` → `ACTIVE`
   - `Reject` → `APPEAL_REJECTED`
   - `Return` → `APPEAL_RESUBMIT`
3. 提交。

---

## 7. Reviewer Management Demo

### 7.1 演示目標

演示 `Registration Administrator` 如何在註冊流程中替換：

1. `Registration Checker`
2. `Registration Referrer`

### 7.2 建議演示時機

最適合在下列時機進行：

1. `Registration Administrator` 已完成初審并指派 reviewer
2. `Registration Checker / Registration Referrer` 尚未开始处理待办

### 7.3 操作步骤

1. 使用有权限的账号进入 `管理中心 → 評審員管理`
2. 可先按：
   - `Group Name`
   - `Task Node`
   - `Registration Type`
   过滤目标申请
3. 查看当前：
   - `Registration Checker`
   - `Registration Referrer`
4. 点 `Modify Reviewer`
5. 使用 `Select Admin` / `Select Academic` 选择新的替代人选
6. 填写变更原因
7. 提交变更

預期結果：

1. 原 reviewer 不再看到待办
2. 新 reviewer 在待办中心接手任务

---

## 8. Demo 完成后的验收点

1. 注册主线完成后，状态应为 `ACTIVE`
2. 注册退回后，状态应为 `PENDING_RESUBMIT`
3. 注册终局拒绝后，状态应为 `REJECTED_FINAL`
4. 申诉退回后，状态应为 `APPEAL_RESUBMIT`
5. 申诉拒绝后，状态应为 `APPEAL_REJECTED`
6. Reviewer Management 替换后，新旧 reviewer 的待办归属应发生变化

---

## 9. 常見卡點與排查

### 9.1 `Registration Checker` / `Registration Referrer` 没收到任务

检查：

1. `Registration Administrator` 是否真的完成了初审并提交
2. reviewer 是否被正确指派
3. 是否有人通过 Reviewer Management 替换过该 reviewer

### 9.2 `Registration Reviewer` 多实例只出现一人

检查：

1. `123` 角色下是否真的有多名有效用户
2. BPM 环境中的候选组同步是否正常

### 9.3 `Registration Endorser` / `Registration Appeal Endorser` 看不到摘要

检查：

1. 前置 reviewer 是否已经全部完成
2. 是否触发了 timeout 分支但没有正常汇总

### 9.4 申诉入口不可见

检查：

1. 当前组织状态是否为 `REJECTED_FINAL`
2. 申诉账号是否有对应权限

### 9.5 最终提交时报 `finalContent` 必填

检查：

1. `secretaryFinalSubmitTask` 页面是否已补充最终意见
2. `Registration Endorser` 是否已先完成 `summaryReviewerReviewTask`

---

## 10. 關聯文檔

如需查看流程图和节点定义，可配合阅读：

- [student-org-workflow-flowcharts.md](./student-org-workflow-flowcharts.md)
