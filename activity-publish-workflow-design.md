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

本章包含三張流程圖：4.2 整體流程、4.3 非 NSOA 簡化流程、4.4 NSOA 專屬流程。所有流程圖遵循 4.1 中的統一規範。

### 4.1 圖例與閱讀指南

#### 節點形狀

| 形狀 | Mermaid 語法 | 含義 |
|:-----|:-------------|:-----|
| 矩形 | `["Name"]` | **人工任務** — 需要審批人手動操作 |
| 平行四邊形 | `[/"auto: Name"/]` | **系統任務** — Service Task 自動執行，無需用戶操作 |
| 菱形 | `{Question?}` | **判斷網關** — 根據變量分流，文字以問號結尾 |
| 圓角 | `(["Name"])` | **流程起點/終點** 或 並行 Fork/Join |

#### 連線類型

| 樣式 | Mermaid 語法 | 含義 |
|:-----|:-------------|:-----|
| 實線箭頭 | `-->` | 正向順序流（happy path） |
| 虛線箭頭 | `-.->` | 超時觸發、退回循環、跨分支依賴 |

#### 節點標籤規範

| 類型 | 格式 | 範例 |
|:-----|:-----|:-----|
| 人工任務 | `<編號> <步驟名><br/>(角色名)` | `① Coordinator 審核<br/>(Activity Coordinator)` |
| 系統任務 | `auto: <行為描述>` | `auto: AI 生成 VP 摘要` |
| 判斷網關 | 以問號結尾的問句 | `{是否有贊助?}` |
| 結束點 | `End: <狀態><br/>(<業務含義>)` | `End: APPROVED<br/>(活動已發布)` |

