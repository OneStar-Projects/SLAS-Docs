# 活動申請通知模板設計說明（客戶審核版）

> 版本日期：2026-07-01（2026-10-09 按系統現行實作核對更新）
> 用途：本文用於向業務方說明「活動申請主流程」全部站內訊息與郵件通知的**觸發時機、接收人、發送方式和三語文案**，供業務審核與確認。
> 本文只描述業務需求與現行發送規則，不包含任何技術實現方案。
> 原始基線：GitHub Issue #210《活動申請通知需求規格（2026-06-02）》正文；修訂來源：客戶 2026-07-01 通知文案批註，及 2026-07-21／29 UAT 意見（RM-229）。
> 2026-10-09 核對結果：已按系統現行實作更新欄位清單、退回文案、新增的「退回活動指導」通知與郵件頁腳（見第 2.2 節）。

---

## 1. 閱讀指引

- 本文是**最終擬定文案**，請逐節核對標題、正文、接收人是否符合業務預期。
- 第 3 節《已確認事項》列出 2026-07-01 修訂後已拍板、會影響是否發送或如何展示的規則；第 2.2 節列出其後按 UAT 意見所作、現已生效的調整。
- 所有通知均提供 **English / 繁體中文 / 簡體中文** 三語，三語必須表達同一業務動作。
- 佔位符（如 `{ACTIVITY_NAME}`）在發送時替換為實際內容；某欄位沒有值時，該欄位整行不顯示，不留空標籤或空行。

---

## 2. 通知總覽

| 階段 | 通知 | 接收人 | 發送方式 |
| --- | --- | --- | --- |
| 提交前 OC 認可 | 需要 OC 認可、修改後重新認可、部分成員已認可、所有成員已認可 | OC 成員 | 僅站內訊息 |
| 申請提交 | 活動申請已提交 | **所有 OC 成員** | 站內訊息 + 郵件 |
| 審批待辦 | 各審批環節待辦提醒 | 當前審批人 | 站內訊息 + 郵件 |
| 退回活動指導 | 活動申請被退回（重新回到活動指導審核環節） | 該環節的活動指導（Supervisor） | 站內訊息 + 郵件 |
| 審批結果 | 審批通過 / 拒絕 / 退回修改 | **所有 OC 成員** | 站內訊息 + 郵件 |
| 審批同步 | 審批通過 / 拒絕 / 退回修改結果同步 | 已參與審批人員（不含申請人、當前處理人） | 站內訊息 + 郵件（獨立發送） |

**本次不覆蓋**：活動推廣申請流程、活動報名/簽到/出席記錄、活動總結、事件報告，以及非活動申請主流程的其他通知。

> 站內訊息與郵件使用同一業務內容，但展示長度不同：郵件保留完整內容；站內訊息若內容過長，會自動使用較精簡的文本和資訊欄位展示，避免超過系統站內訊息長度限制。

### 2.1 相對舊版的主要變化

| 變化 | 舊版 | 本版 |
| --- | --- | --- |
| 業務術語 | activity publish request / 活動發佈申請 | activity application / 活動申請 |
| 申請提交接收人 | 活動申請人 | 所有 OC 成員，樣本接收人顯示為系統角色 |
| 審批結果接收人 | 僅活動申請人 | 所有 OC 成員 |
| 審批結果欄位 | 顯示 Reviewer，Comments / Reason 顯示長文本 | 不顯示 Reviewer；Comments / Reason 直接顯示審核詳情 URL |
| 拒絕文案 | 可提示「修改後重新提交本申請」 | 拒絕後須重新發起**全新申請**，不得提示修改本申請 |
| IRG / VPSLA 術語 | vote / cast vote / VP group selection | assessment / recommendation / review / confirmation |
| 郵件結構 | 無統一免回覆聲明與頁腳 | 統一加入免回覆聲明與系統頁腳 |
| 樣本語言切換 | 可能聯動全站界面語言 | 僅切換通知標題與內容，不切換 SLAS 全站界面語言 |

### 2.2 2026-07 下旬 UAT 意見後的調整（現行）

