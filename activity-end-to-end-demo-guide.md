# 活動流程全流程 Demo 指南

> 本文檔面向 Demo 執行人、UAT 測試人與業務培訓人員，目標是讓使用者**不依賴開發人員陪同**，也能從活動草稿一路走到最終審批完成。
>
> 本指南基於 `SLAS_PRO` / `SLAS_UI` 當前實現撰寫。
> 需注意：最新 guest 流程已拆成 `Dean / Delegate 背書` + `VP(RD) / VP(RD) Delegate 最終審批`。  
> `非 NSOA` 會在一般高級審批後進入 `VP(RD)`；`NSOA` 會在 `Chair PASS` 後進入 `VP(RD)`。
> 文中按最新 `SYSTEM_ROLE.NAME` 使用 `VP(RD)` / `VP(RD) Delegate`；流程實作與部分 UI 仍常寫作 `VPRD / VPRD Delegate`。

---

## 1. Demo 目標

本次 Demo 建議拆成兩條主線：

1. **NSOA 主線**
   - 覆蓋：`Coordinator → Checker → Supervisors → EO → Dean/Delegate Guest Endorsement → Dean/Delegate Sponsorship → Dean/Delegate Activity Content Approval → IRG → VP → Chair → VP(RD) / VP(RD) Delegate`
2. **非 NSOA 主線**
   - 覆蓋：`Coordinator → Checker → Supervisors → EO → Dean/Delegate Guest Endorsement → Dean/Delegate Sponsorship → Dean/Delegate Activity Content Approval → VP(RD) / VP(RD) Delegate`

> 說明：`Dean / Delegate Activity Content Approval`（活動內容 / 預算審批）為**必經**節點，無論活動是否有嘉賓或贊助，Supervisor 通過後都會進入此節，由 `Dean` 或 `Delegate` 做 `Approve / Return / Reject` 決定。`Guest Endorsement` 與 `Sponsorship Approval` 則為條件節點，僅在有嘉賓 / 贊助時觸發。

若時間有限，可優先演示 NSOA 主線；它能覆蓋 `IRG / VP / Chair` 以及 `VP(RD)` 最終嘉賓審批。

共同準備條件：

1. 申請人從零建立一個活動草稿，或從歷史申請複製一份作為起點。
2. 活動包含：
   - 有外部嘉賓
   - 有贊助
   - 需要經過 OC 成員認可
3. Coordinator 指派：
   - 1 名 Checker
   - 多名 Supervisors
4. Supervisor 至少有 1 人勾選場地相關確認，以觸發 EO。
5. `NSOA = Yes` 時，覆蓋 IRG / VP / Chair。
6. `NSOA = No` 時，可快速覆蓋一般高級審批後的 `VP(RD) / VP(RD) Delegate` 最終嘉賓審批。

---

## 2. 參與角色

建議至少準備以下帳號：

| Demo 角色 | 建議系統角色 / 身份 | 用途 |
|:---|:---|:---|
| 申請人 | `Group Leader` / 活動建立人 | 建立草稿、提交申請 |
| OC 成員 A / B | 活動 OC 成員 | 完成 OC Endorsement |
| Coordinator | `Coordinator` | 初審、指派 Checker / Supervisors |
| Activity Application Checker | `Activity Application Checker` | 詳細審查 |
| Supervisor 1 / 2 | `Supervisor` | 並行投票與確認 |
| EO Venue Reviewer | `EO Venue Reviewer` | EO 審批 |
| Dean / Delegate | `Dean` / `Delegate` | 嘉賓背書 / 贊助審批 / 活動內容審批（必經） |
| VP(RD) / VP(RD) Delegate | `VP(RD)` 或 `VP(RD) Delegate` | 外部嘉賓審批 |
| IRG Secretary | `IRG Secretary` | 選 IRG group、審核 IRG 摘要 |
| IRG Member 1 / 2 | `IRG Member` | IRG 投票 |
| VPSLA Secretary | `VPSLA Secretary` | 選 VP group、檢查共識 |
| VPSLA Member 1 / 2 | `VPSLA Member` | VP 投票 |
| VP ChairPerson | `VPSLA Member`（在 VP group 中設為 `CHAIRPERSON`） | 最終決定 |

> 如果你的環境仍顯示舊角色名稱，請使用其**等價角色**即可；本指南優先使用最新 `SYSTEM_ROLE.NAME` 口徑。

### 2.1 DEV Demo 帳號清單

> DEV 請使用**本地帳號**方式登入，預設密碼：`admin123`

#### 2.1.1 活動申請審批帳號

