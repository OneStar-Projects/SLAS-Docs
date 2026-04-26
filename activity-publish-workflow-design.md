# 活動發布審批流程設計文檔

## Activity Publish Approval Workflow Design

> 本文檔描述 SLAS 系統中活動發布審批的完整流程，包括 NSOA（新生迎新活動）和非 NSOA 兩種場景。

---

## 1. 流程概覽

活動發布審批流程是一個條件分支流程，根據活動類型和特性決定審批路徑：

- **非 NSOA 活動**：經過基礎審批後直接發布
- **NSOA 活動**：需要額外經過 IRG（Initial Review Group）和 VP（Vetting Panel）**並行**評審

流程支持三種結束狀態：
- **APPROVED**：活動通過審批並發布
- **REJECTED**：活動被拒絕
- **RETURNED**：活動退回申請人修改，可重新提交

---

## 2. 條件變量

### 2.1 流程啟動時初始化的變量

| 變量 | 類型 | 說明 | 來源 |
|:-----|:-----|:-----|:-----|
| `isNsoa` | Boolean | 是否為 NSOA（新生迎新活動） | 活動數據 `activity.isNsoa` |
| `hasSponsorship` | Boolean | 是否有贊助 | 活動數據 `activity.hasSponsorship` |
| `hasExternalGuest` | Boolean | 是否有外部嘉賓 | 活動數據（外部嘉賓學生/校友/其他人數任一 > 0） |
| `assignChecker` | Boolean | 是否分配 Checker | 初始化為 `false`，由 Coordinator 審核時設定 |
| `vpRoundNumber` | int | VP 投票輪次 | 初始化為 `1` |
| `supervisorsAllApproved` | Boolean | Supervisors 是否全部通過 | 初始化為 `true` |

### 2.2 流程運行中動態設定的變量

| 變量 | 類型 | 說明 | 設定者 |
|:-----|:-----|:-----|:-------|
| `supvVenueAfterhrs` | Boolean | Supervisor 確認場地是否涉及課後使用 | Supervisor 審核時設定 |
| `supvDecision` | String | 每位 Supervisor 的個人決定 | Supervisor 審核時設定（RECOMMEND/REJECT/RETURN） |
| `supvAggregateDecision` | String | Supervisor 聚合決定 | `activitySupervisorAggregateDelegate` 計算 |
| `vpConsensus` | Boolean | VP Secretary 是否判定達成共識 | VP Secretary 手動設定 |
| `chairDecision` | String | ChairPerson 最終決定 | ChairPerson 設定（PASS/REJECT/RETURN） |
| `irgCompleted` | Boolean | IRG 評審是否完成 | `activityIrgCompletionDelegate` 設定 |

---

## 3. 審批角色

### 3.1 角色定義

| 角色/組 ID | 角色名稱 | 職責 |
|:-----------|:---------|:-----|
| 140 | Activity Coordinator | 初審、分配 Checker |
| 141 | Estate Office | 審批場地課後使用 |
| 142 | Sponsorship Approver | 贊助審批（候選組，包含 Head/Dean 等角色） |
| 143 | Guest Approver | 外部嘉賓審批（候選組，包含 Delegate/Dean 等角色） |
| - | Checker | 詳細審查（由 Coordinator 指定的特定用戶） |
| - | Supervisors | 監督審核（並行多實例，遍歷 `supervisorUserIds`） |
| 144 | IRG Secretary | IRG 流程管理 |
| 145 | IRG Member | IRG 投票成員 |
| 146 | VP Secretary | VP 流程管理 |
| 147 | VP Member | VP 投票成員 |
| - | VP ChairPerson | VP 主席（最終決定，由 `vpChairPersonUserId` 指定） |

### 3.2 多角色審批規則

| 審批任務 | 候選組 ID | 規則 |
|:---------|:----------|:-----|
| ⑤ 贊助審批 | 142 | 候選組內的任一用戶可認領並審批（通過 `candidateStrategy=40`） |
| ⑥ 嘉賓審批 | 143 | 候選組內的任一用戶可認領並審批（通過 `candidateStrategy=40`） |

---

## 4. 完整流程圖

### 4.1 整體流程（Mermaid）