以下調整按 2026-07-21／29 UAT 意見（RM-229）完成，現已在系統生效；第 4 節各通知的欄位清單已按此更新。

| 調整 | 現行做法 |
| --- | --- |
| 活動編號 | 所有活動申請通知的資訊欄位以「活動編號（Activity Code）」為第一行，其後才是活動名稱 |
| 活動日期 | 不再顯示活動層面的「活動日期」欄位（該日期範圍與申請表內各場次時間不一致，易生誤會） |
| 審核意見（Comments） | 所有通知不再顯示「審核意見」欄 |
| 原因（Reason） | 只有**拒絕**類通知保留「原因」欄；**退回**給申請人的通知不顯示原因，正文亦不再提示「查看下方的審批意見」 |
| 退回活動指導 | 申請由後續環節（例如 EO 場地意見、活動內容審批）退回到活動指導審核環節時，活動指導收到專門的「活動申請被退回」通知，而非一般待審核通知（見 4.3.1） |
| 郵件頁腳 | 頁腳精簡為保密聲明與郵件語言說明兩句（見 5.6） |

---

## 3. 已確認事項

以下事項已按 2026-07-01 客戶修訂意見確認。

| 編號 | 確認事項 | 處理 |
| --- | --- | --- |
| Q01 | 「Dean / Delegate 外部嘉賓認可（Guest Endorsement）」待辦通知 | 暫時停用，不在樣本或真實發送中啟用；VPRD / VPRD Delegate「嘉賓最終審批」仍按第 4.3 節發送 |
| Q02 | 「贊助審批」待辦通知 | 暫時停用，不在樣本或真實發送中啟用 |
| Q03 | EO 校園場地使用建議欄位 | 不顯示申請人；改顯示「活動指導」欄（English：Supervisor(s)） |
| Q04 | 審批結果通知 | 發給所有 OC 成員，抬頭統一使用預設問候語 Dear User；不顯示 Reviewer |
| Q05 | 審批結果 Comments / Reason | 直接顯示審核詳情 URL，避免 VPSLA 長意見撐長通知。**現行**：其後按 UAT 意見再收窄——通過不顯示意見，拒絕的「原因」欄顯示審核詳情連結，退回不顯示原因（見第 2.2 節） |
| Q06 | 審批同步通知 | 原建議以 BCC 同步發給所有已參與審批人員。**現行**：改為對每位已參與審批人員獨立發送站內訊息及單收件人郵件，收件人互不可見（見 4.5）；迎新活動同樣同步 |
| Q07 | 4.6 活動發佈成功通知 | 已移除 |
| Q08 | 通知樣本語言切換 | 只切換通知標題與內容，不聯動頁面上的 SLAS 全站界面語言 |
| Q09 | 郵件免回覆聲明 | 在郵件預覽和實際郵件中置中顯示 |

---

## 4. 各階段通知文案

### 4.1 提交前 OC 認可（僅站內訊息）

> 本節只在設計文檔中保留規格說明。Workflow Notification Samples 頁面無需新增 4.1.1 至 4.1.4 的通知樣本。

#### 4.1.1 需要 OC 成員認可
- 觸發：活動提交審批前，需 OC 成員確認參與並認可活動內容。
- 接收人：待認可的 OC 成員。

| 語言 | 標題 | 正文 |
| --- | --- | --- |
| English | Activity Endorsement Required | You have been designated as an Organising Committee (OC) member for the activity "{ACTIVITY_NAME}". Please review and endorse the activity before it can be submitted for approval. |
| 繁中 | 活動認可提醒 | 您已被列為活動「{ACTIVITY_NAME}」的籌備委員會（OC）成員。請審閱並予以認可，該活動方可提交正式審批流程。 |
| 簡中 | 活动认可提醒 | 您已被列为活动「{ACTIVITY_NAME}」的组委会（OC）成员。请审阅并认可此活动，以便提交正式审批流程。 |

#### 4.1.2 活動修改後需重新認可
- 觸發：活動草稿內容修改後，原 OC 認可不再有效。
- 接收人：需重新認可的 OC 成員。