| 用戶名 | 角色 ID | 最新角色名稱 | Delegate | 審批節點 | 備註 |
|:---|:---:|:---|:---:|:---|:---|
| `S1132367` | - | Group Leader | N | 發起申請 | 申請人 |
| `hro-test-071` | 115 | Coordinator | N | 活動協調審核 | 一審 / 指派 Checker |
| `hro-test-072` | 141 | EO Venue Reviewer | N | 場地審批 | EO |
| `hro-test-073` | 142 | Activity Application Checker | N | 活動審核 | Checker |
| `hro-test-074` | 116 | Supervisor | N | 主管投票（多實例） | Supervisor 1 |
| `hro-test-075` | 116 | Supervisor | N | 主管投票（多實例） | Supervisor 2 |
| `hro-test-076` | 116 | Supervisor | N | 主管投票（多實例） | Supervisor 3 |
| `hro-test-091` | 149 | Dean | Y | 嘉賓背書 / 贊助審批 / 活動內容審批 | Guest Endorsement / Sponsorship / Activity Content Approval |
| `hro-test-092` | 150 | Delegate | - | 嘉賓背書 / 贊助審批 / 活動內容審批 | 與 Dean 共用候選組，先到先審 |
| `hro-test-077` | 144 | IRG Secretary | N | IRG 秘書 | IRG 選組 / 摘要審核 |
| `hro-test-078 ~ hro-test-082` | 145 | IRG Member | N | IRG 成員投票（多實例） | IRG 投票 |
| `hro-test-083` | 146 | VPSLA Secretary | N | VP 秘書 | VP Select Group / VP Check Consensus |
| `hro-test-084 ~ hro-test-088` | 147 | VPSLA Member | N | VP 成員投票（多實例） | VP Vote |
| `hro-test-089` | 147 | VPSLA Member / VP ChairPerson | Y | VP 主席決定 | 需在 VP Group 中設為 `CHAIRPERSON` |
| `hro-test-109` | 151 | VP(RD) | Y | 嘉賓審批 | 新口徑下承接最終嘉賓審批 |
| `hro-test-110` | 152 | VP(RD) Delegate | Y | 嘉賓審批（委派） | 新口徑下承接最終嘉賓審批（委派） |

> `Head (148)` 目前仍存在於角色表中，但按最新 `activity_publish` BPMN 與運行時變量，**標準活動發布主線不使用 148 作為贊助或嘉賓審批候選組**。  
> 標準 Demo 請以 `Dean (149)`、`Delegate (150)` 為準。

#### 2.1.2 OC Endorsement 帳號

| 用戶名 | 角色 ID | 最新角色名稱 | Delegate | 審批節點 | 備註 |
|:---|:---:|:---|:---:|:---|:---|
| `S1132367` | `11323677` | Group Leader | N | Student Group Leader（活動建立者） | 申請人 |

> `OC Endorsement` 需另外準備 2 名實際在該活動 `OC` 名單內的 `Group Leader` 帳號。  
> 先前文檔中的 `S1132368 / S1132369` 已移除，後續請按實際演示名單補入。

### 2.2 建議切號順序

如果只有 1 台電腦演示，建議按下面順序切換帳號：

1. 申請人
2. 實際 OC 成員 A
3. 實際 OC 成員 B
4. 申請人
5. Coordinator
6. Activity Application Checker
7. Supervisor 1
8. Supervisor 2
9. EO Venue Reviewer
10. Dean / Delegate
11. VP(RD) / VP(RD) Delegate
12. IRG Secretary
13. IRG Member 1
14. IRG Member 2
15. IRG Secretary
16. VPSLA Secretary
17. VPSLA Member 1
18. VPSLA Member 2
19. VPSLA Secretary
20. VP ChairPerson
21. 申請人

### 2.3 切號執行備忘

為避免 Demo 中斷，建議事先確認：

1. 每個帳號都已完成至少一次登入，避免臨時卡在首次驗證或密碼過期。
2. 如果使用同一瀏覽器切號，請先準備：
   - 1 個正常視窗
   - 1 個無痕視窗
   - 或多個 Browser Profile
3. 每切換一個審批角色前，先確認上一位已經成功提交，否則下一個人可能看不到待辦。
4. VP / IRG 相關帳號最容易卡住，請提前驗證：
   - 是否在對應 group 內
   - group 是否為 enabled
   - 是否已配置 `CHAIRPERSON`
5. 如果要做 20 分鐘內的快演示，建議把登入憑證按順序貼在一張清單上，格式例如：
   - `角色 / 用戶名 / 密碼 / 是否需 MFA / 任務節點`

---

## 3. 演示前準備

### 3.1 一次性系統配置

在開始 Demo 前，先確認以下配置已完成：

