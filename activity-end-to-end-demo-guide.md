# 活動流程全流程 Demo 指南

> 本文檔面向 Demo 執行人、UAT 測試人與業務培訓人員，目標是讓使用者**不依賴開發人員陪同**，也能從活動草稿一路走到最終審批完成。
>
> 本指南基於 `SLAS_PRO` / `SLAS_UI` 當前實現撰寫，主線覆蓋：
> `Draft → OC Endorsement → Coordinator → Activity Application Checker → Activity Application Referrer → EO Venue Reviewer → Sponsorship Approval → VPRD / VPRD Delegate → IRG → VPSLA → Chair → Published`

---

## 1. Demo 目標

本次 Demo 推薦採用一條「最大覆蓋率」主線，盡量走到最多審批節點：

1. 申請人從零建立一個活動草稿，或從歷史申請複製一份作為起點。
2. 活動包含：
   - `NSOA = Yes`
   - 有外部嘉賓
   - 有贊助
   - 需要經過 OC 成員認可
3. Coordinator 指派：
   - 1 名 Checker
   - 多名 Supervisors
4. Supervisor 至少有 1 人勾選場地相關確認，以觸發 EO。
5. IRG / VP 採用已配置的 group。
6. VP 可選：
   - 最短路徑：第一輪後直接提交 Chair
   - 完整路徑：第一輪故意不達共識，演示第二輪
7. Chair 最終選擇 `PASS`，活動進入 `APPROVED / Published`。

---

## 2. 參與角色

建議至少準備以下帳號：

| Demo 角色 | 建議系統角色 / 身份 | 用途 |
|:---|:---|:---|
| 申請人 | `Group Leader` / 活動建立人 | 建立草稿、提交申請 |
| OC 成員 A / B | 活動 OC 成員 | 完成 OC Endorsement |
| Coordinator | `Coordinator` | 初審、指派 Checker / Supervisors |
| Activity Application Checker | `Activity Application Checker` | 詳細審查 |
| Activity Application Referrer 1 / 2 | `Activity Application Referrer` | 並行投票與確認 |
| EO Venue Reviewer | `EO Venue Reviewer` | EO 審批 |
| Head / Activity Application Reviewer | `Head` / `Activity Application Reviewer` | 贊助審批 |
| VPRD / VPRD Delegate | `VPRD` 或 `VPRD Delegate` | 外部嘉賓審批 |
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
| `hro-test-071` | 115 / 140 | Coordinator | N | 活動協調審核 | 需核對環境使用 `115` 還是歷史 `140` |
| `hro-test-072` | 141 | EO Venue Reviewer | N | 場地審批 | EO |
| `hro-test-073` | 142 | Activity Application Checker | N | 活動審核 | Checker |
| `hro-test-074` | 116 | Activity Application Referrer | N | 主管投票（多實例） | Supervisor 1 |
| `hro-test-075` | 116 | Activity Application Referrer | N | 主管投票（多實例） | Supervisor 2 |
| `hro-test-076` | 116 | Activity Application Referrer | N | 主管投票（多實例） | Supervisor 3 |
| `hro-test-090` | 148 | Head | Y | 贊助審批 | Sponsorship |
| `hro-test-091` | 149 | Activity Application Reviewer | Y | 高級審批相關節點 | 歷史帳號名可能仍顯示 Dean |
| `hro-test-092` | 150 | Delegate | - | 舊內容/嘉賓審批口徑 | 僅在舊環境口徑中可能出現 |
| `hro-test-077` | 144 | IRG Secretary | N | IRG 秘書 | IRG 選組 / 摘要審核 |
| `hro-test-078 ~ hro-test-082` | 145 | IRG Member | N | IRG 成員投票（多實例） | IRG 投票 |
| `hro-test-083` | 146 | VPSLA Secretary | N | VP 秘書 | VP Select Group / VP Check Consensus |
| `hro-test-084 ~ hro-test-088` | 147 | VPSLA Member | N | VP 成員投票（多實例） | VP Vote |
| `hro-test-089` | 147 | VPSLA Member / VP ChairPerson | Y | VP 主席決定 | 需在 VP Group 中設為 `CHAIRPERSON` |
| `待確認` | 151 | VPRD | Y | 嘉賓審批 | 若環境已完成新口徑切換，應由此角色承接 |
| `待確認` | 152 | VPRD Delegate | Y | 嘉賓審批（委派） | 若環境已完成新口徑切換，應由此角色承接 |

#### 2.1.2 OC Endorsement 帳號