| 語言 | 標題 | 正文 |
| --- | --- | --- |
| English | Activity Updated - Re-endorsement Required | "{ACTIVITY_NAME}" has been updated. Consequently, your previous endorsement is no longer valid. Please review the updated details and re-endorse. |
| 繁中 | 活動已更新 - 需重新認可 | 「{ACTIVITY_NAME}」的內容已更新，您先前的認可已不再有效。請重新審閱並予以認可。 |
| 簡中 | 活动已更新 - 需重新认可 | 「{ACTIVITY_NAME}」已被更新，您之前的认可已不再有效。请重新审阅并认可。 |

#### 4.1.3 部分 OC 成員已認可
- 觸發：某位 OC 成員已認可，其他成員仍需處理。
- 接收人：仍未認可的 OC 成員。

| 語言 | 標題 | 正文 |
| --- | --- | --- |
| English | Activity Awaiting Your Endorsement | {OC_ENDORSER_NAME} has endorsed the activity "{ACTIVITY_NAME}". Your endorsement is now required to proceed. |
| 繁中 | 活動待您認可 | {OC_ENDORSER_NAME} 已認可「{ACTIVITY_NAME}」。請您進行認可，以便後續流程繼續。 |
| 簡中 | 活动等待您的认可 | {OC_ENDORSER_NAME} 已认可「{ACTIVITY_NAME}」。等待您认可后方可继续。 |

#### 4.1.4 所有 OC 成員已認可
- 觸發：所有 OC 成員均已認可。
- 接收人：所有 OC 成員。

| 語言 | 標題 | 正文 |
| --- | --- | --- |
| English | Activity Ready for Submission | All Organising Committee (OC) members have endorsed "{ACTIVITY_NAME}". Any OC member can now submit it for approval. |
| 繁中 | 活動可提交 | 所有籌備委員會（OC）成員已認可「{ACTIVITY_NAME}」。任何 OC 成員現可提交該活動申請。 |
| 簡中 | 活动可提交 | 所有组委会（OC）成员已认可「{ACTIVITY_NAME}」。任何 OC 成员即可提交活动申请。 |

### 4.2 申請提交確認（站內訊息 + 郵件）

- 觸發：活動申請提交成功並進入審批流程。
- 接收人：所有 OC 成員；樣本頁面接收人顯示為系統角色。
- 問候語：統一使用預設問候語 `Dear User,` / `您好，`。
- 包含欄位：活動編號、活動名稱、主辦單位、申請人。
- 主辦單位名稱按每位接收人的語言偏好顯示。
- 活動名稱：三語樣本與實際通知均使用活動表單中的英文名稱。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Activity Application Submitted | Your activity application has been successfully submitted and is now under review. |
| 繁中 | 活動申請已提交 | 您的活動申請已成功提交，目前正在審核中。 |
| 簡中 | 活动申请已提交 | 您的活动申请已提交，目前正在审核中。 |

> 不得繼續使用「活動發佈申請已提交」或 `activity publish application submitted` 等舊表達。

### 4.3 審批待辦（站內訊息 + 郵件）

- 接收人：當前審批人。
- 每條待辦均包含：活動編號、活動名稱、主辦單位、申請人、審核連結。審核連結指向審批人的待辦列表（To-do List）。
- EO 校園場地使用建議通知不顯示「申請人」欄位，改顯示「活動指導」欄（English：Supervisor(s)）。
- 「Dean / Delegate 外部嘉賓認可（Guest Endorsement）」「贊助審批」兩個環節暫時停用，不在樣本或真實發送中啟用；VPRD / VPRD Delegate「嘉賓最終審批」仍按下表發送。
- IRG / VPSLA 文案統一使用 assessment / recommendation / review / confirmation，不得出現 vote、cast vote、VP group selection。
- VPSLA 成員評審通知的 Note 前須保留一個空行。