1. **IRG Group 已建立且啟用**
   - 入口：`Activity Configuration` → `IRG Group Management`
   - 建議建立 `IRG Demo Group`
   - 至少包含：
     - 1 名 `SECRETARY`
     - 2 名 `MEMBER`
   - 建議建立步驟：
     1. 打開 `IRG Group Management`
     2. 點擊 `Create IRG Group`
     3. 填寫：
        - `Name`：例如 `IRG Demo Group`
        - `Name TC / Name SC`：可按環境需要填寫
        - `Description`：例如 `Demo use only`
        - `Status`：選 `Enabled`
        - `Sort`：填一個容易辨識的序號，例如 `1`
     4. 儲存後回到列表頁
     5. 點擊該 group 的 `Members`
     6. 依序新增：
        - 1 名 `SECRETARY`
        - 2 名 `MEMBER`
     7. 確認成員列表顯示正確，且 group 狀態為 `Enabled`

2. **VP Group 已建立且啟用**
   - 入口：`Activity Configuration` → `Vetting Panel Group Management`
   - 建議建立 `VP Demo Group`
   - 至少包含：
     - 1 名 `SECRETARY`
     - 1 名 `CHAIRPERSON`
     - 2 名 `MEMBER`
   - 建議建立步驟：
     1. 打開 `Vetting Panel Group Management`
     2. 點擊 `Create Vetting Panel Group`
     3. 填寫：
        - `Name`：例如 `VP Demo Group`
        - `Name TC / Name SC`：可按環境需要填寫
        - `Description`：例如 `Demo use only`
        - `Status`：選 `Enabled`
        - `Sort`：填一個容易辨識的序號，例如 `1`
     4. 儲存後回到列表頁
     5. 點擊該 group 的 `Members`
     6. 依序新增：
        - 1 名 `SECRETARY`
        - 1 名 `CHAIRPERSON`
        - 2 名 `MEMBER`
     7. 確認頁面不再顯示 `noChairPerson` 警示
     8. 確認成員列表顯示正確，且 group 狀態為 `Enabled`
   - 補充說明：
     - 只有 `Enabled` 的 group 才會出現在 `IRG Select Group` / `VP Select Group` 下拉選單中
     - VP group 若沒有 `CHAIRPERSON`，後續 `Chair Decision` 無法正確承接

3. **Orientation Application Period 已開放**
   - 因本主線使用 `NSOA = Yes`
   - 需確認目前存在有效期中的 `Orientation Application Period`
   - 否則活動在非草稿提交時會被拒絕

4. **相關帳號具備登入與待辦權限**
   - 所有 Demo 參與者都能登入
   - 所有審批人都能看到 BPM 待辦

5. **Checker / Supervisor / EO / Dean / Delegate / Guest 審批帳號可用**
   - Coordinator 頁面能查到 Checker / Supervisor
   - `Dean / Delegate` 能接收 Guest Endorsement / Sponsorship / Activity Content Approval 任務
   - `VP(RD)` / `VP(RD) Delegate` 帳號能接收最終嘉賓審批任務

6. **活動編輯鎖已啟用**
   - 最新代碼已加入活動表單 editing lock
   - 編輯既有活動時，前端會先嘗試取得 30 分鐘編輯鎖
   - 同一時間建議只由 1 名申請人或 1 名 OC 成員編輯同一筆活動
   - 若拿鎖失敗，當前 UI 會顯示錯誤訊息並跳回活動列表，而不是在原頁面顯示只讀鎖定狀態

### 3.2 建議示範活動資料

建議建立一個專用 Demo 活動，例如：

| 欄位 | 建議值 |
|:---|:---|
| Title | `2026 NSOA Demo Camp` |
| Student Group | 任一已啟用學生組織 |
| `isNsoa` | `Yes` |
| External Guest | `Yes`，至少新增 1 名外部嘉賓 |
| Sponsorship | `Yes` |
| OC Members | 申請人 + 2 名學生 |
| Activity Date | 未來 2–4 週內 |
| Venue | 校園場地 |
| Cover Image | 任意有效圖片 |
| Documents | 至少 1 份測試文件 |

> 如果想節省填表時間，可在第 1 步使用 **Copy from Previous**，但仍需手動調整 `NSOA`、嘉賓、贊助等觸發條件。

---

## 4. 主線 Demo 流程

### 4.1 申請人：建立草稿

1. 進入 `Create Activity` 頁面。
2. 在第 1 步 `Notice`：
   - 勾選閱讀確認。
   - 可選：點擊 `Copy from Previous`，選擇一筆自己過往已提交活動作為模板。
   - 點擊 `Save Draft`，驗證草稿保存成功。
