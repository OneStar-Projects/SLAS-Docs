# 活動發布審批流程

> 本文檔描述 SLAS 系統中活動發布審批的完整業務流程，覆蓋 NSOA（新生迎新活動）與非 NSOA 兩種場景。
> 除流程節點名稱外，文中凡涉及角色稱呼，均以 `SYSTEM_ROLE.NAME` 為主。

---

## 1. 流程概覽

### 1.1 業務目標

對學生組織提交的活動申請進行多層審批，確保符合校方規範後正式發布到活動列表。

### 1.2 觸發條件

申請人在系統中提交活動申請後自動啟動。

### 1.3 結束狀態總覽

| 狀態 | 業務含義 | 申請人後續操作 |
|:-----|:--------|:-------------|
| `APPROVED` | 活動通過審批，已發布 | — |
| `REJECTED` | 活動被拒絕（終局） | 不可重新提交 |
| `RETURNED` | 活動退回 | 可修改後重新提交 |

### 1.4 審批路徑差異

- **有外部嘉賓的活動**：在 EO 之後，先進入 `Dean / Delegate` 的 **Guest Endorsement**。
- **有贊助的活動**：在 Guest Endorsement 之後，再進入 `Dean / Delegate` 的 **Sponsorship Approval**。
- **任何活動（必經）**：在 Guest Endorsement / Sponsorship Approval 之後（即便都跳過），都會進入 `Dean / Delegate` 的 **Activity Content Approval**（活動內容 / 預算審批）。Dean 在此節對活動整體做 `Approve / Return / Reject` 決定。
- **非 NSOA 活動**：Activity Content 通過後，如活動有外部嘉賓，會再進入 `VP(RD) / VP(RD) Delegate` 的 **Final Guest Approval**，然後發布。
- **NSOA 活動**：Activity Content 通過後，先進入 IRG（Initial Review Group）與 VP（Vetting Panel）**並行評審**；若 `Chair PASS`，且活動有外部嘉賓，之後仍會再進入 `VP(RD) / VP(RD) Delegate` 的 **Final Guest Approval**。

> **重要說明**：依據當前 BPMN，只要 `hasExternalGuest == true`，活動最終都可能進入 `VP(RD) / VP(RD) Delegate` 的 `guestApprovalTask`。
> - `非 NSOA`：在一般高級審批後進入
> - `NSOA`：在 `IRG / VP` 完成且 `Chair PASS` 後進入
>
> **編輯鎖說明**：最新 `SLAS_UI` 在活動編輯頁（`mode=edit`）進入時，會先呼叫 `/activity/acquire-editing` 取得 30 分鐘短鎖；若拿鎖失敗，前端目前會顯示錯誤訊息並跳回 `ActivityListForStudent`，而不是在原頁面顯示一個「已鎖定、只讀」狀態。成功更新後後端會自動釋放鎖；若使用者直接關閉頁面，則主要依賴鎖超時失效。
>
> **名稱口徑說明**：本文按最新 `SYSTEM_ROLE.NAME` 使用 `VP(RD)` / `VP(RD) Delegate`；但當前 BPMN 註釋、前端任務標題與部分變量名仍常寫作 `VPRD / VPRD Delegate`，兩者在本文中視為同一組角色。

### 1.5 全局退回 / 拒絕行為說明

> 本節為**全文後續所有"拒絕 / 退回"描述**提供統一語義基礎。讀後續 §4 流程圖、§5 步驟詳述與 §6 結果表時請以本節為準。

#### 1.5.1 高級審批節點：`approveTask(approved=false)` + BPMN gate 真正分支