| 審批環節 | English 標題 / 正文 | 繁中標題 / 正文 | 簡中標題 / 正文 |
| --- | --- | --- | --- |
| Coordinator 活動申請分配 | Activity Review Pending Assignment / An activity application has been submitted and is awaiting your assignment to the Checker and Supervisor(s). Kindly review and take necessary action via the link below. | 活動申請待分配 / 有一項活動申請已提交，正等待您分配初審員（Checker）及活動指導（Supervisor）。請點擊下方連結進行分配。 | 活动申请待分配 / 有一项活动申请已提交，正等待您分配初审员（Checker）和活动指导（Supervisor）。请点击下方链接进行分配。 |
| EO 校園場地使用建議 | Advice Required on Campus Venue Usage / An activity application has been submitted, and the Supervisor has invited you to provide professional advice on campus venue usage. Kindly review and provide your input via the link below. | 校園場地使用待提供意見 / 有一項活動申請已提交，活動指導（Supervisor）邀請您就校園場地使用提供意見。請點擊下方連結進行審閱並提供建議。 | 校园场地使用待提供意见 / 有一项活动申请已提交，活动指导（Supervisor）邀请您就校园场地使用提供意见。请点击下方链接进行审阅并提供建议。 |
| Checker 審核 | Activity Pending Review / An activity application has been submitted and is awaiting your review. Kindly review the details and proceed via the link below. | 活動申請待審核 / 有一項活動申請已提交，正等待您進行審核。請點擊下方連結審閱詳情。 | 活动申请待审核 / 有一项活动申请已提交，正等待您进行审核。请点击下方链接审阅详情。 |
| Supervisor 審核 | Activity Pending Review / An activity application has been submitted and is awaiting your review. Kindly review the details and proceed via the link below. | 活動申請待審核 / 有一項活動申請已提交，正等待您進行審核。請點擊下方連結審閱詳情。 | 活动申请待审核 / 有一项活动申请已提交，正等待您进行审核。请点击下方链接审阅详情。 |
| 活動審批 | Activity Pending Review and Approval / An activity application has been submitted and is awaiting your review and approval. Kindly review the details and proceed via the link below. | 活動申請待審批 / 有一項活動申請已提交，正等待您的審批。請點擊下方連結審閱詳情。 | 活动申请待审批 / 有一项活动申请已提交，正等待您的审批。请点击下方链接审阅详情。 |
| IRG 小組選擇 | IRG - Sub-group Assignment Required / An activity application is awaiting your assignment to an Independent Review Group (IRG) Sub-group. Kindly review the details and proceed via the link below. | IRG - 活動申請待分配分組 / 有一項活動申請已提交，請為此活動審核分配一個獨立評審小組（IRG）分組。請點擊下方連結進行分配。 | IRG - 活动申请待分配分组 / 有一项活动申请已提交，请为此活动审核分配一个独立评审小组（IRG）分组。请点击下方链接进行分配。 |
| IRG 成員活動評審 | IRG - Activity Pending Assessment / An activity application is awaiting your assessment as an Independent Review Group (IRG) member. Kindly review the details and submit your recommendation via the link below. | IRG - 活動獨立評審待處理 / 有一項活動申請等待您作為獨立評審小組（IRG）成員進行評審。請點擊下方連結審閱詳情並提交您的評審建議。 | IRG - 活动独立评审待处理 / 有一项活动申请等待您作为独立评审小组（IRG）成员进行评审。请点击下方链接审阅详情并提交您的评审建议。 |
| IRG 摘要審閱 | IRG - Review Summary Ready for Confirmation / The Independent Review Group (IRG) review period has concluded. Kindly review and confirm the summary for the Vetting Panel of Student-led Activities (VPSLA) via the link below. | IRG - 評審摘要待確認 / 獨立評審小組（IRG）評審階段已完成。請點擊下方連結審閱評審摘要，並確認提交予學生主導活動審核小組（VPSLA）。 | IRG - 评审摘要待确认 / 独立评审小组（IRG）评审阶段已完成。请点击下方链接审阅评审摘要，并确认提交予学生主导活动审核小组（VPSLA）。 |
| VPSLA 小組選擇 | VPSLA - Activity Review and Confirmation Required / There are activity application(s) awaiting your confirmation to be passed to the VPSLA for further review. Kindly review and proceed via the link below. | VPSLA - 活動申請待確認放行 / 活動申請正等待您確認放行予學生主導活動審核小組（VPSLA）進行後續審核。請點擊下方連結進行審閱與確認。 | VPSLA - 活动申请待确认放行 / 活动申请正等待您确认放行予学生主导活动审核小组（VPSLA）进行后续审核。请点击下方链接进行审阅与确认。 |
| VPSLA 成員評審 | VPSLA - Activity Pending Review / Activity application(s) are awaiting your review as a Vetting Panel of Student-led Activities (VPSLA) member. Kindly review the details and submit your recommendation via the link below. Note: You may only submit your recommendation after the Independent Review Group (IRG) has completed the assessment. | VPSLA 評審待處理 / 活動申請正等待您作為學生主導活動審核小組（VPSLA）成員進行評審。請點擊下方連結審閱詳情並提交您的評審建議。注意：您必須在獨立評審小組（IRG）完成評審後，方可提交您的評審建議。 | VPSLA - 评审待处理 / 活动申请等待您作为学生主导活动审核小组（VPSLA）成员进行评审。请点击下方链接审阅详情并提交您的评审建议。注意：您必须在独立评审小组（IRG）完成评审后，方可提交您的评审建议。 |
| VPSLA 共識檢查 | VPSLA - Consensus Check Required / The VPSLA review period has concluded. Please verify the consensus and determine the subsequent action via the link below. | VPSLA - 共識檢查待處理 / 學生主導活動審核小組（VPSLA）的評審已完成。請點擊下方連結檢查小組共識並進行後續處理。 | VPSLA - 共识检查待处理 / 学生主导活动审核小组（VPSLA）的评审已完成。请点击下方链接检查小组共识并进行后续处理。 |
| Chairperson 決定 | VPSLA - Chairperson Decision Required / Activity application(s) are awaiting your decision as Chairperson of the Vetting Panel of Student-led Activities. Kindly review the details and proceed via the link below. | VPSLA - 主席決議待處理 / 活動申請正等待您作為學生主導活動審核小組（VPSLA）的主席做出最終決議。請點擊下方連結審閱詳情並提交您的決定。 | VPSLA - 主席决议待处理 / 活动申请正等待您作为学生主导活动审核小组（VPSLA）的主席做出最终决议。请点击下方链接审阅详情并提交您的决定。 |
| VPRD / VPRD Delegate 嘉賓最終審批 | SLA - External Guest Final Review Required / An activity external guest invitation list is awaiting your final review. Kindly review the details and proceed via the link below. | 學生主導活動嘉賓名單待最終審閱 / 一項學生主導活動的外部嘉賓邀請名單正等待您進行最終審閱。請點擊下方連結審閱詳情。 | 学生主导活动嘉宾名单待最终审阅 / 一项学生主导活动的外部嘉宾邀请名单正等待您进行最终审阅。请点击下方链接审阅详情。 |