3. 依序完成以下步驟：
   - `Applicant`
   - `Activity Basics`
   - `Programme & Logistics`
   - `Resources & Documents`
   - `External Guests`
   - `Preview`

> **編輯鎖提示**：如果你是打開一筆既有活動或草稿進行修改，系統可能先取得該活動的編輯鎖。Demo 中若多人輪流修改同一筆活動，請先由上一位使用者儲存或退出，避免被鎖定。
> 需注意：按當前實作，「退出頁面」本身不一定立即釋放鎖；最可靠的是先完成一次儲存 / 更新，否則可能需要等待 30 分鐘超時。

### 4.2 申請人：填寫關鍵觸發欄位

為確保完整主線都能被觸發，至少確認：

1. 在 `Applicant` 步驟：
   - `NSOA = Yes`
   - Student Group 正確
   - OC Members 至少 3 人

2. 在 `Activity Basics / Resources & Documents`：
   - 活動資料完整
   - 有贊助相關內容；Budget Plan 內贊助類 budget item 會展開醒目的 `Sponsorship details` 面板，可填 sponsor amount / source / description / terms 並上傳贊助附件
   - 贊助附件剛上傳後，即使尚未保存草稿，也應可在 `Preview` 中看到

3. 在 `External Guests`：
   - `nonEduhkInvolvement = Yes`
   - 至少建立 1 名外部嘉賓
   - Section XI `Documents Upload` 位於 External Guests 步驟下方，使用 compact upload 樣式

4. 在 `Preview`：
   - 確認所有校驗都通過
   - 看得到 `OC Endorsement` 面板

### 4.3 OC 成員：完成 OC Endorsement

> **編輯鎖與 endorse 模式說明**：申請人開啟編輯頁時系統會獲取一個 30 分鐘的編輯鎖（`POST /activity/acquire-editing`），其他 OC 進入 **編輯** 模式會被阻塞；但本步驟用的是 **endorse 模式**（從活動列表的 `Endorse` 按鈕進入，URL 帶 `mode=endorse`），endorse 模式**不申請鎖**，因此 OC 互審不會與申請人編輯衝突。詳見 `activity-publish-workflow-design.md §1.6 / §1.7`。

1. 申請人先停留在 `Preview` 頁面（持鎖）。
2. 依序用各 OC 成員帳號登入。
3. 每位 OC 成員從活動列表點 `Endorse` 進入該活動（**不要**點 `Edit`，否則會撞鎖）。
4. 該頁面只允許瀏覽 + endorsement，沒有 save / submit 按鈕。
5. 點擊 `Submit Endorsement`。
6. 直到狀態變成 `all endorsed`。

預期結果：

1. `OC Endorsement` 進度顯示全部完成。
2. 申請人可以正式提交活動申請。
3. Endorse 過程中申請人的編輯鎖維持有效，互不干擾。

### 4.4 申請人：提交活動

1. 回到申請人帳號。
2. 在 `Preview` 頁面點擊 `Submit`。
3. 確認提交成功。

預期結果：

1. 活動離開 `DRAFT`。
2. `activity_publish` 流程啟動。
3. Coordinator 在待辦中心收到第一個任務。

---

## 5. 審批端操作腳本

> 所有審批人都建議從 `My To-do / 待辦` 進入任務，並打開 `Activity Publish Review Detail` 頁面處理。

### 5.1 Coordinator：初審並指派 Checker / Supervisors

1. `Coordinator` 打開待辦中的 `Coordinator Review`。
2. 在表單中選擇：
   - `Approve`
   - `Assign Checker = Yes`
   - 選擇 1 名 Checker
   - 選擇 2 名 Supervisors
3. 提交。

預期結果：

- `Assign Checker = Yes`:Checker 收到任務(單實例,只一位 Checker)。此時 Supervisors **尚未**收到任務 — 必須等 Checker 通過後才會派發;屆時所選的多名 Supervisors 會 **multi-instance 並行** 各自收到一份任務。
- `Assign Checker = No`:跳過 Checker,所選的多名 Supervisors 立即 multi-instance 並行收到任務。

### 5.2 Checker：詳細審查

1. Checker 打開待辦中的 `Checker Review`。
2. 核對活動內容。
3. 選擇 `Approve`，可填備註。
4. 提交。

預期結果：

1. 流程前進到 Supervisor 並行審核。

### 5.3 Supervisors：並行投票

每位 Supervisor 都要處理自己的任務。

建議示範輸入：

1. `Decision = RECOMMEND`(也可選 `REJECT` / `RETURN` 示範非通過路徑)
2. Sponsorship 區塊：
   - `sponsorshipConfirmed = Yes`(如想觸發 §5.6 ⑥ 贊助審批,即使申請人未填贊助也能補救觸發,sticky-OR 寫入 `hasSponsorship` 流程變量,見設計文檔 §1.5.5)
   - 填 sponsor amount / source