```mermaid
flowchart TD
    Start(["Start: Activity Publish Submitted<br/>(ActivityServiceImpl.startActivityApprovalWorkflow)"])
    Start --> Coordinator

    subgraph Phase1["Phase 1: Initial Review"]
        Coordinator["① Coordinator Review<br/>(Group 140)<br/>Assign Checker"]
        Coordinator --> CoordGate{Coordinator<br/>Decision}
        CoordGate -->|"approved=true"| CheckerCheck
        CoordGate -->|"approved=false"| EndReturned

        CheckerCheck{assignChecker?}
        CheckerCheck -->|"true"| Checker
        CheckerCheck -->|"false"| Supervisors

        Checker["② Checker Review<br/>(Assigned by Coordinator)<br/>checkerUserId"]
        Checker --> CheckerGate{Checker<br/>Decision}
        CheckerGate -->|"approved=true"| Supervisors
        CheckerGate -->|"approved=false"| EndRejected
    end

    subgraph Phase2["Phase 2: Supervisor Review"]
        Supervisors["③ Supervisors Review<br/>(Parallel Multi-Instance)<br/>Collection: supervisorUserIds"]
        Supervisors --> SuperAggregate[/"Aggregate Votes<br/>(activitySupervisorAggregateDelegate)"/]
        SuperAggregate --> SuperGate{Supervisor<br/>Aggregate Decision}
        SuperGate -->|"RECOMMEND<br/>(supervisorsAllApproved=true)"| EoCheck
        SuperGate -->|"RETURN<br/>(supvAggregateDecision=RETURN)"| EndReturned
        SuperGate -->|"REJECT<br/>(supervisorsAllApproved=false)"| EndRejected
    end

    subgraph Phase3["Phase 3: EO & Senior Approval"]
        EoCheck{supvVenueAfterhrs=true?}
        EoCheck -->|"true"| EO
        EoCheck -->|"false / null"| SponsorCheck

        EO["④ EO Approval<br/>(Group 141)<br/>Venue After-Hours"]
        EO --> EoGate{EO<br/>Decision}
        EoGate -->|"approved=true"| SponsorCheck
        EoGate -->|"approved=false<br/>(return to Supervisors)"| Supervisors

        SponsorCheck{hasSponsorship?}
        SponsorCheck -->|"true"| Sponsor
        SponsorCheck -->|"false"| GuestCheck

        Sponsor["⑤ Sponsorship Approval<br/>(Group 142)<br/>candidateStrategy=40"]
        Sponsor --> SponsorGate{Sponsorship<br/>Decision}
        SponsorGate -->|"approved=true"| GuestCheck
        SponsorGate -->|"approved=false"| EndRejected

        GuestCheck{hasExternalGuest?}
        GuestCheck -->|"true"| Guest
        GuestCheck -->|"false"| NsoaCheck

        Guest["⑥ Guest Approval<br/>(Group 143)<br/>candidateStrategy=40"]
        Guest --> GuestGate{Guest<br/>Decision}
        GuestGate -->|"approved=true"| NsoaCheck
        GuestGate -->|"approved=false"| EndRejected

        NsoaCheck{isNsoa?}
        NsoaCheck -->|"false"| PublishTask
        NsoaCheck -->|"true"| ParallelFork
    end

    subgraph Phase4["Phase 4: IRG + VP Parallel Review (NSOA Only)"]
        ParallelFork(["Parallel Fork"])

        ParallelFork --> IRGSelect
        ParallelFork --> VPSelect

        IRGSelect["⑦ IRG Secretary Select Group<br/>(Role 144)"]
        IRGSelect --> LoadIRG[/"Load IRG Members<br/>(activityIrgLoadMembersDelegate)<br/>By Role 145"/]
        LoadIRG --> IRGVote["⑧ IRG Members Vote<br/>(Role 145 candidateGroup)<br/>RECOMMEND / RESERVE / REJECT"]
        IRGVote --> IRGAiSummary[/"AI Generate IRG Summary<br/>(activityIrgAiSummaryDelegate)"/]
        IRGAiSummary --> IRGReview["⑨ IRG Secretary Review<br/>(Role 144)"]
        IRGReview --> IRGCompletion[/"IRG Completion<br/>(activityIrgCompletionDelegate)<br/>irgCompleted=true"/]
        IRGCompletion --> ParallelJoin

        VPSelect["⑩ VP Secretary Select Group<br/>(Role 146)<br/>Set vpTimeoutDays"]
        VPSelect --> LoadVP[/"Load VP Members<br/>(activityVpLoadMembersDelegate)<br/>Role 147, exclude ChairPerson"/]
        LoadVP --> VPVote["⑪ VP Members Vote<br/>(Role 147 candidateGroup)<br/>APPROVE / REJECT / ABSTAIN"]
        VPVote -->|"All completed"| VPMerge
        VPVote -.->|"Timeout at vpVoteDeadline<br/>(activityVpTimeoutDelegate)<br/>Auto-ABSTAIN for non-voters"| VPTimeout[/"VP Timeout Handler"/]
        VPTimeout --> VPMerge
        VPMerge(["VP Branch Merge"]) --> ParallelJoin

        ParallelJoin(["Parallel Join<br/>(Both branches complete)"])
    end

    subgraph Phase5["Phase 5: VP Consensus (NSOA Only, Max 3 Rounds)"]
        ParallelJoin --> VPAiSummary
        VPAiSummary[/"AI Generate VP Summary<br/>(activityVpAiSummaryDelegate)"/]
        VPAiSummary --> VPConsensus

        VPConsensus["⑫ VP Secretary<br/>Review & Decide<br/>(Role 146)"]
        VPConsensus --> ConsensusGate{Secretary<br/>Decision}
        ConsensusGate -->|"Escalate to Chair<br/>(vpConsensus=true)"| ChairAI
        ConsensusGate -->|"Start next round<br/>(vpConsensus=false)"| RoundCheck{vpRoundNumber < 3?}
        RoundCheck -->|"true"| IncrementRound[/"Increment Round<br/>(activityVpIncrementRoundDelegate)<br/>vpRoundNumber++"/]
        IncrementRound --> VPSelect
        RoundCheck -->|"false (max reached)"| ChairAI
    end

    subgraph Phase6["Phase 6: ChairPerson Decision (NSOA Only)"]
        ChairAI[/"AI Generate Chair Recommendation<br/>(activityChairAiRecommendDelegate)"/]
        ChairAI --> Chair

        Chair["⑬ VP ChairPerson<br/>Final Decision<br/>(vpChairPersonUserId)"]
        Chair --> ChairGate{chairDecision?}
        ChairGate -->|"PASS"| PublishTask
        ChairGate -->|"REJECT"| EndRejected
        ChairGate -->|"RETURN"| EndReturned
    end

    PublishTask[/"Publish Activity<br/>(activityPublishDelegate)"/]
    PublishTask --> EndApproved

    EndApproved(["End - APPROVED<br/>(Activity published)"])
    EndRejected(["End - REJECTED"])
    EndReturned(["End - RETURNED<br/>(Applicant can revise & resubmit)"])

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

### 4.2 非 NSOA 簡化流程

```mermaid
flowchart LR
    Start(["Start"]) --> A

    A["① Coordinator<br/>(Group 140)"]
    A --> D{Checker?}
    D -->|"assignChecker=true"| E["② Checker"]
    D -->|"skip"| F
    E --> F["③ Supervisors<br/>(Parallel)"]
    F --> FA[/"Aggregate"/]
    FA --> B{EO needed?}
    B -->|"supvVenueAfterhrs=true"| C["④ EO<br/>(Group 141)"]
    B -->|"skip"| G
    C --> G{Sponsorship?}
    G -->|"hasSponsorship=true"| H["⑤ Sponsorship<br/>(Group 142)"]
    G -->|"skip"| I
    H --> I{Guest?}
    I -->|"hasExternalGuest=true"| J["⑥ Guest<br/>(Group 143)"]
    I -->|"skip"| Pub
    J --> Pub
    Pub[/"Publish"/]
    Pub --> End(["End - APPROVED"])

    style Start fill:#4CAF50,color:#fff
    style End fill:#4CAF50,color:#fff