#### 4.3.1 退回活動指導（站內訊息 + 郵件）

- 觸發：申請由後續環節（EO 場地意見、活動內容審批、贊助或嘉賓認可）退回，或經人工節點退回，重新回到活動指導審核環節。
- 接收人：該環節的活動指導（Supervisor）；取代該輪的一般「活動申請待審核」通知。
- 包含欄位：活動編號、活動名稱、申請人、審核時間、審核連結；**不顯示**退回原因。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Activity Application Returned | An activity application has been returned for further action. Kindly review via the link below. |
| 繁中 | 活動申請被退回 | 此活動申請已被退回，需要作進一步處理。請查看下方的連結，以作跟進。 |
| 簡中 | 活动申请被退回 | 此活动申请已被退回，需要作进一步处理。请查看下方的链接，以作跟进。 |

### 4.4 審批結果（站內訊息 + 郵件）

- 接收人：**所有 OC 成員**。
- 問候語：統一使用預設問候語 `Dear User,` / `您好，`。
- 包含欄位：活動編號、活動名稱、申請人、審核結果、審核時間；不顯示審核人。
- 「原因」欄只在**拒絕**時出現，內容為審核詳情連結；通過與退回均不顯示意見或原因。

#### 4.4.1 審批通過

| 語言 | 標題 / 郵件主題 | 正文 | 結果值 |
| --- | --- | --- | --- |
| English | Activity Approved | Your activity application has been approved. Please proceed with submitting the activity promotion application. | Approved |
| 繁中 | 活動審批通過 | 您的活動申請已通過審批。請繼續提交活動宣傳申請。 | 已通過 |
| 簡中 | 活动审批通过 | 您的活动申请已通过审批。请继续提交活动宣传申请。 | 已通过 |