3. Venue 區塊：
   - 至少 **1 名 Supervisor** 勾選場地相關確認，以便觸發 EO
4. ELAT 區塊：
   - 可根據 Demo 需要選 `Yes` 並填 category(僅留痕,不影響流程)
5. 填 comment
6. 提交

預期結果：

1. 所有 Supervisor 都提交後，系統聚合結果為 `RECOMMEND`。
2. 因至少 1 人觸發場地確認，流程進入 EO。

#### 5.3.1 聚合規則（多人投票示範時）

系統按 **first-wins 短路** 算最終 `supvAggregateDecision`:第一個投終局票(RETURN/REJECT)的 supervisor 說了算,即時取消其餘待辦(commit `82443a610`,詳設計文檔 §1.5.3.1):

| 投票情形(按時間先後) | 最終聚合 | 流程走向 |
|:--------|:--------|:--------|
| 全員 `RECOMMEND` | `RECOMMEND` | → ④ EO / ⑤ 嘉賓 / ⑥ 贊助 / ⑥' 內容 |
| 第一個 `RETURN`(其餘投不了)| `RETURN` | → `endEventReturned`,申請人可修改後重提 |
| 第一個 `REJECT`(其餘投不了)| `REJECT` | → `endEventRejected`,流程結束 |

> Demo 提示:
> - 演示 RETURN 路徑:讓第 1 位 Supervisor 投 `RETURN` → 立即短路,其餘 Supervisor 待辦消失,聚合 = `RETURN`。
> - 注意先後:若第 1 位投 `REJECT`、第 2 位想投 `RETURN`,**第 2 位已無待辦可投**,聚合 = `REJECT`(終局)。結果取決於誰先提交,不再有 RETURN 覆蓋 REJECT 的舊行為。

### 5.4 EO：場地審批

1. EO Reviewer 打開 `EO Approval`。
2. 核對活動資訊。
3. 選擇 `Approve`。
4. 提交。

預期結果：

1. 如有外部嘉賓，流程先進入 `Guest Endorsement`。
2. 如無外部嘉賓，流程會改進入 `Sponsorship Approval`（如有贊助）或直接進入 `Activity Content Approval`。

### 5.5 Dean / Delegate：外部嘉賓背書

> 自 commit `6213a252d` / `27d90191`（2026-05-15）起，Dean 端的 ⑤ / ⑥ / ⑥' 三個審批節點統一改為**三選項決策**：`Approve` / `Return` / `Reject`；前端使用 `DeanComboApprovalForm.vue`。

1. `Dean` 或 `Delegate` 打開 `Guest Endorsement`。
2. 核對外部嘉賓名單。
3. 三選一：
   - `Approve` → 進入 Sponsorship Approval（如活動有贊助）；無贊助則直接進入 `Activity Content Approval`。
   - `Return` → 退回 ③ Supervisor 重審（填寫退回原因）。
   - `Reject` → **流程直接結束**，狀態 `REJECTED`；申請人 + 歷史已參與審批的人員會收到通知。
4. 提交。

### 5.6 Dean / Delegate：贊助審批

1. `Dean` 或 `Delegate` 打開 `Sponsorship Approval`。
2. 查看贊助資訊區塊（金額 / 來源 / 描述 / 條款 / 附件）。贊助資訊在詳情卡中以獨立面板呈現，便於與普通 budget item 區分。
3. 三選一：
   - `Approve` → 進入 `Activity Content Approval`。
   - `Return` → 退回 ③ Supervisor 重審（UI 標籤：「退回監督員」）。
   - `Reject` → 流程結束 `REJECTED`（UI 標籤：「不同意並通知申請人」），通知申請人 + 歷史審批人。
4. 提交。

> ⚠️ **`Return` 與 `Reject` 不再等價**（這是 2026-05-15 之前的舊行為）。當前 BPMN 的 `flow_sponsorship_returned` → `supervisorsReviewTask`，`flow_sponsorship_rejected` → `endEventRejected`，是兩條獨立路徑。詳見設計文檔 §1.5.1。

#### 5.6.1 觸發條件 — supervisor 可在 ③ 補救觸發本節