```

### 4.3 NSOA 專屬流程（Phase 4–6）

```mermaid
flowchart TD
    Entry(["isNsoa=true<br/>Parallel Fork"])

    Entry --> IRGBranch
    Entry --> VPBranch

    subgraph IRGBranch["IRG Branch"]
        IRGSelect["⑦ IRG Secretary Select Group<br/>(Role 144)"]
        IRGSelect --> LoadIRG[/"Load IRG Members<br/>(Role 145)"/]
        LoadIRG --> IRGVote["⑧ IRG Members Vote<br/>(RECOMMEND / RESERVE / REJECT)"]
        IRGVote --> IRGSummary[/"AI Summary"/]
        IRGSummary --> IRGReview["⑨ IRG Secretary Review<br/>(Role 144)"]
        IRGReview --> IRGDone[/"IRG Completion<br/>irgCompleted=true"/]
    end

    subgraph VPBranch["VP Branch"]
        VPSelect["⑩ VP Secretary Select Group<br/>(Role 146)"]
        VPSelect --> LoadVP[/"Load VP Members<br/>(Role 147, exclude Chair)"/]
        LoadVP --> VPVote["⑪ VP Members Vote<br/>(APPROVE / REJECT / ABSTAIN)<br/>Submission blocked until irgCompleted"]
        VPVote --> VPMerge(["Merge normal/timeout"])
    end

    IRGDone --> Join(["Parallel Join"])
    VPMerge --> Join

    Join --> VPSummary[/"AI VP Summary"/]
    VPSummary --> VPDecide["⑫ VP Secretary Decide<br/>(Role 146)"]
    VPDecide --> Gate{Secretary<br/>Decision}
    Gate -->|"Next round<br/>(vpConsensus=false)"| RoundCheck{Round < 3?}
    RoundCheck -->|"yes"| Increment[/"vpRoundNumber++"/]
    Increment --> VPSelect
    RoundCheck -->|"no (forced)"| ChairAI
    Gate -->|"Escalate to Chair<br/>(vpConsensus=true)"| ChairAI

    ChairAI[/"AI Chair Recommendation"/]
    ChairAI --> Chair["⑬ VP ChairPerson<br/>Final Decision"]
    Chair --> FinalGate{chairDecision?}
    FinalGate -->|"PASS"| EndApproved(["End - APPROVED<br/>(Publish Activity)"])
    FinalGate -->|"REJECT"| EndRejected(["End - REJECTED"])
    FinalGate -->|"RETURN"| EndReturned(["End - RETURNED"])

    style Entry fill:#2196F3,color:#fff
    style EndApproved fill:#4CAF50,color:#fff
    style EndRejected fill:#f44336,color:#fff
    style EndReturned fill:#FF9800,color:#fff
    style IRGBranch fill:#E0F7FA,stroke:#00695C
    style VPBranch fill:#FFF8E1,stroke:#F57F17