#### 4.4.2 審批拒絕

| 語言 | 標題 / 郵件主題 | 正文 | 結果值 |
| --- | --- | --- | --- |
| English | Activity Application Rejected | Your activity application has been rejected. Please review the comments below for details. If you wish to proceed, please submit a new application. | Rejected |
| 繁中 | 活動申請已被拒 | 您的活動申請已被拒絕，請查看下方的審批意見以瞭解詳情。若要繼續辦理，需另行發起全新申請。 | 已拒絕 |
| 簡中 | 活动申请已被拒 | 您的活动申请已被拒绝。请查看下方的审批意见以了解详情。若要继续办理，需另行发起全新申请。 | 已拒绝 |

> 拒絕後**不得**提示「修改後重新提交當前申請」。如需繼續辦理，須發起全新申請。

#### 4.4.3 退回修改

| 語言 | 標題 / 郵件主題 | 正文 | 結果值 |
| --- | --- | --- | --- |
| English | Activity Application Returned for Revision | Your activity application has been returned for revision. Please make the necessary amendments and resubmit via the system. | Returned |
| 繁中 | 活動申請被退回修改 | 您的活動申請已被退回修改。請修正相關內容後重新提交申請。 | 已退回 |
| 簡中 | 活动申请被退回修改 | 您的活动申请已被退回修改。请修正相关内容后重新提交申请。 | 已退回 |

> 退回與拒絕不同：退回**允許**提示修改後重新提交本申請。退回通知不顯示原因，因此正文不再提示「查看下方的審批意見」。

### 4.5 已參與審批人員同步通知（站內訊息 + 郵件）

> **發送方式說明（現行）**：2026-07-01 批註建議以「郵件 BCC」實現同步，目的是避免公開其他審批人的收件地址。系統現行做法是**對每位已參與審批人員獨立發送**（站內訊息 + 單收件人郵件）：保密效果與 BCC 等同（收件人互不可見），同時通知在系統通知中心可見、按收件人語言偏好顯示，且不會因活動沒有 OC 成員而令參與人收不到通知。

- 用途：告知已參與審批的人員流程的最終結果（通過 / 拒絕 / 退回），無需繼續處理。
- 接收人：所有已參與審批人員，含 Supervisor 池中待辦被系統撤銷的成員；**不含**申請人，**不含**當前處理人（做出最終動作的審批人）；迎新活動同樣需要發送同步通知。
- 發送方式：站內訊息 + 郵件，對每位接收人獨立發送（郵件收件人僅本人，不使用 BCC，互不可見其他審批人地址）。
- 包含欄位：活動編號、活動名稱（固定英文）、申請人、審核結果、審核人（作出最終動作者）、審核時間；拒絕或退回時另加「原因」（審批意見原文）。通過時不顯示意見。
- 退回類同步通知的**郵件**不顯示原因，站內訊息則保留。
- 語言：按每位接收人的語言偏好渲染。

#### 4.5.1 審批通過同步

模板碼：`BPM_ACTIVITY_PUBLISH_SYNC_APPROVED`

