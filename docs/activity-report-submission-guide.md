# 活動報告（活動總結報告）操作手冊

> 本手冊面向**活動 OC（籌委會）**、**各審批角色**與 **SAO 管理員**，涵蓋活動總結報告的完整操作：參與者問卷 → 報告起草 → OC 聯署 → 審批 → ELAT 同步。讀完本手冊，使用者應可**不依賴開發人員陪同**完成整個流程。
>
> 內容以 **2026-11 的實際運作狀況（as-built）** 為準。截圖取自測試環境，畫面語言為英文；截圖中的活動、帳號與問卷名稱（如「6号-导入」、「S2-FIXTURE」）是測試資料，正式環境以實際名稱為準。
>
> 設計層面的環節條件與需求對應見 [activity-report-submission-design.md](activity-report-submission-design.md)；角色稱呼以系統角色的正式名稱為準（見 [roles-menus-permissions-matrix.md](roles-menus-permissions-matrix.md)）。

---

## 目錄

1. [概覽](#1-概覽)
    - [1.1 整體流程](#11-整體流程)
    - [1.2 角色與職責](#12-角色與職責)
    - [1.3 報告狀態](#13-報告狀態)
2. [參與者問卷](#2-參與者問卷)
    - [2.1 進入問卷範本頁面（SAO）](#21-進入問卷範本頁面sao)
    - [2.2 設定發送時間（SAO）](#22-設定發送時間sao)
    - [2.3 建立問卷範本（SAO）](#23-建立問卷範本sao)
    - [2.4 管理範本與設定預設（SAO）](#24-管理範本與設定預設sao)
    - [2.5 為個別活動指定範本（SAO）](#25-為個別活動指定範本sao)
    - [2.6 問卷發送規則](#26-問卷發送規則)
    - [2.7 參與者填寫問卷](#27-參與者填寫問卷)
3. [起草活動報告](#3-起草活動報告)
    - [3.1 誰可以起草](#31-誰可以起草)
    - [3.2 建立報告](#32-建立報告)
    - [3.3 填寫報告各部分](#33-填寫報告各部分)
    - [3.4 報告中的問卷結果](#34-報告中的問卷結果)
4. [OC 聯署](#4-oc-聯署)
    - [4.1 發起聯署](#41-發起聯署)
    - [4.2 OC 簽署](#42-oc-簽署)
    - [4.3 撤回聯署](#43-撤回聯署)
    - [4.4 轉移起草權（SAO）](#44-轉移起草權sao)
5. [審批](#5-審批)
    - [5.1 審批流程圖](#51-審批流程圖)
    - [5.2 從待辦進入審批頁](#52-從待辦進入審批頁)
    - [5.3 Coordinator 分派](#53-coordinator-分派)
    - [5.4 Checker 檢查](#54-checker-檢查)
    - [5.5 Supervisor 推薦](#55-supervisor-推薦)
    - [5.6 Activity Application Reviewer 審批（非 NSOA）](#56-activity-application-reviewer-審批非-nsoa)
    - [5.7 VPSLA 審批（NSOA）](#57-vpsla-審批nsoa)
    - [5.8 退回與重新提交](#58-退回與重新提交)
    - [5.9 審批結果與通知](#59-審批結果與通知)
    - [5.10 出席修訂與報告修訂輪](#510-出席修訂與報告修訂輪)
6. [ELAT 同步](#6-elat-同步)
    - [6.1 哪些活動會同步](#61-哪些活動會同步)
    - [6.2 Supervisor 填寫 ELAT 資料](#62-supervisor-填寫-elat-資料)
    - [6.3 同步時間與內容](#63-同步時間與內容)
    - [6.4 同步資料的來源](#64-同步資料的來源)
    - [6.5 SAO 管理 ELAT 同步](#65-sao-管理-elat-同步)
    - [6.6 同步狀態](#66-同步狀態)
    - [6.7 報告修訂後的重新同步](#67-報告修訂後的重新同步)
7. [報告內容與入口](#7-報告內容與入口)
8. [端到端 Demo 指南](#8-端到端-demo-指南)
9. [邊界與已知限制](#9-邊界與已知限制)
10. [常見問題](#10-常見問題)

---

## 1. 概覽

### 1.1 整體流程

活動獲批准後，活動 OC 即可起草報告；活動結束後，系統按 SAO 設定的時間向簽到者發送問卷。OC 填好報告後發起聯署，全體 OC 簽署後報告進入審批：Coordinator 分派、Checker 檢查（可選）、全體 Supervisor 推薦，再由 Activity Application Reviewer（非 NSOA）或 VPSLA（NSOA）批准。報告獲批准後，Supervisor 填寫的 ELAT 資料會在當晚同步到 ELAT。

```mermaid
flowchart TD
    A["活動獲批准"] --> B["OC 起草報告<br/>草稿"]
    A -.-> S1["活動結束後第 N 日<br/>系統向簽到者發送問卷"]
    S1 -.-> S2["參與者匿名填寫"]
    S2 -.->|"即時統計"| B
    B --> C["活動結束後發起聯署<br/>待聯署・內容鎖定<br/>問卷統計凍結"]
    C --> D["全體 OC 簽署"]
    D --> E["審批中"]
    E --> F["Coordinator 分派"]
    F --> G["Checker 檢查（可選）"]
    G --> H["全體 Supervisor 推薦<br/>Supervisor 填寫 ELAT 資料"]
    H --> I{"NSOA?"}
    I -->|"否"| J["Activity Application Reviewer 批准"]
    I -->|"是"| K["VPSLA Secretary → Members 表態<br/>→ 共識 → Chairperson 批准"]
    J --> L(["已批准"])
    K --> L
    L --> M["當晚 02:30 同步到 ELAT"]
```

### 1.2 角色與職責

| 角色 | 可做的事 |
|:--|:--|
| 活動 OC（含活動建立人、所屬學生組織 Group Leader） | 起草及修改報告、發起及撤回聯署、簽署；查看問卷即時統計 |
| 活動參與者（曾簽到者） | 匿名填寫問卷，每人一次 |
| Coordinator | 分派 Checker 與 Supervisors，或退回學生 |
| Activity Application Checker | 檢查通過，或退回 Coordinator / 學生 |
| Supervisor | 推薦，或退回 Coordinator / 學生；修訂問卷 AI 總結；填寫 ELAT 資料 |
| Activity Application Reviewer／Delegate | 批准或退回（非 NSOA） |
| VPSLA Secretary | 選擇傳閱小組及投票截止時間；看投票結果後確認共識或退回（NSOA） |
| VPSLA Members | 表態：Approve / Neutral / Return（NSOA） |
| VPSLA Chairperson | 成員表態期間可唯讀查看報告；最終批准或退回（NSOA） |
| SAO 管理員 | 設定問卷發送時間及範本；轉移報告起草權；管理 ELAT 同步 |

### 1.3 報告狀態

| 狀態（畫面標籤） | 意思 | OC 可做的事 |
|:--|:--|:--|
| Not Started（未開始） | 活動可報告，但尚未建立報告（列表上的顯示，不是報告的實際狀態） | Create Report |
| Draft（草稿） | 可自由編輯 | 儲存草稿、發起聯署 |
| Pending Endorsement（待聯署） | 等待全體 OC 簽署，**內容與名單鎖定** | 簽署、撤回聯署 |
| Submitted（審批中） | 全體 OC 已簽署，審批進行中 | 查看、追蹤進度 |
| Returned（已退回） | 被退回學生 | 修改後**重新發起聯署** |
| Approved（已批准） | 審批通過 | 查看 |
| Change Requested（需要修訂） | 已批准的報告由 OC 開啟修訂輪，以更正出席記錄（見 [5.10](#510-出席修訂與報告修訂輪)） | 修改後**重新發起聯署** |

---

## 2. 參與者問卷

活動結束後，系統按 SAO 設定的時間，自動向**所有曾簽到的參與者**發送一份匿名問卷。問卷結果自動匯總到活動報告：

- **選擇題與評分題**：系統統計每個選項的人數及百分比、評分分佈及平均分。
- **文字題**：由 AI 生成英文總結；Supervisor 審批時可修訂。

本節 2.1–2.5 由 **SAO 管理員**操作；2.7 是參與者的操作；問卷結果在報告中的呈現見 [3.4](#34-報告中的問卷結果)。

### 2.1 進入問卷範本頁面（SAO）

**步驟 1**：以 SAO 管理員身份登入，點選左側選單 **Management Centre**，再點 **Survey Templates**。

![進入 Survey Templates](images/activity-survey/01-menu-management-centre.png)

**步驟 2**：頁面上方一行是**發送時間設定**，下方是**問卷範本列表**，標有 **Default** 的是預設範本。

![Survey Templates 頁面](images/activity-survey/02-survey-templates-page.png)

### 2.2 設定發送時間（SAO）

發送時間設定適用於**所有活動**：

| 欄位 | 意思 | 可設定範圍 |
|:--|:--|:--|
| **Send on day N after the activity ends** | 活動結束日之後第幾日發送。1 = 結束翌日；0 = 結束當日 | 0–30 |
| **Send time** | 當日幾點發送 | 00:00–23:30，每 30 分鐘一格 |
| **Open for (days)** | 發送後開放填寫多少日 | 1–60 |

> 例：活動於 11 月 7 日結束，設定為「第 1 日、10:00、7 日」，問卷會於 **11 月 8 日 10:00** 發出，開放至 **11 月 15 日 10:00**。

**步驟 1**：修改需要調整的欄位。點 **Send time** 可從下拉清單選擇時間。

![選擇發送時間](images/activity-survey/03-schedule-send-time-options.png)

**步驟 2**：修改後，右邊的 **Save** 按鈕會變為可按。下圖示範改為「結束後第 2 日 09:30 發送，開放 14 日」。

![修改發送時間](images/activity-survey/04-schedule-changed.png)

**步驟 3**：點 **Save**，畫面上方顯示「Save Successful」即已儲存。

![儲存成功](images/activity-survey/05-schedule-saved.png)

!!! note "設定何時生效"
    新設定只影響**尚未發送**的問卷；已發送的問卷按發送當時的設定計算截止時間。系統每 10 分鐘檢查一次，問卷會在設定時間後 10 分鐘內發出。

#### 立即發送（2026-11-10 起）

活動結束後，SAO 不必等到預定時間，可以手動把問卷即時發出。

| 項目 | 說明 |
|:--|:--|
| 位置 | 問卷管理的活動清單，每個活動顯示「**預定發送時間**」及「**立即發送**」 |
| 確認 | 按「立即發送」會先確認：「現在就把問卷發送給所有已簽到的人嗎？之後不會再按預定時間發送。」 |
| 發送後 | 該活動的問卷不再處於待發送狀態，**預定發送不會重複發出** |
| 已錯過 | 預定時間已過補發時限者，標示「**已錯過，不會自動發送**」，須用「立即發送」補發 |
| 無人簽到 | 提示沒有人簽到，而**不會**把問卷記為已略過；補正出席記錄後仍可發送 |

### 2.3 建立問卷範本（SAO）

**步驟 1**：點 **New template**，彈出「New survey template」視窗。視窗有 **Design**（編輯）及 **Preview**（預覽）兩個頁籤，新範本預先放入一道評分題。

![新增範本視窗](images/activity-survey/06-new-template-dialog.png)

**步驟 2**：填寫範本資料。每一項都有**英文、繁體中文、簡體中文**三個輸入框，參與者看到與其介面語言相同的版本。

- **Name**：範本名稱，三種語言必填。
- **Introduction**：問卷開頭的說明文字，選填。
- **Questions**：題目。每道題可選題型、勾選 **Required**（必答）。

![填寫名稱、說明及第一道題](images/activity-survey/07-name-intro-first-question.png)

**步驟 3**：點 **Add question**，選擇題型加入新題目。

![選擇題型](images/activity-survey/08-add-question-types.png)

| 題型 | 參與者如何作答 | 報告中如何呈現 |
|:--|:--|:--|
| **Single choice**（單選） | 選一個選項 | 每個選項的人數及百分比 |
| **Multiple choice**（多選） | 可選多個選項 | 每個選項的人數及百分比 |
| **Rating (1–5)**（評分） | 選 1 至 5 顆星 | 1–5 分的分佈及平均分 |
| **Short text**（單行文字） | 輸入一行文字 | 作答人數；內容納入 AI 總結 |
| **Long text**（多行文字） | 輸入多行文字 | 作答人數；內容納入 AI 總結 |
| **Matrix**（矩陣，2026-11-16 起） | 多條陳述共用一套量表（例如「非常同意 … 非常不同意」），每條陳述選一格 | 陳述 × 量表的人數表，每格附百分比 |
| **Section heading**（段落標題，2026-11-16 起） | 不用作答，只顯示標題或說明，例如「Part A. Objectives」 | 不出現在報告中 |

**步驟 4**：完成所有題目。單選及多選題點 **Add option** 增加選項；每道題右上角可**上移**、**下移**或**刪除**；選項右邊的 **×** 可刪除選項。

矩陣題分兩部分：上面的 **Statements** 填陳述（**Add statement** 增加），下面的 **Scale** 填量表選項（**Add scale point** 增加）。

**步驟 4a（選用）**：每道題下方一行可以設定這道題**何時出現**。

| 設定 | 作用 |
|:--|:--|
| **Ask for text**（選項旁的勾選框，單選及多選題） | 參與者選了這個選項後，下方出現文字框，例如「Others, please specify」。所填文字列入審批人看到的文字答案，並納入 AI 總結 |
| **Always shown** 下拉框 | 選擇前面一道單選題，再選「is / is not」及某個選項：只有當參與者的答案符合時，這道題才出現。例如「只有角色**不是**新生參加者時才顯示」。被隱藏的必答題不用作答 |
| **All activities** 下拉框 | 把這道題歸入某個 ELAT GILO。SAO 為活動選了 GILO 時（見 [2.5](#25-為個別活動指定範本sao)），只發送所選 GILO 的題目；沒有選 GILO 的活動發送全部題目 |

![完成題目](images/activity-survey/09-questions-filled.png)

**步驟 5**：切換到 **Preview** 頁籤查看參與者看到的問卷，可點 **English / 繁體中文 / 简体中文** 切換語言逐一檢查。

![英文預覽](images/activity-survey/10-preview-english.png)

![繁體中文預覽](images/activity-survey/11-preview-traditional-chinese.png)

**步驟 6**：點 **Save** 儲存，新範本出現在列表中。

![範本已儲存](images/activity-survey/12-template-saved.png)

!!! warning "儲存前系統會檢查"
    - 名稱及每道題目都要填齊三種語言。
    - 至少 1 道、最多 80 道題目（段落標題也計入上限，但不算作「至少 1 道」）。
    - 單選及多選題至少 2 個、最多 20 個選項，每個選項都要填齊三種語言。
    - 矩陣題至少 1 條、最多 30 條陳述，量表至少 2 個、最多 20 個選項。
    - 顯示條件只能引用**前面**一道**沒有歸入 GILO** 的單選題。

    未填齊時，畫面上方會提示是哪一題、缺了甚麼。

### 2.4 管理範本與設定預設（SAO）

列表中每個範本的 **Operation** 欄：

| 操作 | 作用 |
|:--|:--|
| **Edit** | 修改範本內容 |
| **Copy** | 複製成一份新範本（不會成為預設） |
| **Set as default** | 設為預設範本 |
| **Delete** | 刪除範本 |

所有活動預設使用**預設範本**，同一時間只有一份。

**步驟 1**：在要設為預設的範本上點 **Set as default**。

![Set as default 按鈕](images/activity-survey/13-set-as-default-button.png)

**步驟 2**：該範本名稱旁顯示 **Default**，原來的預設範本恢復為普通範本。

![新的預設範本](images/activity-survey/14-default-template.png)

#### 預設範本：學生主導活動評估表格

自 2026-11-16 起，預設範本是 SAO 提供的「**Evaluation Form for Student-led Activities**（學生主導活動評估表格）」，同樣適用於 ELAT 活動。內容：

| 部分 | 題目 |
|:--|:--|
| 基本資料 | 你在活動中的角色（新生參加者 / 籌委會成員 / 非籌委會成員 / 其他，請註明）；你的就讀年級（1–5） |
| Part A. Objectives | 4 條陳述，「非常同意 … 非常不同意」 |
| Part B. Content & Arrangement | 5 條陳述，同一量表 |
| Part C. GILOs | 每個 GILO 一道矩陣題，「Very Competent … Not competent at all」。**只發送 SAO 為該活動所選 GILO 的題目**；新生參加者不答這些題，改答固定的兩道：解決問題能力（首兩項）及社交能力（首兩項） |
| Part D | 其他意見或建議（文字） |
| Part E | 你如何得知這個活動（可多選，含「其他，請說明」） |

活動名稱由系統自動顯示在問卷頁面頂部，不用參與者填寫。

!!! note "預設範本的規則"
    - 建立的**第一份範本**自動成為預設範本。
    - 預設範本**不能刪除**；如需刪除，請先把另一份設為預設。
    - 某活動已指定某份範本、而該活動問卷尚未發送時，該範本也不能刪除。
    - 問卷發送時，系統把當時的範本內容複製給該活動使用。之後修改或刪除範本，**只影響之後發送的問卷**。

### 2.5 為個別活動指定範本（SAO）

如某個活動需要使用另一份範本，可在問卷發送**之前**單獨指定。

**步驟 1**：點 **Management Centre → View Activity List**，在該活動一行的 **Actions** 欄點最右邊的問卷按鈕（滑鼠移上去顯示「Participant Survey」）。

![活動列表的問卷按鈕](images/activity-survey/15-activity-list-survey-button.png)

**步驟 2**：彈出「Participant Survey」視窗。「Default template (…)」表示跟隨預設範本，括號內是現時的預設範本名稱。

![Participant Survey 視窗](images/activity-survey/16-activity-survey-dialog.png)

**步驟 3**：點下拉框選擇範本。

![選擇範本](images/activity-survey/17-activity-survey-options.png)

**步驟 4**：選定後點 **Save**。

![已選擇範本](images/activity-survey/18-activity-survey-selected.png)

**選擇 GILO（2026-11-16 起）**：同一視窗的 **GILOs** 一欄勾選這個活動涉及的 GILO，然後點 **Save**。問卷發送時，Part C 只包含所勾選 GILO 的題目，每個 GILO 的全部子項都會出現；一個都不勾則發送全部 GILO 的題目。GILO 必須在問卷發送前選好，發送後不能再改。

![選擇 GILO](images/activity-survey/27-activity-survey-gilos.png)

**步驟 5**：畫面上方顯示「Save Successful」即已儲存。如要改回跟隨預設範本，再次打開視窗選「Default template」並儲存。

![儲存成功](images/activity-survey/19-activity-survey-saved.png)

**問卷發送後**，不能再更換範本。此時再點問卷按鈕，視窗顯示實際發送的問卷（**Survey**）、發送時間（**Sent**）、截止時間（**Closes**）及作答人數 / 收件人數（**Responses**）。

![問卷發送後的視窗](images/activity-survey/20-activity-survey-after-sending.png)

若活動沒有任何人簽到，或發送時系統內沒有任何範本，問卷不會發出，視窗顯示「Not sent」及原因。

### 2.6 問卷發送規則

| 項目 | 規則 |
|:--|:--|
| 哪些活動會發送 | 已審批通過、未取消的活動，每個活動只發一份 |
| 發送給誰 | 該活動**任何一節曾簽到**的參與者，包括 OC 成員。訪客沒有系統帳戶，不會收到 |
| 何時發送 | 活動結束日後第 N 日的指定時間（見 [2.2](#22-設定發送時間sao)），於該時間後 10 分鐘內發出 |
| 通知方式 | 每位收件人收到**一則站內信**及**一封電郵**，按其語言偏好顯示，內有「填寫問卷」按鈕。**不會發送提醒** |
| 填寫期 | 發送後開放的日數，截止後不再接受作答 |
| 匿名 | 系統只記錄「誰已作答」以防重複提交，**答案本身不與任何人關聯**；SAO、OC 及審批人都看不到誰答了甚麼 |
| 補發 | 因系統維護等原因錯過發送時間，恢復後會補發；但若恢復時距**原定發送時間**已超過 3 日，則不再補發（例如功能上線前已結束的舊活動）。例：N = 2、指定時間 10:00，活動 11 月 1 日結束，原定 11 月 3 日 10:00 發送；系統在 11 月 6 日 10:00 前恢復會補發，之後才恢復則不發 |

### 2.7 參與者填寫問卷

**步驟 1**：參與者點站內信或電郵中的「填寫問卷」按鈕，以 SLAS 帳戶登入後進入問卷頁面。頁面顯示問卷名稱、活動名稱、說明、匿名提示及截止時間；紅色 **\*** 是必答題。

![問卷填寫頁面](images/activity-survey/21-participant-form.png)

矩陣題每一行是一條陳述，在該行選一格；手機上每條陳述下方列出量表選項。部分題目會按前面的答案出現或隱藏，例如選「新生參加者」後，Part C 只顯示兩道固定題目。選了「其他，請註明」等選項後，下方會出現文字框。

![矩陣題及條件題](images/activity-survey/28-participant-matrix.png)

**步驟 2**：作答後點 **Submit**。有必答題未答時，畫面提示「Please answer every required question」；必答的矩陣題要每一行都選。

**步驟 3**：提交成功後顯示感謝頁面。每人只能提交一次，之後再打開亦顯示此頁面。

![提交成功](images/activity-survey/22-participant-submitted.png)

!!! note "無法填寫的情況"
    - **問卷已截止**：頁面顯示「This survey has closed」。
    - **不是收件人**（例如沒有簽到）：頁面顯示「This survey is not available to you」。

    ![非收件人](images/activity-survey/23-participant-not-recipient.png)

---

## 3. 起草活動報告

### 3.1 誰可以起草

以下任一身分都可建立、編輯報告，以及發起和撤回聯署：

- 該活動**籌委會（OC）的成員**——活動申請時登記在 OC 名單上的學生；
- 該活動的**建立人**；
- 活動所屬學生組織的 **Group Leader**。

報告建立後，報告 OC 名單上的人都能開啟報告（查看與簽署）。

起草條件：

- **活動申請已獲批准**即可建立報告、填寫與儲存草稿，不必等活動結束。
- **活動結束日期已過**才能發起聯署。
- 一個活動**只能有一份**報告。

### 3.2 建立報告

**步驟 1**：登入後點左側選單 **Organiser Centre → Manage Activity Reports**。列表顯示你可以報告的活動及報告狀態，可按活動名稱、報告狀態及活動日期篩選。

![Manage Activity Reports 列表](images/activity-report/r01-manage-activity-reports.png)

Action 欄按報告狀態顯示不同按鈕：

| 報告狀態 | 按鈕 |
|:--|:--|
| Not Started | **Create Report** |
| Draft | **Continue Editing** |
| Returned / Change Requested | **Revise Report** |
| 其他 | **View Report** |

**步驟 2**：在狀態為「Not Started」的活動上點 **Create Report**，系統即建立草稿並帶入預載資料。

![Create Report 按鈕](images/activity-report/r02-create-report-button.png)

### 3.3 填寫報告各部分

報告分為五個部分，頁面頂部的步驟條可快速跳到各部分。頁面底部固定顯示當前狀態及 **Save Draft**、**Start Endorsement** 按鈕。

**Part 1 — Activity Information（活動資料）**

活動名稱、主辦單位及 **OC 名單**由系統預載。OC 名單可增刪改：手工新增一行時**輸入學號即自動帶出英文姓名與課程編號**；每行可勾選「On-site Leader」「On-site Observer」。修改預載內容請在該行的 **Discrepancy Remark** 說明；手工新增、且不是活動已登記 OC 的成員，差異備註**必填**。

![Part 1 活動資料](images/activity-report/r03-report-part1.png)

**Part 2 — Content and Evaluation（內容與評估）**

**活動目標**預載自活動申請時填寫的「活動目標闡述」，可修改；另填寫**執行總結**、**觀察與檢討**、**建議事項**。

![Part 2 內容與評估](images/activity-report/r04-report-part2.png)

**Part 3 — Finance Report（財務報告）**

收入與支出兩張表：**預計**欄預載自活動申請的預算，**實際**欄由填報人填寫；四項合計由系統自動計算。

![Part 3 財務報告](images/activity-report/r05-report-part3.png)

**Part 4 — Activity Records（活動記錄）**

- **出席**：讀取各活動日**已定稿的正式出席名單**，並列出待生效的出席修訂；出席有誤須回到「管理出席」修訂出席記錄，修訂隨報告一併審批（見 [5.10](#510-出席修訂與報告修訂輪)）。可另外上傳出席附件。
- **照片 / 影片**：上傳後須勾選「本人確認已就提交的照片 / 短片取得相關人士的同意」，否則無法發起聯署。
- **Participant Survey**：問卷結果，見 [3.4](#34-報告中的問卷結果)。

![Part 4 活動記錄](images/activity-report/r06-report-part4.png)

**Part 5 — Declaration and Endorsement（聲明與聯署）**

顯示真實性聲明全文、OC 簽署進度，以及審批中 Supervisor 的推薦結果（唯讀）。聲明由**每位 OC 在簽署時**確認。

![Part 5 聲明與聯署](images/activity-report/r07-report-part5.png)

!!! tip "請先定稿出席記錄再發起聯署"
    報告只採用**已定稿**活動日的正式出席名單；尚未定稿的活動日不會計入。所有活動日都未定稿時，系統改以簽到記錄、已批准報名及嘉賓組成出席名單。

### 3.4 報告中的問卷結果

問卷結果顯示在 Part 4 的「**Participant Survey**」區塊。問卷尚未發送時，區塊顯示問卷尚未發出。

**起草時：即時統計**

報告處於草稿、已退回或需要修訂時，顯示**即時統計**，即截至打開頁面時收到的所有答案；此時**沒有 AI 總結**。區塊頂部註明「as of（時間）, X of Y participants answered」。

![起草時的即時統計](images/activity-survey/24-report-live-statistics.png)

矩陣題以表格顯示：每行一條陳述，每格是選該量表選項的人數及佔該行作答人數的百分比。

![報告中的矩陣題統計](images/activity-survey/29-report-matrix.png)

**發起聯署時：凍結統計並生成 AI 總結**

1. **凍結統計**：以發起聯署那一刻的答案為準，之後才收到的答案不計入這一輪；報告被退回後重新發起聯署，會按當時的答案再凍結一次。
2. **生成 AI 總結**：約一分鐘內，AI 把**文字題答案**整理成英文總結（主要意見、正面回饋、問題及建議），不引述原文、不包含可識別個人的資料。

問卷仍在填寫期內也可以發起聯署，**不會被擋**；報告會註明統計時間及當時的作答人數。

| AI 總結顯示 | 意思 |
|:--|:--|
| The summary is being generated… | 正在生成，稍後重新整理頁面 |
| No participant wrote any comments. | 沒有人填寫文字題 |
| The summary could not be generated. | 生成失敗，Supervisor 可重新生成 |

**審批時：查看文字答案及修訂 AI 總結**

審批人在報告審批頁可看到凍結的統計、AI 總結，以及底部的「**Written answers**」——所有匿名文字答案，按題目分組、隨機排序。OC 看不到這一部分。

![審批時的總結及文字答案](images/activity-survey/25-report-summary-and-answers.png)

**只有 Supervisor**（在 Supervisor 推薦步驟）可修訂 AI 總結：

1. 點總結下方的 **Edit**，修改內容。
2. 點 **Save**。報告顯示修訂後的內容，並註明「Revised by（修訂人）at（時間）」。

![修訂後的總結](images/activity-survey/26-report-summary-revised.png)

- 要恢復 AI 原文：再按 **Edit**，點 **Use AI version**。AI 原文一直保留，不會被覆蓋。
- AI 總結生成失敗時，Supervisor 可點 **Generate again**。
- 統計數字不能修改。

---

## 4. OC 聯署

### 4.1 發起聯署

報告填好後，在報告頁底部點 **Start Endorsement**。系統先儲存草稿，再檢查：

- 活動已獲批准**且已結束**；
- 已勾選照片 / 影片的同意聲明；
- OC 名單不是空的，且每位 OC 都有系統帳號（沒有的會自動建立，仍失敗則整單拒絕）；
- 手工新增、且不是活動已登記 OC 的成員已填寫差異備註。

通過後，報告轉為「**Pending Endorsement**」，**內容與 OC 名單鎖定**；系統凍結問卷統計、固定本輪引用的出席名單版本及出席修訂，並向全體 OC 發出站內通知（含直達簽署的連結）。

![待聯署的報告](images/activity-report/r23-pending-endorsement.png)

### 4.2 OC 簽署

**步驟 1**：OC 從站內通知或 Manage Activity Reports 進入報告，點底部的 **Review and Sign**。

**步驟 2**：閱讀聲明全文，勾選「I have reviewed the report and agree to sign this declaration.」，點 **Sign Report**。

![OC 簽署對話框](images/activity-report/r24-sign-dialog.png)

**最後一位 OC 簽署後**，報告即時轉為「**Submitted**」並進入審批。流程的發起人記為發起聯署的人，不是最後簽署的那位。

### 4.3 撤回聯署

待聯署期間，起草人可點 **Withdraw** 撤回。已收集的簽署作廢（保留於歷史，不計入下一輪），報告回到「Draft」；修訂輪則回到「Change Requested」。

### 4.4 轉移起草權（SAO）

當所有起草人都無法繼續處理報告（例如已畢業或退學），SAO 管理員可把報告轉移給另一位學生。

**步驟 1**：點 **Management Centre → View Activity List**，在該活動一行的 Actions 欄點 **Transfer Report Drafting** 按鈕。

![Transfer Report Drafting 按鈕](images/activity-report/r38-transfer-button.png)

**步驟 2**：填寫接手學生的學號（**Replacement student number**）及原因（**Reason**），點 **Transfer**。

![Transfer Report Drafting 視窗](images/activity-report/r39-transfer-dialog.png)

轉移後：

- 接手學生加入活動及報告的 OC 名單，可繼續起草；
- 報告內容保留；
- 正在進行的聯署會被重置，須重新發起；
- 操作人、原因、接手人及狀態變化記入操作日誌。

---

## 5. 審批

### 5.1 審批流程圖

```mermaid
flowchart TD
    D["全體 OC 簽署<br/>Submitted"] --> AG{"修訂輪且原分派仍有效?"}
    AG -->|"否"| E["Coordinator 分派<br/>Checker 可多選 + Supervisors"]
    AG -->|"是：沿用原 Checker / Supervisors"| SUB
    E -->|"退回"| RET(["Returned<br/>退回學生"])
    E -->|"分派"| SUB
    subgraph SUB ["檢查 + 推薦"]
      G{"有 Checker?"} -->|"是"| CHK["Checker 檢查<br/>任一位處理即生效"]
      CHK -->|"檢查通過"| SUP
      G -->|"否"| SUP["全體 Supervisor 推薦<br/>填寫 ELAT 資料"]
    end
    CHK -->|"退回 Coordinator"| E
    SUP -->|"退回 Coordinator"| E
    CHK -->|"退回學生"| RET
    SUP -->|"退回學生"| RET
    SUB --> NS{"NSOA?"}
    NS -->|"否"| REV["Activity Application Reviewer<br/>或 Delegate"]
    REV -->|"批准"| OK(["Approved"])
    REV -->|"退回"| SUB
    NS -->|"是"| VPS["VPSLA Secretary<br/>選組 + 投票截止時間"]
    VPS -->|"退回"| SUB
    VPS --> VPM["VPSLA Members 表態<br/>Approve / Neutral / Return<br/>Chairperson 可唯讀查看"]
    VPM -->|"全員表態或截止"| VPC["VPSLA Secretary 共識"]
    VPC -->|"退回"| SUB
    VPC -->|"確認共識"| CH["VPSLA Chairperson"]
    CH -->|"批准"| OK
    CH -->|"退回"| VPC
    OK -.->|"OC 開啟報告修訂（更正出席）"| CR["Change Requested<br/>修訂後重新聯署"]
```

!!! note "退回的兩種去向"
    - **退回學生**（畫面選項「Group Leaders」）：本輪審批結束，報告轉「Returned」，OC 修改後**必須重新發起聯署、全體 OC 重新簽署**。
    - **退回 Coordinator**，以及 Reviewer、VPSLA Secretary 的退回（重跑檢查與推薦）：審批仍在進行，報告維持「Submitted」，OC 不需要做任何事。

    **所有退回都必須填寫意見**，未填寫時退回按鈕不可按。

### 5.2 從待辦進入審批頁

**步驟 1**：審批人登入後點左側選單 **To-do List**，找到流程名稱為「Activity Report S…」（Activity Report Submission）的任務，點 **Handle**。

![待辦列表](images/activity-report/r25-coordinator-todo-list.png)

**步驟 2**：審批頁上方是報告全文（唯讀），下方是審批記錄及「**Action**」操作區。操作區按當前任務顯示不同按鈕。

![報告審批頁](images/activity-report/r26-report-approval-page.png)

### 5.3 Coordinator 分派

操作區有 **Assign and Submit** 與 **Return** 兩個選項。

![Coordinator 分派](images/activity-report/r27-coordinator-assign.png)

**分派：**

1. **Checker**：可選擇**一位或多位**持有 Activity Application Checker 角色的人；也可留空，流程直接進入 Supervisor 推薦。

    ![選擇 Checker](images/activity-report/r28-coordinator-checker-options.png)

2. **Activity Supervisors**：預先帶出活動已登記的督導，**可增刪**；新增的人必須持有 Supervisor 角色。至少保留一位。

    ![選擇 Supervisors](images/activity-report/r29-coordinator-supervisor-options.png)

3. 填寫意見（選填），點 **Assign and Submit**。

!!! warning "已指定過 Checker 的報告不能留空"
    報告被退回學生、修改後重新提交時，若之前的分派曾指定 Checker，Coordinator 表單會預填該 Checker，**不能留空**（可以更換）。

**退回**：選 **Return**，填寫意見後提交，報告退回學生。

### 5.4 Checker 檢查

被指派的 Checker 從待辦進入審批頁，操作區有 **Confirm Checked** 與 **Return**。

![Checker 確認檢查](images/activity-report/r30-checker-confirm.png)

- **Confirm Checked**：檢查通過，Supervisor 的待辦隨即出現。
- **Return**：在 **Return To** 選擇退回 **Coordinator**（重新分派，報告維持 Submitted）或 **Group Leaders**（退回學生），並填寫意見。

![Checker 退回選項](images/activity-report/r20-checker-return-options.png)

!!! note "多位 Checker"
    指派多位 Checker 時，**第一位**處理（檢查通過或退回）的人即決定結果，其他人的檢查任務自動取消。

    有 Checker 時，**Supervisor 的待辦要等檢查通過後才出現**。

### 5.5 Supervisor 推薦

Supervisor 的審批頁除報告全文外，還有兩個 Supervisor 專屬區塊：

- **Participant Survey**：可修訂問卷 AI 總結（見 [3.4](#34-報告中的問卷結果)）。

    ![Supervisor 看到的問卷區塊](images/activity-report/r31-supervisor-survey-section.png)

- **ELAT Information**：適用 ELAT 的活動須填寫（見 [6.2](#62-supervisor-填寫-elat-資料)）。

操作區有 **Recommend** 與 **Return**：

- **Recommend**：填寫意見（選填）後點 **Recommend**。ELAT 資料會在推薦時一併儲存。

    ![Supervisor 推薦](images/activity-report/r35-supervisor-recommend.png)

- **Return**：在 **Return To** 選擇 **Coordinator** 或 **Group Leaders**，填寫意見後點 **Return**。

    ![Supervisor 退回選項](images/activity-report/r34-supervisor-return-options.png)

!!! note "多位 Supervisor"
    **全體 Supervisor 都推薦**才算通過；任一位退回，本輪推薦即中止，其他 Supervisor 的任務一併取消。

### 5.6 Activity Application Reviewer 審批（非 NSOA）

非 NSOA 活動在全體 Supervisor 推薦後，交由 Activity Application Reviewer（或 Delegate）審批。

![Reviewer 審批](images/activity-report/r36-reviewer-approve.png)

- **Approve**：報告轉為「Approved」。
- **Return**：填寫意見，退回重做檢查與推薦（報告維持 Submitted）。

### 5.7 VPSLA 審批（NSOA）

NSOA 活動在全體 Supervisor 推薦後，改由 VPSLA 審批：

1. **VPSLA Secretary 選組**：選擇傳閱小組（**VPSLA Group**）並設定投票截止時間（**Voting Deadline**），兩者必填；或退回（重做檢查與推薦）。
2. **VPSLA Members 表態**：小組成員並行表態，每人選 **Approve**、**Neutral** 或 **Return**（選 Return 須填寫意見）。
    - Return 只是一票意見，**不會立即退回報告**，由 Secretary 看結果後決定。
    - 到了投票截止時間，未表態的成員自動計為「**Neutral**（截止未表態）」，表態階段結束。
    - 同一期間，所選小組的 **Chairperson** 收到「Activity Report Under VPSLA Review」通知，可**唯讀**查看報告及本輪表態，不參與投票。
3. **VPSLA Secretary 共識**：全員表態或截止後，Secretary 看表態統計，選擇**確認共識**送交 Chairperson，或退回（重做檢查與推薦）。
4. **VPSLA Chairperson 審批**：批准即結案；退回則回到 Secretary 共識環節。

### 5.8 退回與重新提交

報告被退回學生時，狀態轉為「**Returned**」，頁面頂部紅色橫幅顯示退回原因，表單恢復可編輯。

![被退回的報告](images/activity-report/r21-returned-report.png)

OC 修改後點 **Start Endorsement**，**全體 OC 必須重新簽署一輪**才會再次進入審批——上一輪的簽署不會沿用。歷次審批記錄及意見都保留，可在審批記錄中逐輪查看。

### 5.9 審批結果與通知

報告獲批准後，狀態轉為「**Approved**」。

![已批准的報告](images/activity-report/r37-report-approved.png)

| 事件 | 收到通知的人 |
|:--|:--|
| 發起聯署 | 全體 OC |
| 進入某審批環節 | 該環節的審批人 |
| 進入 VPSLA 表態 | 小組成員；Chairperson 收到唯讀查看通知 |
| 退回、批准 | 原有收件人（學生 / OC），**加上本次審批中實際辦理過任務的人**；去重，並排除做出決定的人本人 |

### 5.10 出席修訂與報告修訂輪

!!! note "2026-11 改為隨報告審批"
    按 2026-11-19 客戶意見，出席記錄的更正不再經獨立的出席記錄變更審批，改為隨活動報告一併審批（2026-11-26 上線）。

出席名單定稿後如需更正，由活動建立人 / OC 在「管理出席」**修訂出席記錄**（見 [activity-attendance-guide.md](activity-attendance-guide.md) §4.6）。修訂隨報告聯署、隨報告審批，**報告獲批准時才寫入正式名單**；Part 4「出席」逐日列出正式名單與修訂內容，審批人在同一頁一併審核。

| 報告狀態 | 能否修訂出席記錄 | OC 要做甚麼 |
|:--|:--|:--|
| 尚未建立報告 | 可以；建立報告時自動帶入 | 照常建立 |
| Draft / Returned / Change Requested | 可以 | 核對出席後照常發起聯署 |
| Pending Endorsement | 不可以（內容鎖定） | 如需修改，先撤回聯署 |
| Submitted | 不可以 | 等待；如需修改，待報告退回 |
| Approved | 須先開啟**修訂輪** | 在「管理出席」按「開啟報告修訂」，修訂後發起聯署、全體 OC 重新簽署 |

**修訂輪：**

1. OC 在「管理出席」按「開啟報告修訂」並確認，報告轉「Change Requested」，原已批准版本保持不變；列表按鈕為 **Revise Report**。
2. OC 修訂出席記錄後發起聯署，**全體 OC 重新簽署**。發起聯署前可「取消報告修訂」，報告回到 Approved，修訂捨棄。
3. 若原分派的 Checker 與 Supervisors 仍然有效，**跳過 Coordinator**，直接沿用；Checker **必須重新檢查**。
4. 若任何原分派人員已失效（不再持有角色、帳號停用等），改由 Coordinator 重新分派，審批頁說明原因並預填仍有效的人選。
5. 之後的推薦、審批及退回規則與首次提交相同。待辦類型顯示「活動報告（變更輪）」，審批頁標題旁有「報告修訂」標籤。
6. 修訂輪獲批准後，出席修訂寫入正式名單，並重新同步 ELAT（[6.7](#67-報告修訂後的重新同步)）。

---

## 6. ELAT 同步

活動報告獲批准後，SLAS 把活動資料及學生出席時數同步到 ELAT（Experiential Learning Activity Transcript）。

### 6.1 哪些活動會同步

只有**適用 ELAT** 的活動會同步。是否適用，由 Supervisor 在**活動申請審批**時勾選「ELAT Category B Eligibility」決定。不適用的活動，報告審批頁不會出現 ELAT 區塊。

### 6.2 Supervisor 填寫 ELAT 資料

Supervisor 在**報告的 Supervisor 推薦步驟**填寫審批頁上的「**ELAT Information**」區塊。區塊底部的「Not ready to sync. Missing:」列出尚欠的資料，以及同步狀態（Sync Status）。

![ELAT Information（未填）](images/activity-report/r32-elat-information-empty.png)

| 欄位 | 說明 |
|:--|:--|
| **Activity Type (XX)** | GC / CP / PE / CC 四選一，決定 ELAT 活動編號中的類別碼 |
| **Experience Type** | 經驗類型；畫面會顯示申請人當時的選擇供參考 |
| **Activity Nature (start-up)** | 只在特定經驗類型出現 |
| **Geographic Location** | 活動地點，預設 Hong Kong |
| **Did participants interact virtually with non-local …** | 是否與境外人士線上互動 |
| **Service Learning** | 是否屬服務學習 |
| **GILOs** | 按活動類型自動勾選核心 GILO（不能取消），可再勾選其他 |
| **Mode** | 活動形式，預設 Face-to-Face |
| **Programme Name (English)** | 英文名稱，預設活動名稱 |

![ELAT Information（已填）](images/activity-report/r33-elat-information-filled.png)

填好後點 **Save** 儲存；點 **Recommend** 推薦時也會自動儲存。「Missing」清單按已儲存的內容計算，儲存後才會更新。

!!! note "誰可以填寫"
    該報告的 Supervisor（包括 Coordinator 新增的 Supervisor）在推薦步驟填寫；SAO 管理員可在 ELAT Sync 頁面修改（見 [6.5](#65-sao-管理-elat-同步)）。

### 6.3 同步時間與內容

- 報告**最終批准**時，系統把該活動標記為「Requested（待同步）」。
- 系統於**每日 02:30** 自動同步待同步的活動，每次最多 200 個。
- 同步內容：
    - **活動編號**：以 SLAS 活動編號加上類別碼，例如 `SLA-2526-CC-0138`；主題加 `-001`，每個活動日一節加 `-NN`。
    - **學生出席時數**：按出席記錄計算，向上取整至 0.25 小時，最少 0.5 小時。
    - **主辦部門**：使用主辦單位的部門編號。
- 沒有學號的出席者會被略過，區塊會列出這些人。

### 6.4 同步資料的來源

送到 ELAT 的資料分兩類：**由 Supervisor 在報告審批時填寫**，以及**系統自 SLAS 既有資料自動帶入**（唯讀，畫面上不提供修改）。

**一、Supervisor 填寫（見 [6.2](#62-supervisor-填寫-elat-資料)）**

| ELAT 欄位 | 必填 | 備註 |
|:--|:--:|:--|
| Activity Type | ✓ | GC / CP / PE / CC，決定活動編號中的類別碼 |
| Experience Type | ✓ | 畫面同時顯示申請時的選擇供參考 |
| Geographic Location | ✓ | 預設 Hong Kong |
| Virtual Interaction | ✓ | **預設取申請表的「非本地互動」** |
| Service Learning | ✓ | — |
| GILOs | ✓ | 按活動類別預選核心項，核心項不能取消 |
| Activity Nature | △ | 只在經驗類型為 Start-up 時必填 |
| Mode | — | 留空則取活動的進行方式 |
| Programme Name (English) | — | 留空則取活動名稱 |

**二、系統自動帶入（唯讀）**

| ELAT 欄位 | SLAS 來源 |
|:--|:--|
| 活動編號（Programme Code） | 活動編號插入類別碼，例如 `SLA-2526-CC-0138` |
| 學年（Academic Year） | 活動編號的年份段，例如 `2627` → `2026-27` |
| 主題編號 / 節次編號 | 活動編號 + `-001`；每個活動日一節，加 `-NN` |
| 活動起訖日期 | 活動的開始及結束日期 |
| 主辦部門代碼 | 主辦單位所屬部門的字母代碼（如 `SAO`） |
| 主辦類型 | 主辦學生組織的類別：學生會屬會或宿生會 |
| 聯絡電郵 | 活動 Supervisor 在職員資料中的電郵，多位以逗號連接 |
| 節次名稱 | 「英文名稱（日期）」，例如 `Society Performance 2026 (15 Jul)` |
| 學生出席時數 | 按已核實的簽到記錄計算，見 [6.3](#63-同步時間與內容) |
| 請求同步時間 | 報告最終批准的時間 |

!!! note "節次以自然日為準"
    ELAT 的一個節次等於**一個自然日**，不是 SLAS 的場次：同一天的多個場次合併為一節；跨過午夜的場次在午夜切開，分屬兩日；已取消的場次不計。

### 6.5 SAO 管理 ELAT 同步

**步驟 1**：SAO 管理員點 **Management Centre → ELAT Sync**。列表顯示所有適用 ELAT 的活動，以及資料是否齊全（**Complete / Incomplete**）、ELAT 同步狀態及最後同步時間；可按活動編號或名稱搜尋。

![ELAT Sync 頁面](images/activity-report/r40-elat-sync-page.png)

**步驟 2**：點 **Edit** 打開該活動的 ELAT 資料，欄位與 Supervisor 填寫的相同。

![ELAT Sync 編輯視窗](images/activity-report/r41-elat-sync-dialog.png)

- **Save and Request Sync**：儲存並標記為待同步，於當晚 02:30 同步。
- **Sync Now**：儲存並立即同步。

!!! warning "注意"
    - **Save and Request Sync** 與 **Sync Now** 不檢查報告是否已批准，請只對已批准報告的活動使用。
    - ELAT 處理中或已處理（見 6.5 中標示「鎖定」的狀態）的活動不能再修改或重新同步。
    - 錯誤訊息只有英文。

### 6.6 同步狀態

| 狀態 | 意思 | 可否修改 |
|:--|:--|:--|
| Not synced | 尚未同步 | 可 |
| Requested | 已請求同步，等待 ELAT 處理 | 可 |
| Resync requested | 已同步過、再次請求同步 | 可 |
| Release requested | ELAT 待發布 | 鎖定 |
| Rejected | ELAT 已拒絕 | 鎖定 |
| Released | ELAT 已發布 | 鎖定 |
| In progress | ELAT 處理中 | 鎖定 |
| Sync error | 同步出錯，**ELAT error** 欄顯示原因 | 可，修正後重新同步 |

### 6.7 報告修訂後的重新同步

已批准的報告如因更正出席記錄而開啟**修訂輪**（見 [5.10](#510-出席修訂與報告修訂輪)），修訂後重新批准時，系統會**再次請求同步**，把更新後的出席時數送往 ELAT。

| 情況 | 處理 |
|:--|:--|
| ELAT 端狀態為 Not synced / Requested / Resync requested / Sync error | 於下一次排程（每日 02:30）重新同步；SAO 亦可在 ELAT Sync 頁按 **Sync Now** 立即同步 |
| ELAT 端狀態為 **Release requested / Rejected / Released / In progress**（鎖定） | 本次略過，**不視為失敗**。因請求時間仍晚於上次同步時間，排程每次執行都會再檢查一次；待 ELAT 端狀態回到可修改，系統會自動補上同步 |

重新同步時，ELAT 端已存在的節次、GILO 與出席記錄會沿用原有編號更新，不再重複建立；已不在範圍內的節次及已不出席的學生，其記錄會一併移除。

!!! warning "本節尚未在實際環境驗證"
    修訂輪重新同步的流程已按上述設計實作，但**截至 2026-11 尚未有完整的實跑記錄**。首次使用時建議與我方一同核對 ELAT 端的結果。

---

## 7. 報告內容與入口

### 7.1 報告保存的內容

- **正文**：活動名稱、主辦單位、活動目標、執行總結、觀察與檢討、建議事項、財務合計、聲明確認、聯署狀態與輪次、提交人與時間、退回原因。
- **明細**：OC 名單（含差異備註）、財務明細、照片與影片、分輪次的聯署記錄（含撤回或終止的輪次）、歷次審批與意見、每輪引用的出席名單版本、問卷統計及 AI 總結（含 Supervisor 修訂版與 AI 原文）。

### 7.2 頁面入口

| 頁面 | 選單 | 使用者 |
|:--|:--|:--|
| 管理活動報告 | Organiser Centre → Manage Activity Reports | 活動 OC、建立人、Group Leader |
| 活動報告（填寫 / 簽署） | 從上一頁或站內通知進入 | 活動 OC |
| 報告審批 | To-do List → Handle | 各審批角色 |
| 問卷範本 | Management Centre → Survey Templates | SAO 管理員 |
| 活動問卷、轉移起草權 | Management Centre → View Activity List | SAO 管理員 |
| ELAT 同步 | Management Centre → ELAT Sync | SAO 管理員 |
| 問卷填寫 | 站內信 / 電郵中的「填寫問卷」按鈕 | 活動參與者 |

---

## 8. 端到端 Demo 指南

### 8.1 準備條件

1. 一個**已獲批准、已結束**、**適用 ELAT** 的活動，各活動日的出席記錄**已定稿**，且有簽到記錄。
2. 該活動有 2 位以上有系統帳號的 OC（演示多人聯署）。
3. 該活動已登記至少 1 位 Supervisor。
4. Coordinator、Activity Application Checker 帳號各一。
5. 非 NSOA 主線另需 Activity Application Reviewer 帳號；NSOA 主線另需 VPSLA Secretary、Members、Chairperson 帳號，以及一個 VPSLA 傳閱小組。
6. SAO 管理員帳號，且 Survey Templates 已有預設範本。

### 8.2 主線 A — 問卷 → 起草 → 非 NSOA 審批 → ELAT

1. SAO 確認發送時間及預設範本（[2.2](#22-設定發送時間sao)、[2.4](#24-管理範本與設定預設sao)）。
2. 到發送時間後，參與者從站內信填寫問卷（[2.7](#27-參與者填寫問卷)）。
3. OC 在 Manage Activity Reports 建立報告，填寫五個部分；Part 4 可見問卷即時統計。
4. 點 **Start Endorsement** → 狀態轉 Pending Endorsement；其餘 OC 逐一簽署 → 狀態轉 Submitted。驗證：Part 4 問卷統計已凍結，約一分鐘後出現 AI 總結。
5. Coordinator 分派：**不選 Checker**，確認 Supervisors → **Assign and Submit**。
6. Supervisor：修訂 AI 總結 → 填寫 ELAT Information → **Recommend**（多位 Supervisor 須全部推薦）。
7. Reviewer → **Approve**。驗證：報告 Approved；ELAT Sync 頁面該活動為「Requested」。
8. 翌日 02:30 後，驗證 ELAT 同步狀態已更新；或由 SAO 在 ELAT Sync 點 **Sync Now** 立即同步。

### 8.3 主線 B — 含 Checker

在 8.2 第 5 步選擇**一位或多位 Checker**，然後驗證：

- Checker 的待辦立即出現，**Supervisor 此時看不到待辦**。
- 任一位 Checker **Confirm Checked** 後，其他 Checker 的任務消失，Supervisor 的待辦出現。

### 8.4 主線 C — NSOA（VPSLA）

活動為 NSOA 時，8.2 第 7 步改為：

1. VPSLA Secretary 選擇傳閱小組，設定投票截止時間。
2. 各 Member 選 Approve / Neutral / Return；同時以 Chairperson 登入，驗證收到唯讀通知、可查看報告與表態。
3. 讓一位 Member 不表態直到截止時間，驗證其被計為 Neutral（截止未表態）。
4. Secretary 確認共識 → Chairperson **Approve** → 報告 Approved。

### 8.5 旁支 — 退回與重新提交

1. Checker 選 **Return → Coordinator**：報告維持 Submitted，Coordinator 重新收到分派任務。
2. Supervisor 選 **Return → Coordinator**：同上。
3. Supervisor 選 **Return → Group Leaders**：驗證未填意見時按鈕不可按；提交後報告轉 Returned，頁面頂部顯示退回原因。
4. OC 修改後重新發起聯署，驗證**全體 OC 須重新簽署**；Coordinator 表單預填原 Checker 且不能留空。
5. 驗證退回通知同時發給 OC 及此前辦理過任務的審批人。

### 8.6 旁支 — 轉移起草權

SAO 在 View Activity List 對一份待聯署的報告執行 **Transfer Report Drafting**，驗證：接手學生可開啟並編輯報告；原聯署已重置；報告內容保留。

### 8.7 旁支 — 更正出席引發的修訂輪

前提：報告已 Approved。

1. OC 在「管理出席」對某個已定稿活動日按「開啟報告修訂」並確認。
2. 驗證：報告轉 Change Requested，列表按鈕為 Revise Report。
3. 修訂出席記錄後打開報告，驗證：Part 4 列出正式名單與修訂內容。
4. OC 重新聯署，驗證：**沒有 Coordinator 任務**，原 Checker 收到標示「報告修訂」的待辦。
5. 審批至批准，驗證：「管理出席」正式名單版本 +1，內容與修訂一致。

---

## 9. 邊界與已知限制

- **部分規則為暫定方案**：以下規則在客戶確認前先按建議實作，確認後可能調整——
    - 非 OC 的建立人及 Group Leader 仍保留起草權；SAO 以「轉移起草權」處理起草人失去資格的情況；
    - Supervisor 可退回 Coordinator 或學生，不能退回 Checker；內容未變的內部退回不強制 Checker 複查；
    - 多位 Checker 時第一位處理即生效；Checker / Supervisor 只能選已持有相應角色的人；
    - Coordinator 只能在分派環節調整人員，審批進行中不能增刪；
    - VPSLA Member 的 Return 只是意見、由 Secretary 決定；截止未表態計為 Neutral；Chairperson 只唯讀查看；
    - 退回 / 批准通知加上本次審批中實際辦理過任務的人。
- **VPSLA（NSOA）分支尚未有完整的端到端實跑記錄**，UAT 應優先覆蓋 [8.4](#84-主線-c--nsoavpsla)。
- **投票截止時間可設為過去的時間**，系統不會阻止；請 Secretary 設定合理的時間。
- **ELAT**：
    - Save and Request Sync 與 Sync Now 不檢查報告是否已批准；
    - 錯誤訊息只有英文；
    - 正式環境（PROD）尚未開放 ELAT Sync 頁面及每日同步。
- **問卷**：
    - 只發給有簽到記錄的人，訪客不會收到；
    - 不發送提醒；
    - 功能上線時，原定發送時間已過去超過 3 日的舊活動不會補發。
- **PDF 匯出未實作**，目前只能在系統內查看報告。
- **活動未結束時發起聯署的提示措辭不準確**：畫面顯示「活動結束後方可填寫活動報告」，實際上草稿可隨時填寫，只是聯署須待活動結束。
- **修訂輪只能從「管理出席」開啟**，用於更正出席記錄；已批准報告的其他內容沒有另外的修訂入口。
- **報告修訂聯動依賴環境開關**（預設關閉）。
- **聲明的簡體中文措辭待需求方確認**（涉及學生紀律處分與法律責任）。

---

## 10. 常見問題

**Q1：我是活動 OC，為甚麼在 Manage Activity Reports 看不到活動？**
請確認：活動申請已獲批准；你在活動申請的 OC 名單上；左側選單有 **Organiser Centre → Manage Activity Reports**。

**Q2：為甚麼按 Start Endorsement 被拒絕？**
常見原因：活動尚未結束；未勾選照片 / 影片同意聲明；手工新增的 OC 未填寫差異備註；有 OC 無法建立系統帳號。

**Q3：參與者沒有收到問卷？**
依序檢查：活動是否已審批通過且未取消；參與者是否有簽到記錄；是否已到「結束後第 N 日 HH:mm」及之後 10 分鐘；在 View Activity List 打開該活動的問卷視窗，若顯示「Not sent」會註明原因。

**Q4：可以看到某位參與者的問卷答案嗎？**
不可以。問卷是匿名的，系統沒有記錄答案與參與者的對應關係。

**Q5：問卷還沒截止，可以發起聯署嗎？**
可以。統計以發起聯署那一刻為準，報告會註明當時的作答人數。

**Q6：Supervisor 看不到待辦？**
如 Coordinator 指定了 Checker，Supervisor 的待辦要等 Checker 檢查通過後才出現。

**Q7：報告被退回 Coordinator，學生需要做甚麼嗎？**
不需要。報告仍在審批中（Submitted），由 Coordinator 重新分派。只有退回「Group Leaders」時才需要學生修改並重新聯署。

**Q8：VPSLA Member 選了 Return，報告會立即被退回嗎？**
不會。Return 只是一票意見，由 Secretary 在共識環節看全體表態後決定。

**Q9：報告批准後，ELAT 甚麼時候會有資料？**
批准當晚 02:30 自動同步。需要立即同步時，SAO 可在 ELAT Sync 頁面點 **Sync Now**。

**Q10：ELAT 同步失敗怎麼辦？**
在 ELAT Sync 頁面打開該活動，查看 **ELAT error** 欄的原因及「Missing」清單，補齊資料後點 **Sync Now** 或 **Save and Request Sync**。