```

> **關於 VP 輪次循環**：當 VP Secretary 選擇「開始下一輪」時，流程從 `vpConsensusGate`（位於 Parallel Join 之後）回跳到 `vpSecretarySelectGroupTask`（位於 Parallel Fork 的 VP 分支內）。後續輪次 VP 分支完成後到達 `parallelJoinGateway` 時，IRG 分支已在首輪完成，因此 Parallel Join 可直接通過。

---

## 5. 流程場景示例

### 場景 1：非 NSOA + 最簡路徑
**條件**：`isNsoa=false`, `assignChecker=false`, `supvVenueAfterhrs=false`, `hasSponsorship=false`, `hasExternalGuest=false`

```
① Coordinator → ③ Supervisors → Aggregate → 發布 ✅
```

### 場景 2：非 NSOA + 完整路徑
**條件**：`isNsoa=false`, `assignChecker=true`, `supvVenueAfterhrs=true`, `hasSponsorship=true`, `hasExternalGuest=true`

```
① Coordinator → ② Checker → ③ Supervisors → Aggregate → ④ EO → ⑤ Sponsorship → ⑥ Guest → 發布 ✅
```

### 場景 3：非 NSOA + EO 退回
**條件**：`supvVenueAfterhrs=true`，EO 不批准

```
① Coordinator → ③ Supervisors → Aggregate → ④ EO (退回) → ③ Supervisors (重新審核) → ...
```

### 場景 4：NSOA + 最簡路徑
**條件**：`isNsoa=true`, `assignChecker=false`, `supvVenueAfterhrs=false`, `hasSponsorship=false`, `hasExternalGuest=false`

```
① Coordinator → ③ Supervisors → Aggregate
→ 並行: { ⑦ IRG 選組 → ⑧ IRG 投票 → ⑨ IRG 審核 → IRG 完成 }
         { ⑩ VP 選組 → ⑪ VP 投票 }