EO、Checker、Guest Endorsement、Sponsorship、Activity Content 等審批節點，前端表單（`SimpleApprovalForm` / `ContentGuestApprovalForm`）的「通過」與「拒絕／退回」按鈕**統一調用** `PUT /bpm/task/approve`（[useApprovalFormBase.ts → submitApproval](https://example.invalid)），把使用者選擇通過 `variables: { approved: true | false }` 寫入流程變量。

> **例外**：⑦ Final Guest Approval（VPRD）已改為**專屬服務節點**，不走這條統一路徑——詳見 §1.5.3。

```ts
await approveTask({
  id: props.taskId,
  reason,
  variables: { approved, ...variables },
  taskStatus: approved ? undefined : BpmTaskStatus.RETURN
})
```

→ BPMN 上的 `flow_xxx_approved` / `flow_xxx_rejected`（或對應命名）**會真正按 `${approved == true/false}` 分流**，到哪個目標完全由 BPMN 定義決定，並非短路到 `endEventReturned`。

具體每個節點 reject/return 的去向，請看以下對照表（以 `activity_publish.bpmn20.xml` 為準）：

| 節點 | reject/return 後實際去向 | 業務含義 |
|:----|:----------------------|:--------|
| ② Checker | `endEventReturned` | 流程結束，申請人可修改後重新提交 |
| ④ EO | `supervisorsReviewTask` | 回到 ③ Supervisor 多實例**重新審核** |
| ⑤ Guest Endorsement | `supervisorsReviewTask` | 回到 ③ Supervisor 重審 |
| ⑥ Sponsorship | `supervisorsReviewTask` | 回到 ③ Supervisor 重審 |
| ⑥' Activity Content | `supervisorsReviewTask` | 回到 ③ Supervisor 重審 |
| ⑦ Final Guest（VPRD） | `chairPersonDecisionTask`（NSOA, RETURN_TO_CHAIR） / `activityContentApprovalTask`（非 NSOA, RETURN_TO_DEAN） | VPRD 專屬服務節點，不走 `approveTask`；無 reject 路徑——只能 approve 或 return 給上一步審批人。詳見 §1.5.3 |

> 注意：上述「回到 Supervisor」並非 bug 而是 BPMN `<!-- EO returns → back to Supervisors (no reject path) -->` 等明文設計。對需要「直接退回申請人」的場景，應由 ③ Supervisor 在重審時自行投 `RETURN` / `REJECT`，由聚合委托 + `supervisorsDecisionGate` 真正結束流程。

#### 1.5.2 通用 `rejectTask` 短路機制（目前 activity_publish 流程**沒有節點調用**）

`BpmTaskServiceImpl.rejectTask` 內部存在一段「若流程定義包含 ID 含 `returned` 的 EndEvent 則短路 `moveTaskToEnd` 到該 EndEvent」的邏輯，但 **`activity_publish` 流程的所有審批節點目前都不調用這條接口**——前端統一走 `approveTask`（見 §1.5.1），supervisor / chair / VPRD 走自己的專屬服務方法（見 §1.5.3）。本節僅作框架行為記錄，方便排查時對齊；本流程文檔中**所有 reject/return 描述以 §1.5.1 / §1.5.3 為準**。

#### 1.5.3 專屬服務節點：`supervisorApprove` / `chairPersonDecision` / `guestApprovalDecision` 直接寫流程變量

下列節點不通過 `SimpleApprovalForm`，而是各自的專屬表單 + 專屬服務方法封裝 `approveTask`，再把決定塞進流程變量讓 gate 真正分支：

| 節點 | 服務方法 / 端點 | 前端表單 | 如何向 BPMN 表達"非通過"決定 |
|:----|:---------------|:--------|:-----------------------|
| ③ Supervisor | `supervisorApprove(...)` | `SupervisorVoteForm` | 設 `supvAggregateDecision = REJECT / RETURN`、`supervisorsAllApproved = false`，BPMN gate 真正按值分流 → `endEventRejected` 或 `endEventReturned` |
| ⑭ ChairPerson | `chairPersonDecision(...)` | `ChairDecisionForm` | 設 `chairDecision = PASS / REJECT / RETURN`，BPMN gate 真正按值分流；`RETURN` → `endEventReturned`（已統一，見 §1.5.4） |
| ⑦ VPRD | `guestApprovalDecision(...)` `POST /activity/approval/guest/decision` | `GuestApprovalForm.vue` | 設 `guestDecision = APPROVE / RETURN_TO_CHAIR / RETURN_TO_DEAN`（見 `GuestDecisionEnum`）；BPMN gate `guestDecisionGate` 真正按值分流：`APPROVE` → 發布，`RETURN_TO_CHAIR`（NSOA only）→ `chairPersonDecisionTask`，`RETURN_TO_DEAN`（非 NSOA only）→ `activityContentApprovalTask`。**無 reject 路徑** |

##### 1.5.3.1 ③ Supervisor 多人聚合 — 增量 Java 聚合(已修復)

`supervisorApprove` 採用**增量單變量聚合**而非 multi-instance outputCollection:每位 supervisor 提交時呼叫 `resolveSupervisorAggregateDecision`,讀目前 `supvAggregateDecision` 流程變量,按下列**sticky 升級規則**算出新值寫回:

```
RETURN > REJECT > RECOMMEND
- 已經 RETURN → 永遠保持 RETURN
- 已經 REJECT 且當前不是 RETURN → 保持 REJECT
- 否則 → 採用當前決定
```

`ActivitySupervisorAggregateDelegate` 在多實例完成後作為 safety net:若 `supvAggregateDecision` 已是 RETURN/REJECT 則信任並保留;否則 fallback 到從 `supvDecisions` 集合(或單個 `supvDecision`)重新聚合。

四種代表性組合的驗證:

| 投票順序 | 最終 `supvAggregateDecision` | 流程走向 |
|:--------|:----------------------------|:---------|
| `[RECOMMEND, RECOMMEND, RECOMMEND]` | RECOMMEND | → ④ EO / ⑤ 嘉賓 / ⑥ 贊助 / ⑥' 內容 |
| `[RECOMMEND, RETURN, RECOMMEND]` | RETURN | → `endEventReturned`(申請人可修改) |
| `[REJECT, REJECT, REJECT]` | REJECT | → `endEventRejected` |
| `[REJECT, RETURN, RECOMMEND]` | RETURN(覆蓋 REJECT)| → `endEventReturned` |

> **歷史背景**:早期版本因 `supvDecisions` 集合既無 BPMN `flowable:outputCollection` 配置又無 Java 累積寫入,聚合 fallback 到「最後一個投票人說了算」。已於 commit `5edae8ab9`(2026-05-07)透過上述增量聚合修復,**不採用** SLAS-Docs 早期建議的 BPMN outputCollection 或 Java list append 方案。
>
> 弱點:理論上並發 lost-update(兩位 supervisor 同時提交)依賴 Flowable 樂觀鎖兜底,生產環境未見實際 issue。

#### 1.5.4 ⑭ ChairPerson `RETURN` 路徑（已統一到 `endEventReturned`）

`chairPersonDecision` 在處理 `RETURN` 時：

1. **Java 同步更新活動狀態**：`updateActivityApprovalStatus(activityId, "RETURNED", comment)`，退回申請人。
2. **BPMN 流轉**：`flow_chair_return` 的 `targetRef` 指向 `endEventReturned`，與其它 RETURN 路徑（Coordinator / Checker）一致——流程結束，申請人狀態為 `RETURNED`，**不再生成新的主管待辦**。

> 歷史背景：早期版本 `flow_chair_return` 曾錯誤指向 `supervisorsReviewTask`，導致 Java 退回 + BPMN 重派 supervisor 的雙重行為。已於 commit `5edae8ab9` 統一為 `endEventReturned`，本文後續所有 ⑭ Chair `RETURN` 描述以當前 BPMN 為準。

#### 1.5.5 supervisor 在 ③ 步勾選的附加標記如何影響後續 gate

主管審批表單裡的 `sponsorshipConfirmed` / `campusPublicVenueConfirmed` / `venueAfterHoursConfirmed` / `elatEligible` 等欄位中：

- **`campusPublicVenueConfirmed` / `venueAfterHoursConfirmed`** 以 sticky-OR 語意寫入流程變量 `supvCampusPublicVenue` / `supvVenueAfterhrs`，**真正驅動** `checkEoAfterHoursGate`。
- **`sponsorshipConfirmed`**(commit `3c653be94`, PR #125, 2026-05-11)以 sticky-OR 語意寫入流程變量 `hasSponsorship`,**真正驅動** `checkSponsorshipGate`。即便申請人提交時填 `hasSponsorship=false`,supervisor 勾選 `sponsorshipConfirmed=true` 也會補救觸發 ⑥ 贊助審批分支。**任一 supervisor 勾選即生效**(sticky-OR 跨多實例),且**不可降級**(一旦寫入 true,後續勾選 false 不會回退)。
- **`elatEligible` / `elatCategory`** 與其他留痕欄位 **只寫回 `ActivityDO` 的 `supv*` 列**，**不更新流程變量**(無對應 gate)。

因此：
- `checkSponsorshipGate` 讀 sticky-OR 後的 `hasSponsorship`(申請人提交值 OR 任一 supervisor 勾選)。
- `checkGuestEndorsementGate` / `checkGuestGate` 仍只讀流程啟動時冻結的 `hasExternalGuest`(supervisor 表單無對應 `externalGuestConfirmed` 欄位,如需此補救機制需先在 `SupervisorApprovalReqVO` 加字段)。

##### 1.5.5.1 場地硬約束：勾選"課後使用"必須先勾"校園公共場地"

`venueAfterHoursConfirmed = true` **必須** 同時 `campusPublicVenueConfirmed = true`。否則：

- **後端**：`supervisorApprove` 拋 `SUPERVISOR_AFTERHOURS_REQUIRES_CAMPUS_VENUE` 業務錯誤碼（commit `82124be71`），返回本地化訊息（不再是不透明的 500）。
- **前端**：`SupervisorVoteForm` 把「Use Venue After Hours」開關 gate 在「Use Campus Public Venue」開關後（commit `05b346f3`）；前者只有在後者勾選時才能變 true。

業務含義：課後場地審批必然發生在校園公共場地的範疇內；只勾「課後使用」而不勾「校園公共場地」是不合法的組合。

### 1.6 活動編輯鎖（Editing Lock）

> 引入時間：commit `51359c9cc`（後端基礎設施，2026-05-05）+ `4b8a19ec1`（主動釋放端點，2026-05-07）+ `f0398a015`（暴露鎖欄位）。
> 前端配套：`20239e1e`（`lockHeld` 與 `beforeunload` 釋放）+ `809ca6cf`（活動列表編輯中徽章）+ `eae9f2b0`（鎖文案）。

#### 1.6.1 目標

防止多個 OC（學生組織負責人）同時編輯同一活動草稿、或同時觸發 `acquire-editing` 後相互覆蓋。

#### 1.6.2 數據模型

`ActivityDO` 新增列（SQL patch `0004_018_add_activity_editing_lock.sql`）：

| 列名 | 含義 |
|:----|:----|
| `editing_user_id` | 當前持鎖人 user id |
| `editing_expire_at` | 鎖的 SQL 端 TTL（30 分鐘） |

`RespVO` 同步暴露 `editingUserId / editingExpireAt`，活動列表據此渲染「編輯中」徽章。

#### 1.6.3 端點

| 動作 | 端點 | 行為 |
|:----|:----|:----|
| 取鎖 | `POST /activity/acquire-editing` | 進入編輯頁時調用；若無鎖則寫 `editing_user_id` + `editing_expire_at = NOW + 30min`；若已被他人持鎖則 409；若鎖屬於自己則續期 |
| 釋鎖 | `POST /activity/release-editing` | 提交 / 路由切換 / `beforeunload` 時調用；Mapper 用 `editing_user_id` 過濾後再清空，**冪等且只允許持鎖人釋放** |

#### 1.6.4 釋鎖時機

前端三層保險（`useCreateActivity.ts`）：

1. **正常提交成功**：在 update 成功 callback 中調 `releaseEditing`。
2. **路由內導航離開**：`cleanupComponent` 用 axios（best-effort）釋鎖。
3. **`beforeunload`（關閉 tab / 刷新 / 硬導航）**：用 `fetch keepalive`（注意：不能用 `sendBeacon`，因為它**不帶 `Authorization` header**），請求會在頁面卸載時繼續發送。

兜底：30 分鐘 SQL TTL 過期後鎖自動失效，下一個 OC 可以取鎖。

#### 1.6.5 與審批流的關係

編輯鎖只作用於**草稿態 / 退回後重新編輯態**，與 BPMN 流程完全解耦——流程中的審批節點不關心鎖。鎖唯一的關聯是：當活動處於 `RETURNED` 等待修改時，OC 必須先取鎖才能進入編輯頁。

### 1.7 Endorse 模式（OC 互審不阻塞編輯）

> 引入時間：commit `20239e1e`（前端，2026-05-07）。

#### 1.7.1 為什麼需要

學生組織內常有多位 OC 角色用戶（`Group Leader`），其中一人在編輯草稿時，**另一位想預覽 / 確認內容**——但 §1.6 的編輯鎖會阻塞第二人進入編輯頁。

#### 1.7.2 設計

`CreateActivities` 路由參數 `mode` 新增 `endorse` 值：

| `mode=` | 行為 |
|:-------|:----|
| `edit` | 取編輯鎖，可填寫 / 提交 / 上一步 / 保存草稿 |
| `endorse` | **不取編輯鎖**；隱藏 step navigator + save / prev / submit 按鈕；顯示 endorse-specific 標題與描述；`navigateToStep` 只 gate 在預覽步 |

活動列表頁有一個 `navigateToEndorse` action，從那裡進入時自動帶上 `mode=endorse`。

#### 1.7.3 與編輯鎖的交互

`isEndorse` computed 在 `useCreateActivity.ts` 裡判斷 `mode === 'endorse'`，據此跳過 `acquireEditingLock` 與後續所有 `releaseEditing` 邏輯——endorse 模式整個鎖機制都不參與，因此**不阻塞當前持鎖的編輯者**。

#### 1.7.4 申請人不需 endorse 自己

學生組織提交活動申請時,**申請人本人自動視為已 endorse**:

- 「待 endorse 名單」上不會顯示申請人自己,UI 上看到的都是還沒 endorse 的其他 OC 成員。
- 若該組織只有一位 OC(也就是申請人自己),活動可以直接提交,不會卡在「等自己 endorse 自己」。
- 多人 OC 的組織提交活動時,**其他 OC 仍必須完成 endorse** 才能提交,確保互審不被繞過。

---

## 2. 角色與職責

### 2.1 系統角色清單

下表為本流程涉及的系統定義角色（`SYSTEM_ROLE.NAME`）與文中流程別名。
以下內容優先對齊**當前運行時代碼**；若你的資料庫仍停留在舊補丁階段，可能仍會看到歷史口徑。

| 角色 ID | `SYSTEM_ROLE.NAME` | 職責 |
|:-------:|:-------------------|:-----|
| 115 | Coordinator | 初審；判斷是否需要 Checker；指派 Checker |
| 142 | Activity Application Checker | 對活動內容作詳細審查（由 Coordinator 指派） |
| 116 | Supervisor | 對組織與活動的第一級審核員；多人並行（由活動數據逐活動指派） |
| 141 | EO Venue Reviewer | 審批校園場地相關使用 |
| 149 | Dean | 外部嘉賓背書、贊助審批與活動內容 / 預算審批 |
| 150 | Delegate | 外部嘉賓背書、贊助審批與活動內容 / 預算審批 |
| 151 | VP(RD) | 外部嘉賓審批 |
| 152 | VP(RD) Delegate | 外部嘉賓審批委派角色 |
| 144 | IRG Secretary | 管理 IRG 評審；選組；審核 IRG 摘要 |
| 145 | IRG Member | 對 NSOA 活動進行 IRG 投票 |
| 146 | VPSLA Secretary | 管理 VP 評審；選組；判定是否達成共識 |
| 147 | VPSLA Member | 對 NSOA 活動進行 VP 投票（包含 ChairPerson 候選） |

### 2.2 流程中的功能性審批組合

下列審批職責在系統中由若干角色或活動數據共同承擔,而非單一系統角色：

| 功能性審批 | 由誰承擔 |
|:----------|:--------|
| Guest Endorsement | 由 `Dean`、`Delegate` 承擔；僅在活動有外部嘉賓時出現 |
| Sponsorship Approval | 由 `Dean`、`Delegate` 承擔；僅在活動有贊助時出現 |
| Activity Content Approval | 由 `Dean`、`Delegate` 承擔；**必經**節點，無論活動是否有嘉賓 / 贊助；對活動整體內容與預算作 `Approve / Return / Reject` 決定 |
| Final Guest Approval | 由 `VP(RD)`、`VP(RD) Delegate` 承擔；只要活動有外部嘉賓就可能出現。`非 NSOA` 在一般高級審批後進入；`NSOA` 在 `Chair PASS` 後進入 |
| Supervisor 多實例 | `Supervisor` 是當前系統角色名稱；具體本次審核的 Supervisor 名單由活動數據（`activity_supervisor` 表）逐活動指派 |
| VP ChairPerson | 由 `VPSLA Secretary` 在 ⑩ 選組階段指定的一位 `VPSLA Member` |

> **實作備註【开发参考】**
> 1. 活動發布流程的 `coordinatorGroupId` 為 `115`（`Coordinator`）。
> 2. 當前運行時代碼已把 guest 相關變量拆成三組：`guestEndorsementGroupIds = 149,150`、`sponsorshipApproverGroupIds = 149,150`、`vprdApproverGroupIds = 151,152`。
> 3. `Head (148)` 雖仍存在於 `SYSTEM_ROLE` 裡，但**當前 `activity_publish` BPMN 標準主線不再把 148 放入候選組**；Guest Endorsement 與 Sponsorship Approval 的實際候選組都是 `149,150`，即 `Dean / Delegate`。
> 4. **角色 142 名稱有歧義（資料 vs 同步代碼）**：SQL 補丁 `sql/patch/0004_017_update_approval_role_names.sql` 已將 142 重命名為 `Activity Application Checker`（本文採用此口徑，與 §2.1 表中 `142 | Activity Application Checker` 一致）；但運行時 `slas-module-bpm/.../BpmUserSyncService.java`（`createGroupIfNotExists("142", "Sponsorship Approver", ...)`）仍硬編碼為 **舊名 `Sponsorship Approver`**，服務啟動執行用戶 / 群組同步時可能會把名稱覆寫回舊口徑。若部署環境介面上看到 142 顯示為 `Sponsorship Approver`，以本文 SQL 補丁口徑為準，並建議同步修正 `BpmUserSyncService.java` 的硬編碼。

### 2.3 多人並行 / 候選組規則

| 任務 | 規則 |
|:----|:----|
| Supervisor 審核 | 所有 Supervisor 並行審核,全部完成後系統按聚合規則得出最終結果（見 §5） |
| 嘉賓背書 / 贊助審批 / 活動內容審批 | 候選組（`Dean / Delegate`）內任一審批人可認領並審批,採「先到先審」 |
| IRG 投票 | 所有 IRG Member 並行投票 |
| VP 投票 | 所有 `VPSLA Member` 並行投票（不含 ChairPerson）；VP 投票有截止時間,超時自動視為棄權 |

---

## 3. 圖例

本節定義流程圖統一規範，兩份審批流程文檔共用。

### 3.1 節點形狀

| 形狀 | Mermaid 語法 | 含義 |
|:-----|:-------------|:-----|
| 矩形 | `["Name"]` | **人工任務** — 需要審批人手動操作 |
| 平行四邊形 | `[/"auto: Name"/]` | **系統任務** — 自動執行,無需用戶操作 |
| 菱形 | `{Question?}` | **判斷網關** — 根據條件分流,文字以問號結尾 |
| 圓角 | `(["Name"])` | **流程起點／終點** 或 並行 Fork/Join |

### 3.2 連線類型

| 樣式 | Mermaid 語法 | 含義 |
|:-----|:-------------|:-----|
| 實線箭頭 | `-->` | 正向順序流（happy path） |
| 虛線箭頭 | `-.->` | 計時器觸發（超時／提醒）、退回循環、跨分支依賴 |

### 3.3 節點標籤格式

| 類型 | 格式 | 範例 |
|:-----|:-----|:-----|
| 人工任務 | `<編號> <步驟名><br/>(角色名)` | `① Coordinator 審核<br/>(Coordinator)` |
| 系統任務 | `auto: <行為描述>` | `auto: 聚合投票結果` |
| 判斷網關 | 以問號結尾的問句 | `{是否有贊助?}` |
| 結束點 | `End: <狀態><br/>(<業務含義>)` | `End: APPROVED<br/>(活動已發布)` |

### 3.4 步驟編號

帶圈數字（①、②、…）標註人工任務的順序。系統任務不參與編號。

| 編號 | 步驟 | 角色 | 階段 |
|:----:|:-----|:-----|:----:|
| ① | Coordinator 審核 | Coordinator | Phase 1 |
| ② | Checker 審核 | Activity Application Checker | Phase 1 |
| ③ | Supervisors 審核 | Supervisors（並行） | Phase 2 |
| ④ | EO 審批 | EO Venue Reviewer | Phase 3 |
| ⑤ | 嘉賓背書 | Dean / Delegate | Phase 3 |
| ⑥ | 贊助審批 | Dean / Delegate | Phase 3 |
| ⑥' | 活動內容審批（必經） | Dean / Delegate | Phase 3 |
| ⑦ | 最終嘉賓審批 | VP(RD) / VP(RD) Delegate | Phase 3 |
| ⑧ | IRG 選組 | IRG Secretary | Phase 4 |
| ⑨ | IRG 投票 | IRG Member（並行） | Phase 4 |
| ⑩ | IRG 摘要審核 | IRG Secretary | Phase 4 |
| ⑪ | VP 選組 | VPSLA Secretary | Phase 4 |
| ⑫ | VP 投票 | VPSLA Member（並行） | Phase 4 |
| ⑬ | VP 共識決定 | VPSLA Secretary | Phase 5 |
| ⑭ | 最終決定 | VP ChairPerson | Phase 6 |

---

## 4. 流程圖

### 4.1 整體流程

```mermaid
flowchart TD
    Start(["Start: 活動已提交"])
    Start --> Coordinator

    subgraph Phase1["Phase 1: 初審"]
        Coordinator["① Coordinator 審核<br/>(Coordinator)"]
        Coordinator --> CoordGate{Coordinator 是否通過?}
        CoordGate -->|"通過"| CheckerCheck
        CoordGate -->|"退回"| EndReturned

        CheckerCheck{需要 Checker?}
        CheckerCheck -->|"是"| Checker
        CheckerCheck -->|"否"| Supervisors

        Checker["② Checker 審核<br/>(Activity Application Checker)"]
        Checker --> CheckerGate{Checker 是否通過?}
        CheckerGate -->|"通過"| Supervisors
        CheckerGate -->|"退回"| EndReturned
    end

    subgraph Phase2["Phase 2: Supervisor 審核"]
        Supervisors["③ Supervisors 審核<br/>(Supervisors, 並行)"]
        Supervisors --> SuperAggregate[/"auto: 聚合 Supervisor 投票<br/>RETURN > REJECT > RECOMMEND<br/>(增量 Java 聚合, 見 §1.5.3.1)"/]
        SuperAggregate --> SuperGate{聚合結果?}
        SuperGate -->|"RECOMMEND"| EoCheck
        SuperGate -->|"RETURN"| EndReturned
        SuperGate -->|"REJECT"| EndRejected
    end

    subgraph Phase3["Phase 3: 高級審批"]
        EoCheck{場地是否課後使用?}
        EoCheck -->|"是"| EO
        EoCheck -->|"否"| GuestEndorsementCheck

        EO["④ EO 審批<br/>(EO Venue Reviewer)"]
        EO --> EoGate{EO 是否通過?}
        EoGate -->|"通過"| GuestEndorsementCheck
        EoGate -.->|"退回<br/>(回 ③ Supervisor 重審, 見 §1.5.1)"| Supervisors

        GuestEndorsementCheck{是否有外部嘉賓?}
        GuestEndorsementCheck -->|"是"| GuestEndorsement
        GuestEndorsementCheck -->|"否"| SponsorCheck

        GuestEndorsement["⑤ 嘉賓背書<br/>(Dean / Delegate)"]
        GuestEndorsement --> GuestEndorsementGate{是否通過?}
        GuestEndorsementGate -->|"通過"| SponsorCheck
        GuestEndorsementGate -.->|"拒絕<br/>(回 ③ Supervisor 重審, 見 §1.5.1)"| Supervisors

        SponsorCheck{是否有贊助?}
        SponsorCheck -->|"是"| Sponsor
        SponsorCheck -->|"否"| ContentApproval

        Sponsor["⑥ 贊助審批<br/>(Dean / Delegate)"]
        Sponsor --> SponsorGate{是否通過?}
        SponsorGate -->|"通過"| ContentApproval
        SponsorGate -.->|"拒絕<br/>(回 ③ Supervisor 重審, 見 §1.5.1)"| Supervisors

        ContentApproval["⑥' 活動內容審批 (必經)<br/>(Dean / Delegate)"]
        ContentApproval --> ContentGate{是否通過?}
        ContentGate -->|"通過"| NsoaCheck
        ContentGate -.->|"拒絕 / 退回<br/>(回 ③ Supervisor 重審, 見 §1.5.1)"| Supervisors
    end

    subgraph Phase4["Phase 4: NSOA / 非 NSOA 分流"]
        NsoaCheck{是否為 NSOA?}
        NsoaCheck -->|"否"| FinalGuestCheck
        NsoaCheck -->|"是"| ParallelFork

        FinalGuestCheck{是否有外部嘉賓?}
        FinalGuestCheck -->|"是"| Guest
        FinalGuestCheck -->|"否"| PublishTask

        Guest["⑦ 最終嘉賓審批<br/>(VP(RD) / VP(RD) Delegate)"]
        Guest --> GuestGate{guestDecision?}
        GuestGate -->|"APPROVE"| PublishTask
        GuestGate -.->|"RETURN_TO_DEAN<br/>(非 NSOA, 見 §1.5.3)"| ContentApproval
        GuestGate -.->|"RETURN_TO_CHAIR<br/>(NSOA, 見 §1.5.3)"| Chair

        ParallelFork(["Parallel Fork"])
        ParallelFork --> IRGSelect
        ParallelFork --> VPSelect

        IRGSelect["⑧ IRG 選組<br/>(IRG Secretary)"]
        IRGSelect --> LoadIRG[/"auto: 加載 IRG 成員"/]
        LoadIRG --> IRGVote["⑨ IRG 投票<br/>(IRG Member, 並行)"]
        IRGVote --> IRGAiSummary[/"auto: AI 生成 IRG 摘要"/]
        IRGVote -.->|"超時 (未投票自動 RECOMMEND)"| IRGTimeout[/"auto: IRG 超時處理"/]
        IRGTimeout --> IRGAiSummary
        IRGAiSummary --> IRGReview["⑩ IRG 摘要審核<br/>(IRG Secretary)"]
        IRGReview --> IRGCompletion[/"auto: IRG 完成"/]
        IRGCompletion --> ParallelJoin
        IRGCompletion -.->|"解鎖 VP 投票提交"| VPVote

        VPSelect["⑪ VP 選組<br/>(VPSLA Secretary)"]
        VPSelect --> LoadVP[/"auto: 加載 VP 成員"/]
        LoadVP --> VPVote["⑫ VP 投票<br/>(VPSLA Member, 並行)"]
        VPVote -->|"全部投票完成"| VPMerge
        VPVote -.->|"超時 (自動 ABSTAIN)"| VPTimeout[/"auto: VP 超時處理"/]
        VPTimeout --> VPMerge
        VPMerge(["VP 分支合併"]) --> ParallelJoin

        ParallelJoin(["Parallel Join"])
    end

    subgraph Phase5["Phase 5: VP 共識 (僅 NSOA, 最多 3 輪)"]
        ParallelJoin --> VPAiSummary[/"auto: AI 生成 VP 摘要"/]
        VPAiSummary --> VPConsensus

        VPConsensus["⑬ VP 共識決定<br/>(VPSLA Secretary)"]
        VPConsensus --> ConsensusGate{是否達成共識?}
        ConsensusGate -->|"是 (提交主席)"| ChairAI
        ConsensusGate -->|"否 (進入下一輪)"| RoundCheck

        RoundCheck{輪次 < 3?}
        RoundCheck -->|"是"| IncrementRound[/"auto: 下一輪"/]
        IncrementRound -.->|"循環回跳"| VPSelect
        RoundCheck -->|"否 (達到上限)"| ChairAI
    end

    subgraph Phase6["Phase 6: ChairPerson 決定 (僅 NSOA)"]
        ChairAI[/"auto: AI 生成主席建議"/]
        ChairAI --> Chair["⑭ 最終決定<br/>(VP ChairPerson)"]
        Chair --> ChairGate{Chair 決定?}
        ChairGate -->|"PASS"| FinalGuestCheck
        ChairGate -->|"REJECT"| EndRejected
        ChairGate -.->|"RETURN<br/>(見 §1.5.4)"| EndReturned
    end

    PublishTask[/"auto: 發布活動"/]
    PublishTask --> EndApproved

    EndApproved(["End: APPROVED<br/>(活動已發布)"])
    EndRejected(["End: REJECTED"])
    EndReturned(["End: RETURNED<br/>(申請人可修改)"])

    style Start fill:#4CAF50,color:#fff
    style EndApproved fill:#4CAF50,color:#fff
    style EndRejected fill:#f44336,color:#fff
    style EndReturned fill:#FF9800,color:#fff
    style Phase1 fill:#E3F2FD,stroke:#1565C0
    style Phase2 fill:#FFF3E0,stroke:#E65100
    style Phase3 fill:#F3E5F5,stroke:#6A1B9A
    style Phase4 fill:#E0F7FA,stroke:#00695C
    style Phase5 fill:#FFF8E1,stroke:#F57F17
    style Phase6 fill:#FCE4EC,stroke:#AD1457
```

> 圖中虛線 `-.->` 表示非主路徑，分四類：① 高級審批節點 EO / Guest Endorsement / Sponsorship / Activity Content 拒絕／退回時，由 BPMN gate 真正回到 ③ Supervisors 重審（見 §1.5.1）；⑦ Final Guest Approval（VPRD）已改為專屬服務節點，無 reject 路徑——`RETURN_TO_DEAN`（非 NSOA）退回 ⑥' Dean / Delegate 活動內容審批；`RETURN_TO_CHAIR`（NSOA）退回 ⑭ Chair（見 §1.5.3）；② ⑫ VP 投票超時自動 ABSTAIN；③ IRG 完成後解鎖 VP 投票提交；④ ⑭ Chair `RETURN` 走 `endEventReturned`，與其他 RETURN 一致（見 §1.5.4）。

### 4.2 非 NSOA 簡化路徑

僅展示非 NSOA 活動的「快樂路徑」（所有審批均通過），用於快速理解主幹流程。完整退回／拒絕分支見 [§4.1](#41-整體流程)。

```mermaid
flowchart LR
    Start(["Start"]) --> A["① Coordinator 審核<br/>(Coordinator)"]
    A --> D{需要 Checker?}
    D -->|"是"| E["② Checker 審核<br/>(Activity Application Checker)"]
    D -->|"否"| F
    E --> F["③ Supervisors 審核<br/>(Supervisors, 並行)"]
    F --> FA[/"auto: 聚合投票"/]
    FA --> B{場地是否課後使用?}
    B -->|"是"| C["④ EO 審批<br/>(EO Venue Reviewer)"]
    B -->|"否"| G{是否有外部嘉賓?}
    C --> G
    G -->|"是"| H["⑤ 嘉賓背書<br/>(Dean / Delegate)"]
    G -->|"否"| I{是否有贊助?}
    H --> I
    I -->|"是"| J["⑥ 贊助審批<br/>(Dean / Delegate)"]
    I -->|"否"| M
    J --> M
    M["⑥' 活動內容審批 (必經)<br/>(Dean / Delegate)"]
    M --> K{是否有外部嘉賓?}
    K -->|"是"| L["⑦ 最終嘉賓審批<br/>(VP(RD) / VP(RD) Delegate)"]
    K -->|"否"| Pub
    L --> Pub
    Pub[/"auto: 發布活動"/]
    Pub --> End(["End: APPROVED"])

    style Start fill:#4CAF50,color:#fff
    style End fill:#4CAF50,color:#fff
```

### 4.3 NSOA 專屬流程（Phase 4–6）

僅展示 NSOA 活動進入並行評審後的細節。前置 Phase 1–3 與非 NSOA 一致，見 [§4.1](#41-整體流程)。

```mermaid
flowchart TD
    Entry(["進入 Phase 4<br/>(NSOA 活動)"])
    Entry --> ParallelFork(["Parallel Fork"])

    ParallelFork --> IRGBranch
    ParallelFork --> VPBranch

    subgraph IRGBranch["IRG 分支"]
        IRGSelect["⑧ IRG 選組<br/>(IRG Secretary)"]
        IRGSelect --> LoadIRG[/"auto: 加載 IRG 成員"/]
        LoadIRG --> IRGVote["⑨ IRG 投票<br/>(IRG Member, 並行)<br/>RECOMMEND / RESERVE / REJECT"]
        IRGVote --> IRGSummary[/"auto: AI 生成 IRG 摘要"/]
        IRGVote -.->|"超時 (未投自動 RECOMMEND)"| IRGTimeoutTask[/"auto: IRG 超時處理"/]
        IRGTimeoutTask --> IRGSummary
        IRGSummary --> IRGReview["⑩ IRG 摘要審核<br/>(IRG Secretary)"]
        IRGReview --> IRGDone[/"auto: IRG 完成"/]
    end

    subgraph VPBranch["VP 分支"]
        VPSelect["⑪ VP 選組<br/>(VPSLA Secretary)"]
        VPSelect --> LoadVP[/"auto: 加載 VP 成員"/]
        LoadVP --> VPVote["⑫ VP 投票<br/>(VPSLA Member, 並行)<br/>APPROVE / REJECT / ABSTAIN"]
        VPVote --> VPMerge(["VP 分支合併"])
    end

    IRGDone -.->|"解鎖 VP 投票提交"| VPVote
    IRGDone --> Join(["Parallel Join"])
    VPMerge --> Join

    Join --> VPSummary[/"auto: AI 生成 VP 摘要"/]
    VPSummary --> VPDecide["⑬ VP 共識決定<br/>(VPSLA Secretary)"]
    VPDecide --> Gate{是否達成共識?}
    Gate -->|"是 (提交主席)"| ChairAI
    Gate -->|"否 (進入下一輪)"| RoundCheck{輪次 < 3?}
    RoundCheck -->|"是"| Increment[/"auto: 下一輪"/]
    Increment -.->|"循環回跳"| VPSelect
    RoundCheck -->|"否 (達到上限)"| ChairAI

    ChairAI[/"auto: AI 生成主席建議"/]
    ChairAI --> Chair["⑭ 最終決定<br/>(VP ChairPerson)"]
    Chair --> FinalGate{Chair 決定?}
    FinalGate -->|"PASS"| FinalGuestCheck{有外部嘉賓?}
    FinalGate -->|"REJECT"| EndRejected(["End: REJECTED"])
    FinalGate -.->|"RETURN<br/>(見 §1.5.4)"| EndReturned(["End: RETURNED<br/>(申請人可修改)"])
    FinalGuestCheck -->|"是"| FinalGuest["⑦ 最終嘉賓審批<br/>(VP(RD) / VP(RD) Delegate)"]
    FinalGuestCheck -->|"否"| EndApproved(["End: APPROVED<br/>(發布活動)"])
    FinalGuest --> FinalGuestGate{guestDecision?}
    FinalGuestGate -->|"APPROVE"| EndApproved
    FinalGuestGate -.->|"RETURN_TO_CHAIR<br/>(回 ⑭ Chair, 見 §1.5.3)"| Chair

    style Entry fill:#2196F3,color:#fff
    style EndApproved fill:#4CAF50,color:#fff
    style EndRejected fill:#f44336,color:#fff
    style EndReturned fill:#FF9800,color:#fff
    style IRGBranch fill:#E0F7FA,stroke:#00695C
    style VPBranch fill:#FFF8E1,stroke:#F57F17
```

#### 4.3.1 VP 多輪循環

當 ⑫ VPSLA Secretary 判定**未達成共識**時：

1. 流程從 ⑫ 之後的網關回跳到 ⑩ VP 選組，僅 VP 分支重新執行（IRG 分支首輪結束時已完成,不會再次觸發）。
2. 第二、第三輪 VP 分支完成後到達 Parallel Join 時，IRG 分支保持已完成狀態,因此 Join 立即通過。
3. 最多執行 3 輪。第 3 輪結束時無論共識與否都強制進入 ⑬ ChairPerson 決定。
4. **新一輪開始後,前一輪未提交的投票即失效**:當 VP Secretary 宣告未達共識並進入下一輪,前一輪沒及時提交投票的成員,在新一輪開始後再提交舊輪投票會被系統拒絕。這確保新一輪的共識判斷只看本輪實際結果,不被遲到的舊輪投票影響。

#### 4.3.2 跨分支依賴：VP 投票提交鎖

⑪ VP 投票在流程上與 IRG 分支獨立並行,但在業務上：

- IRG 分支完成（即 ⑨ IRG 摘要審核結束）**之前**,VPSLA Member 可以查看任務、暫存草稿,但不能正式提交投票。
- IRG 完成後,VPSLA Member 才能提交投票。

業務上不希望 VP 在缺少 IRG 摘要參考時投票，因此設立此鎖。圖中以虛線 `IRG 完成 -.-> VP 投票` 表達此依賴。

---

## 5. 步驟詳述

按 ①–⑬ 順序列出所有人工任務。

### ① Coordinator 審核

- **執行人**：Coordinator
- **動作**：審核活動基本信息；判斷是否需要 Checker；如需要則指派一位 Checker
- **結果**：
  - 通過 → 進入 ② Checker 審核（如已指派）或 ③ Supervisors 審核
  - 退回 → 流程結束（`RETURNED`）

### ② Checker 審核

- **執行人**：Activity Application Checker（由 Coordinator 指派）
- **觸發條件**：① 中決定需要 Checker
- **動作**：對活動內容作詳細審查
- **結果**：
  - 通過 → 進入 ③ Supervisors 審核
  - 退回 → 流程結束（`RETURNED`）

### ③ Supervisors 審核（並行）

- **執行人**：所有 Supervisor 並行
- **動作**：每位 Supervisor 給出個人決定（`RECOMMEND` / `REJECT` / `RETURN`）；同時確認場地是否涉及課後使用
- **聚合規則**（系統自動執行）：
  1. 任何一位投 `RETURN` → 聚合 = `RETURN`（最高優先級）
  2. 全部投 `RECOMMEND` → 聚合 = `RECOMMEND`
  3. 有 `REJECT` 但無 `RETURN` → 聚合 = `REJECT`
  4. `RECOMMEND` 與 `REJECT` 混合 → 聚合 = `REJECT`
- **結果**：
  - `RECOMMEND` → 進入 Phase 3
  - `RETURN` → 流程結束（`RETURNED`）
  - `REJECT` → 流程結束（`REJECTED`）

### ④ EO 審批

- **執行人**：EO Venue Reviewer
- **觸發條件**：Supervisor 在 ③ 確認場地涉及課後使用
- **動作**：審批場地課後使用
- **結果**：
  - 通過 → 進入 ⑤ 嘉賓背書檢查
  - 退回 → 回到 ③ Supervisor 多實例**重新審核**（見 §1.5.1）

> EO 表單上只有「通過 / 退回」兩個按鈕，沒有「拒絕」。「退回」按鈕走通用 `/bpm/task/approve` 接口並把 `approved=false` 寫入流程變量，BPMN gate `flow_eo_return_supv` 真正觸發 → 重新派發 supervisor 多實例任務。BPMN 註釋 `<!-- EO returns → back to Supervisors (no reject path) -->` 已明示此設計：場地審批未過時由 Supervisor 重新評估方案是否仍推薦，而非直接退回申請人。如需直接退回申請人，需由 Supervisor 在重審時自行投 `RETURN` / `REJECT`。

### ⑤ 嘉賓背書

- **執行人**：Dean / Delegate（候選組,先到先審）
- **觸發條件**：活動聲明有外部嘉賓
- **動作**：對外部嘉賓安排作前置背書
- **結果**：
  - 通過 → 進入 ⑥ 贊助審批檢查
  - 拒絕 → 回到 ③ Supervisor 多實例**重新審核**（見 §1.5.1）

### ⑥ 贊助審批

- **執行人**：Dean / Delegate（候選組,先到先審）
- **觸發條件**：活動聲明有贊助
- **動作**：審批贊助相關內容
- **結果**：
  - 通過 → 進入 ⑥' 活動內容審批
  - 拒絕 → 回到 ③ Supervisor 多實例**重新審核**（見 §1.5.1）

### ⑥' 活動內容審批（必經）

- **執行人**：Dean / Delegate（候選組,先到先審）
- **觸發條件**：**無條件**——Supervisor 通過後一定會進入此節（無論活動是否有嘉賓 / 贊助）
  - 若有嘉賓 / 贊助，則 ⑤ ⑥ 先執行，最後匯流到 ⑥'
  - 若都沒有，則 EO 通過後直接進入 ⑥'
- **動作**：對活動內容與預算等整體資訊作 `Approve` / `Return` / `Reject` 決定
- **結果**：
  - `Approve` → 進入 NSOA / 非 NSOA 分流
  - `Return` / `Reject` → 回到 ③ Supervisor 多實例**重新審核**（見 §1.5.1）

> 說明：表單上的 `Return` 與 `Reject` 兩個按鈕在當前實現裡都走 `approveTask(approved=false)`，由 BPMN gate `flow_activity_content_rejected` 真正觸發 → 重派 supervisor 多實例。兩按鈕在流程上等價，僅在前端 `taskStatus` / `reason` 欄位語義略有區別。如需區分業務語義（駁回 vs 暫退），目前只能依賴主管在 `reason` 欄位自行寫明，或將來把其中一個按鈕改走 `/bpm/task/reject` 走 endEventReturned 短路。

### ⑦ 最終嘉賓審批

- **執行人**：VP(RD) / VP(RD) Delegate（候選組,先到先審）
- **觸發條件**：活動聲明有外部嘉賓，且：
  - `非 NSOA`：在一般高級審批後進入
  - `NSOA`：在 `Chair PASS` 後進入
- **服務方法**：`guestApprovalDecision(...)` `POST /activity/approval/guest/decision`（專屬端點，**不走** `approveTask`，見 §1.5.3）
- **前端表單**：`GuestApprovalForm.vue`
- **動作**：對外部嘉賓安排作最終決定，決定值由 `GuestDecisionEnum` 限定為以下三選一：
  - `APPROVE`
  - `RETURN_TO_CHAIR`（**僅 NSOA**）
  - `RETURN_TO_DEAN`（**僅非 NSOA**）
- **結果**：
  - `APPROVE` → 直接發布（`APPROVED`）
  - `RETURN_TO_CHAIR`（NSOA only）→ 退回 ⑭ Chair 重審；Chair 可再次決定 `PASS / REJECT / RETURN`
  - `RETURN_TO_DEAN`（非 NSOA only）→ 退回 ⑥' Dean / Delegate 活動內容審批；流程繼續按一般高級審批的 RETURN 邏輯走（見 §1.5.1）
  - **無 reject 路徑**——VPRD 不能在此節點直接駁回流程；如需駁回，由 NSOA 路徑下的 ⑭ Chair `REJECT` 完成，或由非 NSOA 路徑下退回 Dean 後再經 supervisor 重審觸發

> **注意**：`NSOA` 活動不是跳過 ⑦，而是將 ⑦ 延後到 `Chair PASS` 之後。

### ⑧ IRG 選組

- **執行人**：IRG Secretary
- **觸發條件**：NSOA 活動進入並行評審
- **動作**：選擇本次的 IRG 評審組
- **結果**：系統自動加載該組成員,進入 ⑨

### ⑨ IRG 投票（並行）

- **執行人**:所有 IRG Member 並行(**不含 IRG Secretary**)。Secretary 負責的是 ⑧ 選組與 ⑩ 摘要審核兩個組織性任務,不參與本輪投票。
- **動作**：每位投 `RECOMMEND` / `RESERVE` / `REJECT`
- **截止時間**：`irgVoteDeadline`(IRG Secretary 在 ⑧ 設定)
- **結果**：
  - 正常路徑:全部完成後進入「auto: AI 生成 IRG 摘要」, 再進入 ⑩
  - 超時路徑(commit `7faa9acc2`, 2026-05-12 引入):若 deadline 前未全部投票,boundary timer event 取消多實例任務,觸發 `activityIrgTimeoutDelegate` 把未投票者標記為預設 `RECOMMEND`,**跳過剩餘多實例**直接進入 AI 摘要 → ⑩
- **對 ⑩ Secretary 摘要審核的影響**:超時路徑下,Secretary 仍然會看到 ⑩ 任務,但摘要中部分 IRG Member 的決定來自系統預設而非實際投票
- **對 §4.3.2 VP 投票提交鎖的影響**:超時路徑下,`irgCompletionNotifyTask` 仍照常執行,VP 提交鎖照常解除

### ⑩ IRG 摘要審核

- **執行人**：IRG Secretary
- **動作**：審核系統 AI 自動生成的 IRG 投票摘要
- **結果**：完成後 IRG 分支結束;觸發兩件事：
  1. 解鎖 VP 投票的提交（見 §4.3.2）
  2. 進入並行 Join
- **VP 參考摘要來源**：⑩ 完成時，系統會優先讀取 `activity_ai_summary_cache` 中該 `activityId + processInstanceId` 的**最新 IRG 摘要**，再寫入 VP 端可見的 `irgSummaryForVp`。因此，若 Secretary 在 ⑩ 前重新生成 / 覆核過摘要，VP 與後續 Chair 看到的會是**最新缓存版本**，而不是最早那份 runtime 變量副本。
- **AI 失敗容錯**（commit `9345f771e`, 2026-05-14）：若 EdUHK AI 未配置、返回空白，或只產生失敗佔位文案，系統現在會**清空 `irgAiSummary` / `irgSummaryForVp` 相關 runtime 變量**，而不是把 `AI summary generation failed: ...` 這類錯誤字串繼續帶到 VP 流程。此時 ⑩ 任務與後續 VP 提交解鎖**仍可正常完成**，但 VP / Chair 端可能看不到 IRG AI 摘要，需要改為人工閱讀 IRG 原始投票與評論。
- **完成後回看**：IRG Secretary 在審核完成、流程推進到後續節點後,仍然可以打開該活動回看自己審核過的 AI 摘要;歷史 IRG Member 也能查閱自己參與過的那次投票摘要。這方便事後追溯與覆審。

### ⑪ VP 選組

- **執行人**：VPSLA Secretary
- **觸發條件**：NSOA 活動進入並行評審；或 ⑬ 判定未達共識時回跳重新選組
- **動作**：選擇本次的 VP 評審組;設定 VP 投票截止時間
- **結果**:系統自動加載 VP 評審組成員、計算截止時間,並在生成投票名單時**自動排除 VPSLA Secretary 與 ChairPerson** — 他們不投票,各自負責 ⑪ 選組 / ⑬ 共識判定 / ⑭ 最終決定三個組織與決策性任務。系統發出投票任務後,進入 ⑫。

### ⑫ VP 投票（並行,有截止時間）

- **執行人**:所有 VPSLA Member 並行(**不含 VPSLA Secretary 與 ChairPerson**)
- **動作**:每位投 `APPROVE` / `REJECT` / `ABSTAIN`
- **提交時序限制**:在 ⑩ IRG 摘要審核完成之前,VP Member 看得到任務但無法提交投票(業務上希望 VP 在投票前能參考 IRG 的審查結論,見 §4.3.2)
- **多輪投票時的舊票失效**:當 ⑬ 判定未達共識並進入下一輪,前一輪沒及時提交的投票會被拒絕,確保新一輪的聚合結果只反映本輪實際表決,不被遲到的舊輪票影響
- **超時處理**:投票截止時間到達時,系統自動為未投票成員記為 `ABSTAIN`,並推進流程
- **結果**:全部投票完成(或超時觸發後)→ 進入並行 Join

### ⑬ VP 共識決定

- **執行人**：VPSLA Secretary
- **動作**：審核 VP 投票結果, 手動判定本輪是否達成共識（共識判定參考：排除棄權票後, 所有有效票一致為 `APPROVE` 或 `REJECT`）
- **結果**：
  - 已達成共識 → 進入 ⑭ ChairPerson 決定
  - 未達成共識且輪次 < 3 → 回到 ⑪ 重新選組投票
  - 未達成共識且已是第 3 輪 → 強制進入 ⑭ ChairPerson 決定

### ⑭ 最終決定

- **執行人**：VP ChairPerson
- **觸發條件**：⑫ 達成共識,或已完成 3 輪投票
- **前置**：系統自動生成「主席建議」供 ChairPerson 參考
- **結果**：
  - `PASS` → 先進入 `checkGuestGate`
    - 如 `hasExternalGuest == true` → 進入 ⑦ 最終嘉賓審批
    - 如 `hasExternalGuest == false` → 系統自動發布活動,流程結束（`APPROVED`）
  - `REJECT` → 流程結束（`REJECTED`）
  - `RETURN` → 流程結束（`RETURNED`）：BPMN `flow_chair_return → endEventReturned`；Java 同步將 `activity.approvalStatus` 置為 `RETURNED` 並發退回通知給申請人；**不再生成新的主管待辦**（見 §1.5.4）

---

## 6. 結果對照表

| 決策點 | 決定 | 最終狀態 | 申請人後續可進行 |
|:-------|:-----|:--------|:----------------|
| ① Coordinator | 退回 | `RETURNED` | 修改後重新提交 |
| ② Checker | 退回 | `RETURNED` | 修改後重新提交 |
| ③ Supervisor 聚合 | `RETURN` | `RETURNED` | 修改後重新提交 |
| ③ Supervisor 聚合 | `REJECT` | `REJECTED` | — |
| ④ EO | 退回 | （回到 ③ 重審；最終狀態由重審結果決定） | 等 ③ 重審結束後再看（見 §1.5.1） |
| ⑤ Guest Endorsement | 拒絕 | （回到 ③ 重審；最終狀態由重審結果決定） | 等 ③ 重審結束後再看（見 §1.5.1） |
| ⑥ Sponsorship | 拒絕 | （回到 ③ 重審；最終狀態由重審結果決定） | 等 ③ 重審結束後再看（見 §1.5.1） |
| ⑥' Activity Content | `Return` / `Reject` | （回到 ③ 重審；最終狀態由重審結果決定） | 等 ③ 重審結束後再看（兩按鈕當前都走 `approveTask(approved=false)`，流程上等價，見 §1.5.1） |
| ⑦ Final Guest Approval（VPRD） | `APPROVE` | `APPROVED`（活動發布） | — |
| ⑦ Final Guest Approval（VPRD） | `RETURN_TO_CHAIR`（NSOA only） | （回到 ⑭ Chair；最終狀態由 Chair 重新決定） | 等 ⑭ 重新決定後再看（見 §1.5.3） |
| ⑦ Final Guest Approval（VPRD） | `RETURN_TO_DEAN`（非 NSOA only） | （回到 ⑥' Dean / Delegate 活動內容審批；最終狀態由其重審結果決定） | 等 ⑥' 重審結束後再看（見 §1.5.3） |
| ⑭ ChairPerson | `PASS` | （如有外部嘉賓則進入 ⑦，否則 `APPROVED`） | — |
| ⑭ ChairPerson | `REJECT` | `REJECTED` | — |
| ⑭ ChairPerson | `RETURN` | `RETURNED`（`flow_chair_return → endEventReturned`，已統一，見 §1.5.4） | 修改後重新提交 |

---

## 7. 場景示例

### 場景 1：非 NSOA 最簡路徑

**條件**：非 NSOA, 無 Checker, 不涉及 `campus public venue`, 場地不涉及課後使用, 無贊助, 無外部嘉賓

```
① Coordinator → ③ Supervisor → 聚合(RECOMMEND) → ⑥' Dean / Delegate 活動內容審批 → 發布 ✅
```

> 即便活動沒有贊助和嘉賓，Supervisor 通過後仍須由 Dean / Delegate 在 ⑥' 做最終 `Approve / Return / Reject` 決定才會發布。

### 場景 2：非 NSOA 完整路徑

**條件**：非 NSOA, 需 Checker, 場地涉及課後使用, 有贊助, 有外部嘉賓

```
① Coordinator → ② Activity Application Checker → ③ Supervisor → 聚合 → ④ EO Venue Reviewer → ⑤ Dean / Delegate 背書 → ⑥ Dean / Delegate 贊助審批 → ⑥' Dean / Delegate 活動內容審批 → ⑦ VP(RD) / VP(RD) Delegate → 發布 ✅
```

### 場景 3：非 NSOA + EO 退回

**條件**：場地涉及課後使用, EO 不批准

```
① Coordinator → ③ Supervisor → 聚合 → ④ EO Venue Reviewer(退回) → ③ Supervisor(重新審核) → ...
```

### 場景 4：NSOA 最簡路徑

**條件**：NSOA, 無 Checker, 不涉及 `campus public venue`, 場地不涉及課後使用, 無贊助, 無外部嘉賓

```
① Coordinator → ③ Supervisor → 聚合
→ （如有外部嘉賓）⑤ Dean / Delegate 背書
→ （如有贊助）⑥ Dean / Delegate 贊助審批
→ ⑥' Dean / Delegate 活動內容審批（必經）
→ 並行: { ⑧ IRG 選組 → ⑨ IRG 投票 → ⑩ IRG 審核 → IRG 完成 }
         { ⑪ VP 選組 → ⑫ VP 投票 }
→ 並行 Join → VP AI 摘要 → ⑬ VP 共識 → ⑭ VP ChairPerson 決定
→ （如有外部嘉賓）⑦ VP(RD) / VP(RD) Delegate → 發布 ✅
```

### 場景 5：NSOA 完整路徑 + VP 多輪投票

**條件**：所有條件均觸發, VP 共識未達成

```
① Coordinator → ② Activity Application Checker → ③ Supervisor → 聚合 → ④ EO Venue Reviewer
→ （如有外部嘉賓）⑤ Dean / Delegate 背書
→ （如有贊助）⑥ Dean / Delegate 贊助審批
→ ⑥' Dean / Delegate 活動內容審批（必經）
→ 並行: { IRG 流程 } + { VP 投票 } → 並行 Join
→ VP AI 摘要 → ⑬ VP 共識(否)
→ ⑪ VP 選組(第 2 輪) → ⑫ VP 投票 → VP AI 摘要 → ⑬ VP 共識(否)
→ ⑪ VP 選組(第 3 輪) → ⑫ VP 投票 → VP AI 摘要 → ⑬ VP 共識(否)
→ ⑭ VP ChairPerson 決定（強制進入）
→ （如有外部嘉賓）⑦ VP(RD) / VP(RD) Delegate
→ 發布／拒絕／退回
```

---

## 8. 角色與審批節點對照表

下表為活動發布流程中每個審批節點所對應的系統角色,及其工作職能與下一個環節的處理規則。多人並行的節點按典型實例數重複列出,以反映實際運行時並行的多個角色實例。

| 角色 ID | 系統角色名稱 | 審批節點 | 工作職能描述 | 下一個環節 |
|:-------:|:------------|:--------|:-----------|:----------|
| - | Group Leader | 發起申請 | 學生組織負責人,提交活動申請以觸發審批流程 | ① Coordinator 審核 |
| 115 | Coordinator | ① Coordinator 審核 | 初審活動基本信息;判斷是否需要 Activity Application Checker;如需要則指派一位 Checker | 通過且需 Checker → ② Activity Application Checker 審核;通過且無需 → ③ Supervisor 審核;退回 → 流程結束（`RETURNED`,可修改後重新提交） |
| 142 | Activity Application Checker | ② Checker 審核 | 由 Coordinator 指派,對活動內容作詳細審查 | 通過 → ③ Supervisor 審核;退回 → 流程結束（`RETURNED`,可修改後重新提交） |
| 116 | Supervisor | ③ Supervisor 審核 (多實例) | 並行多人,各自給 `RECOMMEND` / `REJECT` / `RETURN` 個人決定;同時確認場地是否課後使用 | 全員提交後系統按聚合規則得出最終結果（見 §5） |
| 116 | Supervisor | ③ Supervisor 審核 (多實例) | 同上 | 同上 |
| 116 | Supervisor | ③ Supervisor 審核 (多實例) | 同上 | 同上 |
| - | （系統聚合）| auto: 聚合 Supervisor 投票 | 規則：任一 `RETURN` → 整體 `RETURN`;全員 `RECOMMEND` → 整體 `RECOMMEND`;含 `REJECT` 但無 `RETURN` → 整體 `REJECT`。實現為增量 Java 聚合（commit `5edae8ab9`），詳見 §1.5.3.1 | `RECOMMEND` → ④ EO 審批（如涉及 `campus public venue` 或課後使用）或進入 ⑤ 嘉賓背書/⑥ 贊助/⑥' 內容審批 序列;`RETURN` → 流程結束（`RETURNED`）;`REJECT` → 流程結束（`REJECTED`） |
| 141 | EO Venue Reviewer | ④ EO 審批 | 審批 `campus public venue` 與課後使用（僅當 Supervisor 在 ③ 確認其中任一項成立時觸發） | 通過 → 進入 ⑤ 嘉賓背書/⑥ 贊助/⑥' 內容審批 序列;退回 → 回到 ③ Supervisor 重新審核（見 §1.5.1） |
| 149 | Dean | ⑤ 嘉賓背書 / ⑥ 贊助審批 / ⑥' 活動內容審批 (候選組之一) | 對外部嘉賓先作背書，承接贊助審批，並對活動內容 / 預算作必經的最終把關 | ⑤ 通過 → ⑥（如有贊助）或 ⑥'；⑥ 通過 → ⑥'；⑥' 通過 → 進入 NSOA / 非 NSOA 分流；⑤/⑥/⑥' 任一拒絕 → 回到 ③ Supervisor 重新審核（見 §1.5.1） |
| 150 | Delegate | ⑤ 嘉賓背書 / ⑥ 贊助審批 / ⑥' 活動內容審批 (候選組之一) | 與 Dean 共用候選組，先到先審 | 同 ⑤ / ⑥ / ⑥' 各自的下一環節 |
| 151 | VP(RD) | ⑦ 最終嘉賓審批 (候選組之一) | 最新 BPMN 中的最終外部嘉賓審批角色；`非 NSOA` 直接進入，`NSOA` 於 `Chair PASS` 後進入；走 `guestApprovalDecision` 專屬端點 | `APPROVE` → 直接發布;`RETURN_TO_DEAN`（非 NSOA only）→ 回到 ⑥' Dean / Delegate 活動內容審批;`RETURN_TO_CHAIR`（NSOA only）→ 回到 ⑭ Chair（見 §1.5.3） |
| 152 | VP(RD) Delegate | ⑦ 最終嘉賓審批 (候選組之一) | VP(RD) 委派角色，與 VP(RD) 共候選組 | 同 VP(RD) |
| - | （系統判斷）| 是否為 NSOA? | 根據活動是否標記為 NSOA 分流 | 是 → 進入並行 IRG / VP 評審分支;否 → 進入 `checkGuestGate`（有嘉賓 → ⑦；無嘉賓 → `APPROVED`） |
| 144 | IRG Secretary | ⑧ IRG 選組 | 選擇本次的 IRG 評審組 | → 系統自動加載 IRG 成員,進入 ⑨ |
| 145 | IRG Member | ⑨ IRG 投票 (多實例) | 並行多人,各自投 `RECOMMEND` / `RESERVE` / `REJECT`;有截止時間 `irgVoteDeadline` | 全員投票完成 → auto: AI 生成 IRG 摘要 → ⑩;或超時 → `activityIrgTimeoutDelegate` 將未投票者標記為預設 `RECOMMEND` → 直接進 AI 摘要(跳過剩餘多實例) |
| 145 | IRG Member | ⑨ IRG 投票 (多實例) | 同上 | 同上 |
| 145 | IRG Member | ⑨ IRG 投票 (多實例) | 同上 | 同上 |
| 144 | IRG Secretary | ⑩ IRG 摘要審核 | 審核系統 AI 自動生成的 IRG 投票摘要 | 完成 → IRG 分支結束 + 解鎖 VP 投票提交 + 進入並行 Join |
| 146 | VPSLA Secretary | ⑪ VP 選組 | 選擇本次 VP 評審組;設定 VP 投票截止時間;指定 VP ChairPerson | → 系統自動加載成員、計算截止時間、識別並排除 ChairPerson,進入 ⑫ |
| 147 | VPSLA Member | ⑫ VP 投票 (多實例) | 並行多人（不含 ChairPerson）,各自投 `APPROVE` / `REJECT` / `ABSTAIN`;在 IRG 分支完成前無法提交 | 全員投票完成（或超時自動 `ABSTAIN`）→ 進入並行 Join |
| 147 | VPSLA Member | ⑫ VP 投票 (多實例) | 同上 | 同上 |
| 147 | VPSLA Member | ⑫ VP 投票 (多實例) | 同上 | 同上 |
| 146 | VPSLA Secretary | ⑬ VP 共識決定 | 審核 VP 投票結果,手動判定是否達成共識（共識判定參考：排除棄權票後,所有有效票一致為 `APPROVE` 或 `REJECT`） | 達成共識 → ⑭ ChairPerson 決定;未達共識且輪次 < 3 → 回到 ⑪ 重新選組投票（循環,最多 3 輪）;未達共識且為第 3 輪 → 強制進入 ⑭ |
| 147 | VP ChairPerson | ⑭ 最終決定 | 由 VPSLA Secretary 在 ⑪ 階段指定的一位 VPSLA Member,作最終決定 | `PASS` → 先進入 `checkGuestGate`（有嘉賓 → ⑦；無嘉賓 → `APPROVED`）;`REJECT` → 流程結束（`REJECTED`）;`RETURN` → 流程結束（`RETURNED`，`flow_chair_return → endEventReturned`，已統一，見 §1.5.4） |

> **多實例行說明**：上表中標 "多實例" 的角色（Supervisor、IRG Member、VP Member/VPSLA Member）以 3 行重複列出,僅作格式示意。實際運行時並行的人數依配置而定,可多可少。