| 語言 | 標題 / 郵件主題 | 正文 | 結果值 |
| --- | --- | --- | --- |
| English | Activity Application Approved | This activity application has been approved. No further review action is required. | Approved |
| 繁中 | 活動申請已通過審批 | 此活動申請已通過審批，無需再處理後續審批。 | 已通過 |
| 簡中 | 活动申请已通过审批 | 此活动申请已通过审批，无需再处理后续审批。 | 已通过 |

#### 4.5.2 Dean/Delegate 拒絕後同步

模板碼：`BPM_ACTIVITY_PUBLISH_SYNC_REJECTED`（Supervisor 以外環節的拒絕，含 VPSLA Chairperson，均使用本文案）

| 語言 | 標題 / 郵件主題 | 正文 | 結果值 |
| --- | --- | --- | --- |
| English | Activity Application Rejected | This activity application has been rejected. No further review action is required. | Rejected |
| 繁中 | 活動申請已被拒 | 此活動申請已被拒絕，無需再處理後續審批。 | 已拒絕 |
| 簡中 | 活动申请已被拒 | 此活动申请已被拒绝，无需再处理后续审批。 | 已拒绝 |

#### 4.5.3 Supervisor 退回後同步

模板碼：`BPM_ACTIVITY_PUBLISH_SYNC_RETURNED_SUPERVISOR`

| 語言 | 標題 / 郵件主題 | 正文 | 結果值 |
| --- | --- | --- | --- |
| English | Activity Application Returned by Supervisor | This activity application has been returned by a Supervisor for revision. The applicant will be asked to revise and resubmit. No further review action is required from you at this stage. | Returned |
| 繁中 | 活動申請已被活動指導退回 | 此活動申請已被活動指導退回給申請人修改。申請人將在修訂後重新提交，目前無需您進行任何處理。 | 已退回 |
| 簡中 | 活动申请已被活动指导退回 | 此活动申请已被活动指导退回给申请人修改。申请人将在修订后重新提交，目前无需您进行任何处理。 | 已退回 |

#### 4.5.4 Supervisor 拒絕後同步

模板碼：`BPM_ACTIVITY_PUBLISH_SYNC_REJECTED_SUPERVISOR`

| 語言 | 標題 / 郵件主題 | 正文 | 結果值 |
| --- | --- | --- | --- |
| English | Activity Application Rejected by Supervisor | This activity application has been rejected by a Supervisor. No further review action is required. | Rejected |
| 繁中 | 活動申請已被活動指導拒絕 | 此活動申請已被活動指導拒絕，無需再處理後續審批。 | 已拒絕 |
| 簡中 | 活动发布申请已被活动指导拒绝 | 此活动发布申请已被活动指导拒绝，无需再处理后续审批。 | 已拒绝 |

#### 4.5.5 非 Supervisor 環節退回後同步（兜底）

模板碼：`BPM_ACTIVITY_PUBLISH_SYNC_RETURNED`。退回動作來自 Supervisor 以外環節（如 VPSLA Chairperson）時使用，避免「by Supervisor」的錯誤歸因。

| 語言 | 標題 / 郵件主題 | 正文 | 結果值 |
| --- | --- | --- | --- |
| English | Activity Application Returned | This activity application has been returned to the applicant for revision. The applicant will be asked to revise and resubmit. No further review action is required from you at this stage. | Returned |
| 繁中 | 活動申請已被退回 | 此活動申請已被退回給申請人修改。申請人將在修訂後重新提交，目前無需您進行任何處理。 | 已退回 |
| 簡中 | 活动申请已被退回 | 此活动申请已被退回给申请人修改。申请人将在修订后重新提交，目前无需您进行任何处理。 | 已退回 |

### 4.6 已移除通知

第 4.6 節原「活動發佈成功」通知已按 2026-07-01 修訂意見移除，不在樣本或真實發送中啟用。

---

## 5. 通用規則

### 5.1 變量