> 流程圖中**不標註**角色組 ID、Delegate 類名、流程變量名等實現細節，以保持簡潔。完整實現信息請參考 [§3 審批角色](#3-審批角色) 與 [§6 任務節點詳細說明](#6-任務節點詳細說明)。

#### 步驟編號

①–⑬ 為人工任務的順序編號，便於跨章節引用。系統任務不參與編號。

| 編號 | 步驟 | 角色 | 階段 |
|:----:|:-----|:-----|:----:|
| ① | Coordinator 審核 | Activity Coordinator | Phase 1 |
| ② | Checker 審核 | Designated Checker | Phase 1 |
| ③ | Supervisors 審核 | Supervisors（並行） | Phase 2 |
| ④ | EO 審批 | Estate Office | Phase 3 |
| ⑤ | 贊助審批 | Sponsorship Approver | Phase 3 |
| ⑥ | 嘉賓審批 | Guest Approver | Phase 3 |
| ⑦ | IRG 選組 | IRG Secretary | Phase 4 |
| ⑧ | IRG 投票 | IRG Members（並行） | Phase 4 |
| ⑨ | IRG 摘要審核 | IRG Secretary | Phase 4 |
| ⑩ | VP 選組 | VP Secretary | Phase 4 |
| ⑪ | VP 投票 | VP Members（並行） | Phase 4 |
| ⑫ | VP 共識決定 | VP Secretary | Phase 5 |
| ⑬ | 最終決定 | VP ChairPerson | Phase 6 |

### 4.2 整體流程

```mermaid
flowchart TD
    Start(["Start: 活動已提交"])
    Start --> Coordinator

    subgraph Phase1["Phase 1: 初審"]
        Coordinator["① Coordinator 審核<br/>(Activity Coordinator)"]
        Coordinator --> CoordGate{Coordinator 是否通過?}
        CoordGate -->|"通過"| CheckerCheck
        CoordGate -->|"退回"| EndReturned

        CheckerCheck{需要 Checker?}
        CheckerCheck -->|"是"| Checker
        CheckerCheck -->|"否"| Supervisors

        Checker["② Checker 審核<br/>(Designated Checker)"]
        Checker --> CheckerGate{Checker 是否通過?}
        CheckerGate -->|"通過"| Supervisors
        CheckerGate -->|"拒絕"| EndRejected
    end

    subgraph Phase2["Phase 2: Supervisor 審核"]
        Supervisors["③ Supervisors 審核<br/>(Supervisors, 並行)"]
        Supervisors --> SuperAggregate[/"auto: 聚合 Supervisor 投票"/]
        SuperAggregate --> SuperGate{聚合結果?}
        SuperGate -->|"RECOMMEND"| EoCheck
        SuperGate -->|"RETURN"| EndReturned
        SuperGate -->|"REJECT"| EndRejected
    end

    subgraph Phase3["Phase 3: 高級審批"]
        EoCheck{場地是否課後使用?}
        EoCheck -->|"是"| EO
        EoCheck -->|"否"| SponsorCheck

        EO["④ EO 審批<br/>(Estate Office)"]
        EO --> EoGate{EO 是否通過?}
        EoGate -->|"通過"| SponsorCheck
        EoGate -.->|"退回 (循環)"| Supervisors

        SponsorCheck{是否有贊助?}
        SponsorCheck -->|"是"| Sponsor
        SponsorCheck -->|"否"| GuestCheck

        Sponsor["⑤ 贊助審批<br/>(Sponsorship Approver)"]
        Sponsor --> SponsorGate{是否通過?}
        SponsorGate -->|"通過"| GuestCheck
        SponsorGate -->|"拒絕"| EndRejected

        GuestCheck{是否有外部嘉賓?}
        GuestCheck -->|"是"| Guest
        GuestCheck -->|"否"| NsoaCheck

        Guest["⑥ 嘉賓審批<br/>(Guest Approver)"]
        Guest --> GuestGate{是否通過?}
        GuestGate -->|"通過"| NsoaCheck
        GuestGate -->|"拒絕"| EndRejected
    end

    subgraph Phase4["Phase 4: NSOA 並行評審 (僅 NSOA)"]
        NsoaCheck{是否為 NSOA?}
        NsoaCheck -->|"否"| PublishTask
        NsoaCheck -->|"是"| ParallelFork

        ParallelFork(["Parallel Fork"])
        ParallelFork --> IRGSelect
        ParallelFork --> VPSelect

        IRGSelect["⑦ IRG 選組<br/>(IRG Secretary)"]
        IRGSelect --> LoadIRG[/"auto: 加載 IRG 成員"/]
        LoadIRG --> IRGVote["⑧ IRG 投票<br/>(IRG Members)"]
        IRGVote --> IRGAiSummary[/"auto: AI 生成 IRG 摘要"/]
        IRGAiSummary --> IRGReview["⑨ IRG 摘要審核<br/>(IRG Secretary)"]
        IRGReview --> IRGCompletion[/"auto: IRG 完成"/]
        IRGCompletion --> ParallelJoin
        IRGCompletion -.->|"解鎖 VP 投票提交"| VPVote

        VPSelect["⑩ VP 選組<br/>(VP Secretary)"]
        VPSelect --> LoadVP[/"auto: 加載 VP 成員"/]
        LoadVP --> VPVote["⑪ VP 投票<br/>(VP Members)"]
        VPVote -->|"全部投票完成"| VPMerge
        VPVote -.->|"超時 (自動 ABSTAIN)"| VPTimeout[/"auto: VP 超時處理"/]
        VPTimeout --> VPMerge
        VPMerge(["VP 分支合併"]) --> ParallelJoin

        ParallelJoin(["Parallel Join"])
    end

    subgraph Phase5["Phase 5: VP 共識 (僅 NSOA, 最多 3 輪)"]
        ParallelJoin --> VPAiSummary[/"auto: AI 生成 VP 摘要"/]
        VPAiSummary --> VPConsensus

        VPConsensus["⑫ VP 共識決定<br/>(VP Secretary)"]
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
        ChairAI --> Chair["⑬ 最終決定<br/>(VP ChairPerson)"]
        Chair --> ChairGate{Chair 決定?}
        ChairGate -->|"PASS"| PublishTask
        ChairGate -->|"REJECT"| EndRejected
        ChairGate -->|"RETURN"| EndReturned
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

> 圖中虛線 `-.->` 表示三類非主路徑：① ④ EO 退回時回跳到 ③ Supervisors 重審；② ⑪ VP 投票超時自動 ABSTAIN；③ IRG 完成後解鎖 VP 投票提交（前端約束，詳見 [§6.16](#616-vp-成員投票vpmembersvotetask)）。

### 4.3 非 NSOA 簡化流程

僅展示 `isNsoa=false` 活動的「快樂路徑」（所有審批均通過），用於快速理解主幹流程。完整退回/拒絕分支見 [§4.2](#42-整體流程)。

```mermaid
flowchart LR
    Start(["Start"]) --> A["① Coordinator 審核<br/>(Coordinator)"]
    A --> D{需要 Checker?}
    D -->|"是"| E["② Checker 審核<br/>(Designated Checker)"]
    D -->|"否"| F
    E --> F["③ Supervisors 審核<br/>(Supervisors, 並行)"]
    F --> FA[/"auto: 聚合投票"/]
    FA --> B{場地是否課後使用?}
    B -->|"是"| C["④ EO 審批<br/>(Estate Office)"]
    B -->|"否"| G
    C --> G{是否有贊助?}
    G -->|"是"| H["⑤ 贊助審批<br/>(Sponsorship Approver)"]
    G -->|"否"| I
    H --> I{是否有外部嘉賓?}
    I -->|"是"| J["⑥ 嘉賓審批<br/>(Guest Approver)"]
    I -->|"否"| Pub
    J --> Pub
    Pub[/"auto: 發布活動"/]
    Pub --> End(["End: APPROVED"])

    style Start fill:#4CAF50,color:#fff
    style End fill:#4CAF50,color:#fff
```

### 4.4 NSOA 專屬流程（Phase 4–6）

僅展示 NSOA 活動進入並行評審後的流程細節。前置 Phase 1–3 與非 NSOA 相同，見 [§4.2](#42-整體流程)。

```mermaid
flowchart TD
    Entry(["進入 Phase 4<br/>(isNsoa=true)"])
    Entry --> ParallelFork(["Parallel Fork"])

    ParallelFork --> IRGBranch
    ParallelFork --> VPBranch

    subgraph IRGBranch["IRG 分支"]
        IRGSelect["⑦ IRG 選組<br/>(IRG Secretary)"]
        IRGSelect --> LoadIRG[/"auto: 加載 IRG 成員"/]
        LoadIRG --> IRGVote["⑧ IRG 投票<br/>(IRG Members)<br/>RECOMMEND / RESERVE / REJECT"]
        IRGVote --> IRGSummary[/"auto: AI 生成 IRG 摘要"/]
        IRGSummary --> IRGReview["⑨ IRG 摘要審核<br/>(IRG Secretary)"]
        IRGReview --> IRGDone[/"auto: IRG 完成"/]
    end

    subgraph VPBranch["VP 分支"]
        VPSelect["⑩ VP 選組<br/>(VP Secretary)"]
        VPSelect --> LoadVP[/"auto: 加載 VP 成員"/]
        LoadVP --> VPVote["⑪ VP 投票<br/>(VP Members)<br/>APPROVE / REJECT / ABSTAIN"]
        VPVote --> VPMerge(["VP 分支合併"])
    end

    IRGDone -.->|"解鎖 VP 投票提交"| VPVote
    IRGDone --> Join(["Parallel Join"])
    VPMerge --> Join

    Join --> VPSummary[/"auto: AI 生成 VP 摘要"/]
    VPSummary --> VPDecide["⑫ VP 共識決定<br/>(VP Secretary)"]
    VPDecide --> Gate{是否達成共識?}
    Gate -->|"是 (提交主席)"| ChairAI
    Gate -->|"否 (進入下一輪)"| RoundCheck{輪次 < 3?}
    RoundCheck -->|"是"| Increment[/"auto: 下一輪"/]
    Increment -.->|"循環回跳"| VPSelect
    RoundCheck -->|"否 (達到上限)"| ChairAI

    ChairAI[/"auto: AI 生成主席建議"/]
    ChairAI --> Chair["⑬ 最終決定<br/>(VP ChairPerson)"]
    Chair --> FinalGate{Chair 決定?}
    FinalGate -->|"PASS"| EndApproved(["End: APPROVED<br/>(發布活動)"])
    FinalGate -->|"REJECT"| EndRejected(["End: REJECTED"])
    FinalGate -->|"RETURN"| EndReturned(["End: RETURNED"])

    style Entry fill:#2196F3,color:#fff
    style EndApproved fill:#4CAF50,color:#fff
    style EndRejected fill:#f44336,color:#fff
    style EndReturned fill:#FF9800,color:#fff
    style IRGBranch fill:#E0F7FA,stroke:#00695C
    style VPBranch fill:#FFF8E1,stroke:#F57F17
```

#### 4.4.1 VP 多輪循環說明

當 VP Secretary 在 ⑫ 選擇「開始下一輪」（`vpConsensus=false`）時：

1. 流程從 ⑫ 後的 `Reach Consensus?` 網關（位於 Parallel Join 之後）回跳到 ⑩ VP Group Selection（位於 VP 分支內）。
2. 後續輪次只在 VP 分支重新執行 ⑩→⑪。IRG 分支在首輪結束時已完成（`irgCompleted=true`），不會再次觸發。
3. 第二、第三輪 VP 分支完成後到達 Parallel Join 時，IRG 分支保持已完成狀態，因此 Join 立即通過。
4. 最多執行 3 輪。第 3 輪結束時，無論共識與否都強制進入 ⑬ ChairPerson 決定（`Round < 3?` 網關走 No 分支）。

#### 4.4.2 跨分支依賴：VP 投票提交鎖

⑪ VP Voting 在 BPMN 上與 IRG 分支獨立並行，但前端會檢查 `irgCompleted` 變量：

- IRG 完成（`auto: IRG Completion` 將 `irgCompleted=true`）**之前**，VP Members 可以查看任務但不能提交投票。
- IRG 完成後，前端解除提交限制，VP Members 才能正式提交。

這是業務層約束（不希望 VP 在缺少 IRG 摘要參考時投票），實現細節見 [§6.16](#616-vp-成員投票vpmembersvotetask)。圖中以虛線 `IRG Completion -.-> VP Voting` 表達這層依賴。

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