| 用戶名 | 角色 ID | 最新角色名稱 | Delegate | 審批節點 | 備註 |
|:---|:---:|:---|:---:|:---|:---|
| `S1132367` | `11323677` | Group Leader | N | Student Group Leader（活動建立者） | 申請人 |
| `S1132368` | `11323688` | Group Leader | N | OC Endorsement | 需在該活動 OC 名單內 |
| `S1132369` | `11323699` | Group Leader | N | OC Endorsement | 需在該活動 OC 名單內 |

#### 2.1.3 社團註冊審批帳號

| 用戶名 | 角色 ID | 最新角色名稱 | Delegate | 審批節點 | 備註 |
|:---|:---:|:---|:---:|:---|:---|
| `S1132367` | - | Group Leader | N | 發起申請 | 社團註冊申請人 |
| `hro-test-093` | 122 | Registration Administrator | N | Node 1: 秘書審核 | 角色名需更新到最新 |
| `hro-test-105` | 136 | Registration Checker | N | Node 2: 行政審核 | 角色名需更新到最新 |
| `ro-test-102` | 132 | Registration Referrer | N | Node 3: 學術審核 | 角色名需更新到最新 |
| `hro-test-094` | 123 | Registration Reviewer | N | Node 4: 收集意見（多實例） | Reviewer 1 |
| `hro-test-095` | 123 | Registration Reviewer | N | Node 4: 收集意見（多實例） | Reviewer 2 |
| `hro-test-096` | 123 | Registration Reviewer | N | Node 4: 收集意見（多實例） | Reviewer 3 |
| `hro-test-106` | 138 | Registration Endorser | N | Node 5: 匯總審核 | 角色名需更新到最新 |
| `hro-test-097` | 124 | Registration Approver | Y | Node 6: 最終審批 | Final Approver |
| `hro-test-103` | 134 | Student Group Registration Approver Secretary | - | Node 6: 最終審批（備選） | 備用 |

#### 2.1.4 註冊申訴審批帳號

| 用戶名 | 角色 ID | 最新角色名稱 | Delegate | 審批節點 | 備註 |
|:---|:---:|:---|:---:|:---|:---|
| `S1132367` | - | Group Leader | N | 發起申訴 | 申訴發起人 |
| `hro-test-098` | 125 | Registration Appeal Reviewer | N | Node 1: 收集意見（多實例） | Reviewer 1 |
| `hro-test-099` | 125 | Registration Appeal Reviewer | N | Node 1: 收集意見（多實例） | Reviewer 2 |
| `hro-test-100` | 125 | Registration Appeal Reviewer | N | Node 1: 收集意見（多實例） | Reviewer 3 |
| `hro-test-107` | 139 | Registration Appeal Endorser | N | Node 2: 匯總審核 | 角色名需更新到最新 |
| `hro-test-101` | 126 | Registration Appeal Approver | Y | Node 3: 最終審批 | Final Approver |
| `hro-test-104` | 135 | Student Group Appeal Approver Secretary | - | Node 3: 最終審批（備選） | 備用 |

#### 2.1.5 其他可用 Group Leader 帳號

- `S1155707`
- `S1154233`
- `S1155654`
- `S1155751`
- `S1155738`
- `S1155923`

### 2.2 建議切號順序

如果只有 1 台電腦演示，建議按下面順序切換帳號：

1. 申請人
2. OC 成員 A
3. OC 成員 B
4. 申請人
5. Coordinator
6. Activity Application Checker
7. Activity Application Referrer 1
8. Activity Application Referrer 2
9. EO Venue Reviewer
10. Head / Activity Application Reviewer
11. VPRD / VPRD Delegate
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

2. **VP Group 已建立且啟用**
   - 入口：`Activity Configuration` → `Vetting Panel Group Management`
   - 建議建立 `VP Demo Group`
   - 至少包含：
     - 1 名 `SECRETARY`
     - 1 名 `CHAIRPERSON`
     - 2 名 `MEMBER`

3. **Orientation Application Period 已開放**
   - 因本主線使用 `NSOA = Yes`
   - 需確認目前存在有效期中的 `Orientation Application Period`
   - 否則活動在非草稿提交時會被拒絕

4. **相關帳號具備登入與待辦權限**
   - 所有 Demo 參與者都能登入
   - 所有審批人都能看到 BPM 待辦

5. **Checker / Supervisor / EO / Guest / Sponsorship 審批帳號可用**
   - Coordinator 頁面能查到 Checker / Supervisor
   - `VPRD` / `VPRD Delegate` 帳號能接收嘉賓審批任務

6. **活動編輯鎖已啟用**
   - 最新代碼已加入活動表單 editing lock
   - 同一時間建議只由 1 名申請人編輯同一筆活動

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

### 4.2 申請人：填寫關鍵觸發欄位

為確保完整主線都能被觸發，至少確認：

1. 在 `Applicant` 步驟：
   - `NSOA = Yes`
   - Student Group 正確
   - OC Members 至少 3 人