→ 並行匯合 → VP AI 摘要 → ⑫ VP 共識 → ⑬ 主席決定 → 發布 ✅
```

### 場景 5：NSOA + 完整路徑 + VP 多輪投票
**條件**：所有條件都觸發，VP 投票未達共識

```
① Coordinator → ② Checker → ③ Supervisors → Aggregate → ④ EO → ⑤ Sponsorship → ⑥ Guest
→ 並行: { IRG 流程 } + { VP 投票 } → 並行匯合
→ VP AI 摘要 → ⑫ VP 共識(否)
→ ⑩ VP 選組(第2輪) → ⑪ VP 投票 → VP AI 摘要 → ⑫ VP 共識(否)
→ ⑩ VP 選組(第3輪) → ⑪ VP 投票 → VP AI 摘要 → ⑫ VP 共識(否)
→ ⑬ 主席決定（強制進入）→ 發布/拒絕/退回
```

---

## 6. 任務節點詳細說明

### 6.1 Coordinator 審核（coordinatorReviewTask）
- **角色**：Activity Coordinator（候選組 140，`candidateStrategy=40`）
- **職責**：
  1. 審核活動基本信息
  2. 決定是否需要 Checker（設置 `assignChecker`）
  3. 分配 Checker（設置 `checkerUserId`）
- **輸出變量**：`approved`, `assignChecker`, `checkerUserId`
- **拒絕處理**：`approved=false` → 流程進入 **RETURNED**（退回申請人修改）

> **注意**：`supervisorUserIds` 在流程啟動時從 `activity_supervisor` 表自動加載，不由 Coordinator 在審核時分配。

### 6.2 Checker 審核（checkerReviewTask）
- **角色**：Checker（由 Coordinator 指定的用戶，`assignee=${checkerUserId}`）
- **觸發條件**：`assignChecker == true`
- **職責**：詳細審查活動內容
- **輸出變量**：`approved`
- **拒絕處理**：`approved=false` → 流程進入 **REJECTED**

### 6.3 Supervisors 審核（supervisorsReviewTask）
- **角色**：Supervisors（多人並行，`assignee=${supervisorUserId}`）
- **特性**：並行多實例任務（BPMN `multiInstanceLoopCharacteristics`，遍歷 `supervisorUserIds`，等待全部完成）
- **職責**：監督審核活動，確認場地課後使用情況
- **每位 Supervisor 輸出**：
  - `supvDecision`：`RECOMMEND` / `REJECT` / `RETURN`
  - `supvVenueAfterhrs`：是否確認場地涉及課後使用（Boolean）

### 6.4 Supervisor 投票聚合（supervisorAggregateTask - ServiceTask）
- **委託**：`activitySupervisorAggregateDelegate`
- **聚合規則**：
  1. 任何一位投 `RETURN` → 聚合結果 = `RETURN`（最高優先級）
  2. 全部投 `RECOMMEND` → 聚合結果 = `RECOMMEND`
  3. 有 `REJECT` 但無 `RETURN` → 聚合結果 = `REJECT`
  4. 混合 `RECOMMEND`/`REJECT` → 聚合結果 = `REJECT`
- **輸出變量**：
  - `supvAggregateDecision`：`RECOMMEND` / `REJECT` / `RETURN`
  - `supervisorsAllApproved`：`true` 僅當聚合結果為 `RECOMMEND`
- **決策網關**（supervisorsDecisionGate）：
  - `supervisorsAllApproved == true` → 繼續到 EO 檢查
  - `supvAggregateDecision == 'RETURN'` → 流程進入 **RETURNED**
  - 其他（`supervisorsAllApproved == false && supvAggregateDecision != 'RETURN'`）→ **REJECTED**

### 6.5 EO 審批（eoApprovalTask）
- **角色**：Estate Office（候選組 141，`candidateStrategy=40`）
- **觸發條件**：`supvVenueAfterhrs == true`（由 Supervisor 在審核時確認）
- **職責**：審批場地課後使用
- **輸出變量**：`approved`
- **決策邏輯**：
  - `approved=true` → 繼續到贊助檢查
  - `approved=false` → **退回到 Supervisors 重新審核**（循環，非拒絕）

> **重要變更**：EO 位於 Supervisors 之後（而非之前），且 EO 不能直接拒絕活動，只能批准或退回給 Supervisors。

### 6.6 贊助審批（sponsorshipApprovalTask）
- **角色**：Sponsorship Approver（候選組 142，`candidateStrategy=40`）
- **觸發條件**：`hasSponsorship == true`
- **職責**：審批贊助相關內容
- **輸出變量**：`approved`
- **拒絕處理**：`approved=false` → **REJECTED**

### 6.7 嘉賓審批（guestApprovalTask）
- **角色**：Guest Approver（候選組 143，`candidateStrategy=40`）
- **觸發條件**：`hasExternalGuest == true`
- **職責**：審核外部嘉賓信息
- **輸出變量**：`approved`
- **拒絕處理**：`approved=false` → **REJECTED**

> **注意**：此步驟為可選步驟，僅在有外部嘉賓時觸發。無外部嘉賓的活動直接跳到 NSOA 檢查。

### 6.8 IRG Secretary 選組（irgSecretarySelectGroupTask）
- **角色**：IRG Secretary（角色 144，`candidateStrategy=40`）
- **觸發條件**：`isNsoa == true`（通過並行分支進入）
- **職責**：選擇 IRG 評審組（記錄 `selectedIrgGroupId`）
- **輸出變量**：`selectedIrgGroupId`

> **注意**：選組僅用於記錄元數據。後續加載 IRG 成員時按角色 145 查詢所有用戶，不依賴所選組篩選成員。

### 6.9 加載 IRG 成員（loadIrgMembersTask - ServiceTask）
- **委託**：`activityIrgLoadMembersDelegate`
- **邏輯**：通過角色 145 加載所有 IRG Member 用戶
- **輸出變量**：`irgMemberUserIds`（List）, `irgMemberCount`（int）

### 6.10 IRG 成員投票（irgMembersVoteTask）
- **角色**：IRG Members（角色 145，`candidateGroup` 分配，`candidateStrategy=40`）
- **投票選項**：`RECOMMEND` / `RESERVE` / `REJECT`
- **職責**：對活動進行 IRG 投票
- **記錄表**：`activity_irg_vote`

### 6.11 AI 生成 IRG 摘要（irgAiSummaryTask - ServiceTask）
- **委託**：`activityIrgAiSummaryDelegate`
- **輸出變量**：`irgAiSummary`（String）

### 6.12 IRG Secretary 審核摘要（irgSecretaryReviewSummaryTask）
- **角色**：IRG Secretary（角色 144，`candidateStrategy=40`）
- **職責**：審核 AI 生成的 IRG 投票摘要

### 6.13 IRG 完成通知（irgCompletionNotifyTask - ServiceTask）
- **委託**：`activityIrgCompletionDelegate`
- **輸出變量**：
  - `irgCompleted`：設為 `true`，通知 VP 分支可以開始投票提交
  - `irgSummaryForVp`：將 IRG 摘要複製到流程變量，供 VP 參考

### 6.14 VP Secretary 選組（vpSecretarySelectGroupTask）
- **角色**：VP Secretary（角色 146，`candidateStrategy=40`）
- **職責**：選擇 VP 評審組並設置投票超時時間
- **輸出變量**：`selectedVpGroupId`, `vpTimeoutDays`（默認 7 天）
- **輪次**：`vpRoundNumber` 在流程啟動時初始化為 `1`，後續輪次由 `activityVpIncrementRoundDelegate` 遞增

### 6.15 加載 VP 成員（loadVpMembersTask - ServiceTask）
- **委託**：`activityVpLoadMembersDelegate`
- **邏輯**：
  1. 通過角色 147 加載所有 VP Member 用戶
  2. 獲取 ChairPerson 用戶 ID
  3. 將 ChairPerson 從投票成員中排除
  4. 計算投票截止時間 `vpVoteDeadline = now + vpTimeoutDays`
- **輸出變量**：`vpMemberUserIds`, `vpMemberCount`, `vpChairPersonUserId`, `vpVoteDeadline`

### 6.16 VP 成員投票（vpMembersVoteTask）
- **角色**：VP Members（角色 147，`candidateGroup` 分配，`candidateStrategy=40`）
- **投票選項**：`APPROVE` / `REJECT` / `ABSTAIN`
- **前端限制**：前端檢查 `irgCompleted` 變量，在 IRG 完成前阻止 VP 成員提交投票
- **超時機制**：
  - BPMN `boundaryEvent` 綁定在 `vpMembersVoteTask` 上，`cancelActivity=true`
  - 超時條件：`vpVoteDeadline` 到期
  - 超時處理：`activityVpTimeoutDelegate` 為未投票成員自動記錄 `ABSTAIN`
  - 超時後流程通過 `vpBranchMergeGateway` 合併到正常路徑
- **記錄表**：`activity_vp_vote`（含 `roundNumber` 和 `isTimeoutDefault` 欄位）

### 6.17 AI 生成 VP 摘要（vpAiSummaryTask - ServiceTask）
- **委託**：`activityVpAiSummaryDelegate`
- **執行時機**：在 Parallel Join 之後（即 IRG 和 VP 兩個分支都完成後）
- **輸出變量**：`vpAiSummary`（String）

### 6.18 VP Secretary 檢查共識（vpSecretaryCheckConsensusTask）
- **角色**：VP Secretary（角色 146，`candidateStrategy=40`）
- **職責**：審核投票結果並**手動決定**是否進入下一輪或提交主席
- **共識判定邏輯**（供 Secretary 參考）：排除棄權票後，所有有效票一致為 APPROVE 或 REJECT 即為達成共識
- **Secretary 操作**：
  - 選擇「開始下一輪」→ 設置 `vpConsensus = false` → 流程回到 VP 選組（若未達最大輪次）
  - 選擇「提交主席決定」→ 設置 `vpConsensus = true` → 流程進入 ChairPerson 決定

### 6.19 ChairPerson 決定（chairPersonDecisionTask）
- **角色**：VP ChairPerson（由 `vpChairPersonUserId` 指定，`assignee`）
- **觸發條件**：`vpConsensus == true` 或 `vpRoundNumber >= 3`
- **前置步驟**：AI 生成主席建議（`activityChairAiRecommendDelegate` → `chairAiRecommendation`）
- **決定選項**：
  - `PASS`：活動通過，流程進入發布
  - `REJECT`：活動被拒絕
  - `RETURN`：活動退回修改
- **輸出變量**：`chairDecision`
- **同步更新**：ChairPerson 決定後會同步更新 `activity.approvalStatus`，不依賴異步 BPM 事件處理

---

## 7. 流程啟動初始化變量一覽

以下是 `ActivityServiceImpl.startActivityApprovalWorkflow()` 中設定的所有流程變量：

| 變量名 | 值 | 說明 |
|:-------|:---|:-----|
| `startUserId` | `activity.creatorId` | 申請人 |
| `activityId` | 活動 ID | 業務關聯 |
| `activityTitleEn` | 英文標題 | 顯示用 |
| `activityTitleTc` | 繁體中文標題 | 顯示用 |
| `activityTitleSc` | 簡體中文標題 | 顯示用 |
| `isNsoa` | Boolean | NSOA 標識 |
| `hasCampusCommonAreas` | Boolean | 校園公共區域（保留，但不再用於 EO 觸發） |
| `hasSponsorship` | Boolean | 贊助標識 |
| `hasExternalGuest` | Boolean | 外部嘉賓標識 |
| `coordinatorGroupId` | `140L` | Coordinator 候選組 |
| `eoGroupId` | `141L` | EO 候選組 |
| `sponsorshipApproverGroupId` | `142L` | 贊助審批候選組 |
| `guestApproverGroupId` | `143L` | 嘉賓審批候選組 |
| `irgSecretaryRoleId` | `144L` | IRG Secretary 角色 |
| `irgMemberRoleId` | `145L` | IRG Member 角色 |
| `vpSecretaryRoleId` | `146L` | VP Secretary 角色 |
| `vpMemberRoleId` | `147L` | VP Member 角色 |
| `assignChecker` | `false` | Checker 分配（初始） |
| `vpRoundNumber` | `1` | VP 輪次（初始） |
| `supervisorsAllApproved` | `true` | Supervisor 通過標識（初始） |