| 變量 | 含義 | 示例 |
| --- | --- | --- |
| `{ACTIVITY_CODE}` | 活動編號 | SLA-2526-0046 |
| `{ACTIVITY_NAME}` | 活動名稱 | Campus Music Night 2026 |
| `{ORGANISATION_NAME}` | 主辦單位名稱 | Singing Club |
| `{APPLICANT_NAME}` | 申請人名稱 | Alex Chan |
| `{ACTIVITY_DATE}` | 活動日期（現行活動申請通知不再顯示） | 2026-09-15 19:00 - 2026-09-15 21:30 |
| `{REVIEW_LINK}` | 審核連結（待辦列表） | https://slas.example.edu.hk/#/bpm/my-todo |
| `{RESULT}` | 審核結果 | Approved |
| `{REVIEW_TIME}` | 審核時間 | 2026-06-01 19:45:00 |
| `{REASON_URL}` | 拒絕原因（審核詳情）連結 | https://slas.example.edu.hk/#/activity/review-result?id=100 |
| `{OC_ENDORSER_NAME}` | 已認可的 OC 成員姓名 | Chris Wong |

### 5.2 欄位標籤（三語）

| 欄位 | English | 繁中 | 簡中 |
| --- | --- | --- | --- |
| 預設問候語 | Dear User, | 您好， | 您好， |
| 帶姓名問候語 | Dear `%s`, | `%s` 您好， | `%s` 您好， |
| 活動編號 | Activity Code | 活動編號 | 活动编号 |
| 活動名稱 | Activity Name | 活動名稱 | 活动名称 |
| 主辦單位 | Organising Unit | 主辦單位名稱 | 主办单位名称 |
| 申請人 | Applicant | 申請人 | 申请人 |
| 活動指導 | Supervisor(s) | 活動指導 | 活动指导 |
| 審核連結 | Review Link | 審核連結 | 审核链接 |
| 審核結果 | Result | 審核結果 | 审核结果 |
| 審核人 | Reviewer | 審核人 | 审核人 |
| 審核時間 | Review Time | 審核時間 | 审核时间 |
| 原因 | Reason | 原因 | 原因 |
| 通過 | Approved | 已通過 | 已通过 |
| 拒絕 | Rejected | 已拒絕 | 已拒绝 |
| 退回 | Returned | 已退回 | 已退回 |

### 5.3 站內訊息展示順序

1. 通知標題
2. 問候語
3. 正文固定文案
4. 活動資訊與審批資訊

### 5.4 郵件展示順序

1. 郵件主題
2. 免回覆聲明，置中顯示
3. 問候語
4. 正文固定文案
5. 活動資訊與審批資訊
6. 系統頁腳

### 5.5 通知樣本語言切換

Workflow Notification Samples 頁面中的通知語言切換按鈕只作用於通知標題與通知內容。切換 English / 繁體中文 / 簡體中文樣本時，不得聯動或改變 SLAS 全站界面語言。

### 5.6 免回覆聲明與系統頁腳

免回覆聲明：

| 語言 | 文案 |
| --- | --- |
| English | This is a system-generated message from the Student-led Activities System (SLAS). Please do not reply. |
| 繁中 | 本郵件由學生主導活動系統 (SLAS) 自動生成，請勿直接回覆。 |
| 簡中 | 本邮件由学生主导活动系统 (SLAS) 自动生成，请勿直接回复。 |

系統頁腳（現行；按 2026-07 UAT 意見，原「如有查詢」及系統名稱標題段、保密聲明前綴已移除，並加入郵件語言說明）：

| 語言 | 頁腳 |
| --- | --- |
| English | This message may contain confidential information intended only for the designated recipient(s). If you received it in error, please delete it and contact student-led@eduhk.hk.<br>Note: The language of this email depends on the webpage language settings used when this notification was triggered. |
| 繁中 | 本郵件可能載有保密資料，僅供指定收件人閱覽。如您誤收本郵件，請刪除並聯絡 student-led@eduhk.hk。<br>註：本郵件的發送語言，取決於您觸發此通知時的網頁語言設定。 |
| 簡中 | 本邮件可能载有保密资料，仅供指定收件人查阅。如您误收本邮件，请删除并联系 student-led@eduhk.hk。<br>备注：本邮件的发送语言，取决于您触发此通知时的网页语言设置。 |