2. 在 `Activity Basics / Resources & Documents`：
   - 活動資料完整
   - 有贊助相關內容

3. 在 `External Guests`：
   - `nonEduhkInvolvement = Yes`
   - 至少建立 1 名外部嘉賓

4. 在 `Preview`：
   - 確認所有校驗都通過
   - 看得到 `OC Endorsement` 面板

### 4.3 OC 成員：完成 OC Endorsement

1. 申請人先停留在 `Preview` 頁面。
2. 依序用各 OC 成員帳號登入。
3. 每位 OC 成員打開該活動的 `Preview / OC Endorsement` 區塊。
4. 點擊 `Submit Endorsement`。
5. 直到狀態變成 `all endorsed`。

預期結果：

1. `OC Endorsement` 進度顯示全部完成。
2. 申請人可以正式提交活動申請。

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

1. Checker 收到任務。
2. Supervisor 收到並行任務。

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

1. `Decision = RECOMMEND`
2. Sponsorship 區塊：
   - `sponsorshipConfirmed = Yes`
   - 填 sponsor amount / source
3. Venue 區塊：
   - 至少 **1 名 Supervisor** 勾選場地相關確認，以便觸發 EO
4. ELAT 區塊：
   - 可根據 Demo 需要選 `Yes` 並填 category
5. 填 comment
6. 提交

預期結果：

1. 所有 Supervisor 都提交後，系統聚合結果為 `RECOMMEND`。
2. 因至少 1 人觸發場地確認，流程進入 EO。

### 5.4 EO：場地審批

1. EO Reviewer 打開 `EO Approval`。
2. 核對活動資訊。
3. 選擇 `Approve`。
4. 提交。

預期結果：

1. 流程進入 Sponsorship Approval。

### 5.5 Sponsorship Reviewer：贊助審批

1. Sponsorship Reviewer 打開 `Sponsorship Approval`。
2. 查看贊助資訊區塊。
3. 選擇 `Approve`。
4. 提交。

預期結果：

1. 流程進入 Guest Approval。

### 5.6 VPRD / VPRD Delegate：外部嘉賓審批

1. `VPRD` 或 `VPRD Delegate` 打開 `Guest Approval`。
2. 核對外部嘉賓名單。
3. 選擇 `Approve`。
4. 提交。

預期結果：

1. 因活動是 NSOA，流程進入 IRG / VP 階段。

---

## 6. IRG / VP / Chair 腳本

### 6.1 IRG Secretary：選擇 IRG Group

1. 打開 `IRG Select Group`。
2. 從下拉中選擇 `IRG Demo Group`。
3. 設定 vote deadline。
4. 提交。

預期結果：

1. IRG Member 收到投票任務。

### 6.2 IRG Members：完成投票

建議：

1. IRG Member 1：`RECOMMEND`
2. IRG Member 2：`RECOMMEND`

提交後，IRG Secretary 進入摘要審核節點。

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
4. 設定 vote deadline。
5. 提交。

預期結果：

1. `VPSLA Member` 收到投票任務。
2. ChairPerson 不參與本輪投票，只保留最終決策節點。

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

1. 流程結束。
2. 活動變為 `APPROVED`。
3. 系統自動發布活動。

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

2. **Supervisor Return**
   - 任一 Supervisor 選擇 `RETURN`
   - 驗證流程直接回到申請人

3. **EO Return**
   - EO 選擇不通過 / 退回
   - 驗證流程回到 Supervisors

4. **VP 多輪**
   - 第一輪故意分裂投票
   - VPSLA Secretary 發起第二輪

5. **Chair Return**
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
4. 若環境較舊，請確認活動發布流程是否仍錯誤使用 `140` 舊口徑，而非最新運行時的 `115 / Coordinator`

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
2. `VPRD` / `VPRD Delegate` 角色在當前環境是否已正確配置
3. 當前部署是否已同步 Guest Approval 的最新 BPMN / 角色映射
4. 若任務仍未出現，請再確認運行環境是否正確提供 `vprdApproverGroupIds`

### 9.6 活動被其他人鎖定無法編輯

檢查：

1. 是否已有其他使用者先打開並編輯同一筆活動
2. 是否仍在 30 分鐘編輯鎖有效期內
3. 前一位使用者是否已經完成儲存、更新或退出

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
   - 1 名 Activity Application Referrer
   - EO Venue Reviewer
   - Sponsorship Approval
   - VPRD / VPRD Delegate
   - IRG Secretary / IRG Members
   - VPSLA Secretary / VPSLA Members
   - Chair
6. 最後回到活動列表驗證 `APPROVED / Published`。

---

## 11. 关联文档

如需查看节点语义和分支规则，可配合阅读：

- [activity-publish-workflow-design.md](./activity-publish-workflow-design.md)