本節是否出現由流程變量 `hasSponsorship` 決定,該變量採 sticky-OR 寫入(commit `3c653be94`, PR #125):

- **申請人提交時** `activity.hasSponsorship=true` → 進入本節
- **申請人提交時** `hasSponsorship=false`,但 **任一 supervisor 在 ③ 勾選 `sponsorshipConfirmed=true`** → sticky-OR 把 `hasSponsorship` 升級為 true → 進入本節
- 申請人 false 且 所有 supervisor 也沒勾選 → 跳過本節,直接進入 `Activity Content Approval`

> Demo 提示:若想演示「supervisor 補救觸發贊助審批」場景,讓申請人在 §4.2 把贊助欄位留空,然後在 §5.3 中讓任一 supervisor 勾選 `sponsorshipConfirmed=true`,本節即會出現。詳見設計文檔 §1.5.5。

### 5.6.5 Dean / Delegate：活動內容 / 預算審批（必經）

> 此節**無論**活動是否有嘉賓或贊助都會出現，Supervisor 通過後一定會走到。

1. `Dean` 或 `Delegate` 打開 `Activity Content Approval`。
2. 核對活動詳情、預算項目。
3. 三選一：
   - `Approve` → 進入下一階段（見下方預期結果）。
   - `Return` → 退回 ③ Supervisor 重審（標籤：「退回監督員」，需填退回原因）。
   - `Reject` → **直接終止流程**（標籤：「不同意並通知申請人」，需填不同意原因）。
4. 提交。提交前會根據按鈕類型彈出確認框（`Reject` 為紅色危險樣式）。

預期結果：

1. `Approve`：
   - `NSOA` 活動：進入 IRG / VP / Chair。
   - `非 NSOA` 活動：如有外部嘉賓進入 `VP(RD) / VP(RD) Delegate`，否則直接發布。
2. `Return`：
   - BPMN 走 `flow_activity_content_returned` → `supervisorsReviewTask`，回到 ③ Supervisor 重新審核。
   - 申請人不會直接收到「退回」通知，需等 Supervisor 重審聚合後才生效。
3. `Reject`（**自 2026-05-15 起與 Return 不再等價**）：
   - BPMN 走 `flow_activity_content_rejected` → `endEventRejected`，活動狀態變 `REJECTED`，流程結束。
   - 申請人 + 該流程歷史已參與審批的人員（IRG / VP / Supervisor 等）**都會收到「申請已被駁回」通知**，由 `BpmTaskNotificationAsyncService.notifyActivityPublishDeanRejectParticipants` 處理（commit `6213a252d`）。

### 5.7 VP(RD) / VP(RD) Delegate：最終外部嘉賓審批

VP(RD) 在此節點走專屬端點 `POST /activity/approval/guest/decision`（前端 `GuestApprovalForm.vue`），三選一：

| 決定 | 適用場景 | 後續走向 |
|:----|:--------|:--------|
| `APPROVE` | 通用 | 直接發布活動 → `APPROVED` |
| `RETURN_TO_DEAN` | **僅非 NSOA** | 退回 ⑥' Dean / Delegate 活動內容審批 |
| `RETURN_TO_CHAIR` | **僅 NSOA** | 退回 ⑭ Chair 重新決定 |

> ⚠️ 此節點**沒有 reject 路徑**——VP(RD) 不能在此直接駁回流程；如需駁回，由 NSOA 路徑下的 ⑭ Chair `REJECT` 完成，或由非 NSOA 路徑下退回 Dean 後再經 supervisor 重審觸發。

#### 5.7.1 場景 A：通過

1. `VP(RD)` 或 `VP(RD) Delegate` 打開 `Guest Approval`。
2. 核對外部嘉賓名單。
3. 選擇 `Approve` 並提交。

**預期結果**：流程直接發布活動。

#### 5.7.2 場景 B：退回 Dean（非 NSOA）

1. `VP(RD)` 打開 `Guest Approval`。
2. 選擇 `Return to Dean / Delegate` 並填寫意見。
3. 提交。

**預期結果**：

1. 任務退回 ⑥' Dean / Delegate 活動內容審批。
2. Dean / Delegate 看到新的 `Activity Content Approval` 待辦。
3. Dean 重新審批後，流程再次按 §1.5.1 的 RETURN 邏輯走（如 Dean 退回 → ③ Supervisor 重審）。

#### 5.7.3 場景 C：退回 Chair（NSOA）

1. `VP(RD)` 打開 `Guest Approval`。
2. 選擇 `Return to VP ChairPerson` 並填寫意見。
3. 提交。

**預期結果**：

1. 任務退回 ⑭ Chair。
2. ChairPerson 看到新的 `Final Decision` 待辦，可重新決定 `PASS / REJECT / RETURN`。
3. 若 Chair 再次 `PASS` 且活動仍有外部嘉賓，會再次回到 ⑦ VPRD（理論上有可能形成短循環，業務上請避免）。

#### 5.7.4 觸發條件回顧

- `非 NSOA`：本節在一般高級審批後出現。
- `NSOA`：本節在 `Chair PASS` 後出現。

---

## 6. IRG / VP / Chair 腳本

### 6.1 IRG Secretary：選擇 IRG Group

1. 打開 `IRG Select Group`。
2. 從下拉中選擇 `IRG Demo Group`。
3. 設定 vote deadline（流程變量 `irgVoteDeadline`,驅動超時 boundary timer event）。
4. 提交。

預期結果：

1. IRG Member 收到投票任務。

> **超時行為**(commit `7faa9acc2`, 2026-05-12):若 deadline 前未全部投票完成,系統 `activityIrgTimeoutDelegate` 把未投票者標記為預設 `RECOMMEND`,**跳過剩餘多實例任務**,直接進入「auto: AI 生成 IRG 摘要」 → ⑩ 摘要審核。Demo 中如要演示此分支,把 deadline 設成幾分鐘後,故意只讓部分 IRG Member 投票,等超時觸發。

### 6.2 IRG Members：完成投票

建議：

1. IRG Member 1：`RECOMMEND`
2. IRG Member 2：`RECOMMEND`

提交後，IRG Secretary 進入摘要審核節點。

> 若部分 IRG Member 未在 deadline 前提交,該成員的決定會由系統補為 `RECOMMEND`(見 §6.1 超時行為)。

### 6.3 IRG Secretary：審核 AI Summary

1. 打開 `IRG Review Summary`。
2. 查看 AI Summary 與 individual votes。
3. 可填寫 secretary comment。
4. 點擊進入 VP。

預期結果：

1. VP 投票提交鎖被解除。
2. `VPSLA Secretary` 可以繼續選組。

### 6.4 VPSLA Secretary：選擇 VP Group

1. 打開 `VP Select Group`。
2. 從下拉選擇 `VP Demo Group`。
3. 頁面會展示：
   - ChairPerson
   - 組員列表
4. 設定 vote deadline（流程變量 `vpVoteDeadline`,驅動超時 boundary timer event）。
5. 提交。

預期結果：

1. `VPSLA Member` 收到投票任務。
2. ChairPerson 不參與本輪投票，只保留最終決策節點。

> **超時行為**:若 deadline 前未全部投票,系統 `activityVpTimeoutDelegate` 把未投票者標記為 **`ABSTAIN`**(注意:跟 IRG timeout 不同,VP 超時是棄權而非 RECOMMEND),透過 `vpBranchMergeGateway` 匯流到 `parallelJoinGateway`。Demo 中如要演示此分支,把 deadline 設成幾分鐘後,讓部分 VP Member 不投票,等超時觸發。

### 6.5 VPSLA Members：投票

有兩種示範方式。

#### 方式 A：最短主線

1. VPSLA Member 1：`APPROVE`
2. VPSLA Member 2：`APPROVE`

然後 `VPSLA Secretary` 直接進入共識檢查並提交 Chair。

#### 方式 B：最大覆蓋路徑

1. 第一輪：
   - VPSLA Member 1：`APPROVE`
   - VPSLA Member 2：`REJECT`
2. `VPSLA Secretary` 在共識頁點擊 `Start Next Round`
3. 第二輪重新選同一個 VP Group
4. 第二輪兩位 VP Member 都投 `APPROVE`
5. `VPSLA Secretary` 再提交 Chair

> **第二輪 BPMN 流轉變化**（commit `ca89f930c`, 2026-05-18）：第二輪及以後，VP 分支完成後**直接進入 `VP AI Summary`，不再經過 Parallel Join Gateway**——`vpBranchMergeGateway` 上的 `vpRoundNumber > 1` 條件分支會把 token 路由到 `vpAiSummaryTask`。
>
> Demo 觀察：方式 B 第二輪結束時，不應在流程定義圖上看到 token 停留在 Parallel Join 上等 IRG 匯流；如果你跑過第一輪 IRG 後重啟容器或回放歷史，這條 round 2+ 短路會避免流程死等。詳見設計文檔 §4.3.1。

### 6.6 VPSLA Secretary：檢查共識

1. 打開 `VP Check Consensus`。
2. 檢查：
   - approve / reject / abstain count
   - AI Summary
   - vote details
3. 填寫：
   - recommendation
   - follow-up items
   - secretary comment
4. 根據示範方式：
   - 方式 A：點擊 `Escalate to Chair`
   - 方式 B：第一輪先點 `Start Next Round`，第二輪再點 `Escalate to Chair`

### 6.7 ChairPerson：最終決定

1. ChairPerson 打開 `Chair Decision`。
2. 查看：
   - 活動資訊
   - Chair AI recommendation
   - VP 彙總意見
3. 選擇 `PASS`。
4. 提交。

預期結果：

1. 若活動**有外部嘉賓**，流程會在 `Chair PASS` 後進入 `VP(RD) / VP(RD) Delegate` 的 `Final Guest Approval`。
2. 若活動**沒有外部嘉賓**，流程才會在 `Chair PASS` 後直接結束。
3. 只有在最終嘉賓審批通過，或本身沒有外部嘉賓時，活動才會變為 `APPROVED` 並自動發布。

---

## 7. Demo 完成後的驗收點

在主線結束後，建議按以下順序驗收：

1. 申請人重新登入。
2. 在自己的活動列表中確認：
   - `approvalStatus = APPROVED`
   - 活動不再是 `DRAFT`
3. 管理端 / 活動列表確認：
   - 活動已進入可發布狀態
4. BPM 審批詳情頁確認：
   - 歷史記錄完整
   - IRG / VP 輪次正確
5. 如有活動發布頁或首頁展示鏈路，也可進一步確認活動是否已出現在目標列表中。

---

## 8. 可選分支演示

如果主線走完後還想補充分支演示，建議按下面順序單獨再做一輪：

1. **Coordinator Return**
   - Coordinator 選擇 `Return`
   - 驗證申請人看到 `RETURNED`

2. **Checker Return**
   - Checker 選擇紅色按鈕
   - 驗證流程最終狀態是 `RETURNED`，不是 `REJECTED`

3. **Supervisor Return**
   - 任一 Supervisor 選擇 `RETURN`
   - 驗證流程直接回到申請人

4. **EO Return**
   - EO 選擇不通過 / 退回
   - 驗證流程回到 Supervisors

5. **VP 多輪**
   - 第一輪故意分裂投票
   - VPSLA Secretary 發起第二輪

6. **Chair Return**
   - Chair 選擇 `RETURN`
   - 驗證活動被退回

---

## 9. 常見卡點與排查

### 9.1 申請人無法提交 NSOA

檢查：

1. 當前是否存在有效的 `Orientation Application Period`
2. 該活動是否仍是 `DRAFT`
3. 是否所有 OC 成員都已完成 endorsement

### 9.2 Coordinator 頁面選不到 Checker / Supervisor

檢查：

1. 對應帳號是否具備相關系統角色
2. 帳號是否啟用
3. 當前環境是否已同步到最新角色配置

### 9.3 VPSLA Secretary 下拉裡沒有 VP Group

檢查：

1. 是否已在 `Vetting Panel Group Management` 中建立 group
2. group 狀態是否為 enabled
3. group 是否至少配置了成員

### 9.4 VP 組裡沒有 ChairPerson

如果 VP group 沒有成員角色為 `CHAIRPERSON`，後續 Chair 決策階段可能無法正常承接。請先在 VP Group 管理頁補齊。

### 9.5 Guest 審批任務沒有出現

檢查：

1. 活動是否真的設置了外部嘉賓
2. `VP(RD)` / `VP(RD) Delegate` 角色在當前環境是否已正確配置
3. 當前部署是否已同步 Guest Approval 的最新 BPMN / 角色映射
4. 若任務仍未出現，請再確認運行環境是否正確提供 `vprdApproverGroupIds`

### 9.6 活動被其他人鎖定無法編輯

檢查：

1. 是否已有其他使用者先打開並編輯同一筆活動
2. 是否仍在 30 分鐘編輯鎖有效期內
3. 前一位使用者是否已經完成儲存或更新
4. 若前一位只是直接關閉頁面，請考慮鎖可能仍要等到超時才會釋放
5. 目前前端拿鎖失敗時，會提示錯誤並跳回 `ActivityListForStudent`；不會在原頁面顯示只讀鎖定狀態

---

## 10. 建議的 Demo 執行順序（最省時版本）

如果時間只有 20–30 分鐘，建議按這個順序演示：

1. 先由管理員預建好 `IRG Demo Group`、`VP Demo Group`、Orientation period。
2. 申請人使用 `Copy from Previous` 建立模板。
3. 只演示關鍵觸發字段的修改與 `Save Draft`。
4. 快速完成 OC Endorsement。
5. 依次走：
   - Coordinator
   - Activity Application Checker
   - 1 名 Supervisor
   - EO Venue Reviewer
   - Sponsorship Approval
   - VP(RD) / VP(RD) Delegate
   - IRG Secretary / IRG Members
   - VPSLA Secretary / VPSLA Members
   - Chair
6. 最後回到活動列表驗證 `APPROVED / Published`。

---

## 11. 关联文档

如需查看节点语义和分支规则，可配合阅读：

- [activity-publish-workflow-design.md](./activity-publish-workflow-design.md)
