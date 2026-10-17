# 活動生命週期通知模板設計說明（客戶確認版）

> 版本日期：2026-07-01（2026-10-09 補入出席變更相關通知，並按系統現行實作更新郵件頁腳）
> 用途：本文用於向業務方說明「活動推廣 / 活動報名 / 活動出席 / 活動報告（事件報告）」四個生命週期階段全部站內訊息與郵件通知的**觸發時機、接收人、發送方式和三語文案**，供業務**最終確認**。
> 本文只描述業務需求與現行發送規則，不包含任何技術實現方案。
> 原始基線：GitHub Issue #268《活動生命週期通知需求規格（P1 / 2026-06-09）》；修訂來源：客戶 2026-07-01 通知文案批註。
> 配套文檔：活動申請主流程通知見《活動申請通知模板設計說明（客戶審核版）》。

---

## 1. 閱讀指引

- 本文是**最終擬定文案**，請逐節核對標題、正文、接收人是否符合業務預期。
- 第 3 節《已確認事項與仍需確認事項》列出 2026-07-01 修訂後已拍板的規則，以及仍需業務確認的角色範圍。
- 第 9 節《不啟用通知確認清單》列出本階段**確定不發送**的通知，請確認客戶同意停用。
- 第 6.4 至 6.7 節為 2026-09 新增的「出席變更申請」及其帶動的活動報告修訂通知，按系統現行實作描述，請一併審閱。
- 所有啟用通知均提供 **English / 繁體中文 / 簡體中文** 三語，三語必須表達同一業務動作。
- 佔位符（如 `{ACTIVITY_NAME}`）在發送時替換為實際內容；某欄位沒有值時，該欄位整行不顯示，不留空標籤或空行。
- **發送方式**統一說明：「站內訊息 + 郵件」表示兩者都發；當接收人沒有郵箱或郵件服務不可用時自動跳過郵件，站內訊息照常發送。郵件與站內訊息使用同一業務內容。

---

## 2. 通知總覽（啟用通知）

| 階段 | 通知 | 接收人 | 發送方式 |
| --- | --- | --- | --- |
| 活動推廣 | 推廣申請已提交、推廣待審核、推廣審批通過、推廣審批拒絕 / 退回、審批完成同步告知 | 申請人、當前審批人、其他活動指導 / OC 成員 / 組織負責人 | 站內訊息 + 郵件 |
| 活動報名 | 報名已提交、報名名單待審核、報名審批結果、撤回報名 | 報名學生、相關活動指導 | 站內訊息 + 郵件 |
| 活動出席 | 活動前 24 小時提醒、簽到提醒、簽退提醒 | 已獲批報名 / 已簽到學生 | 站內訊息 + 郵件 |
| 出席變更（2026-09 新增） | 出席變更待審核、出席變更審批結果 | 當前審批人（Checker / Supervisor）、申請人 | 站內訊息 + 郵件 |
| 出席變更帶動的活動報告修訂（2026-09 新增） | 活動報告需要修訂；出席變更未能帶到活動報告的管理員提示 | 籌委（OC）成員、原 Checker 與 Supervisors、SAO Administrator | 僅站內訊息 |
| 活動報告（事件報告） | 提交確認、待活動指導確認、待事件分級、待活動指導跟進、處理報告待審閱、最終結果、退回、提交限期提醒、管理層通知 / 事件警報 | 報告人、活動指導、事件分級員、Dean / 管理單位 | 站內訊息 + 郵件 |

> **本文不覆蓋**：活動申請主流程通知（見 #210）、學生組織註冊 / 續期 / 申訴流程通知、新版活動報告（活動後總結報告）的聯署與審批通知（見《活動報告提交與審批流程》第 5 節）、非活動生命週期 P1 範圍的其他系統通知。
>
> **確定不啟用**的通知（推廣生效、活動開始前 2 小時提醒、缺席統計、活動完成、培訓提醒等）彙總於第 9 節，請一併確認。

---

## 3. 已確認事項與仍需確認事項

以下結論已按 2026-07-01 客戶修訂意見更新。其中僅 R01 為尚待業務提供資訊的開放問題，其餘按本版執行。

| 編號 | 事項 | 處理 |
| --- | --- | --- |
| C01 | 活動推廣「審批完成同步告知」發送給哪些人？是否排除申請人與本次審批人？ | 發送給其他活動指導（Supervisors）、OC 成員和組織負責人（Group Leader），並**排除**申請人與本次審批人。 |
| C02 | 報名相關的「新報名申請給組織者」「名額已滿提醒」是否啟用？ | **不啟用**；僅保留「報名已提交」確認與「報名審批結果」。 |
| C03 | 報名名單審批完成給組織者 / 給學生、單獨報名拒絕等重複通知如何處理？ | **停用**；不單獨發送重複通知。 |
| C04 | 活動出席提醒保留哪些？ | 僅保留**活動前 24 小時提醒、簽到提醒、簽退提醒**；停用活動開始前 2 小時提醒、缺席統計通知、活動完成通知。 |
| C05 | 事件報告「最終結果」中「退回」的語義如何統一？ | 統一為 **`Returned for Revision / 退回修改`**，不與 `Rejected / 拒絕` 混用。 |
| C06 | 培訓提醒與培訓合規結果通知是否啟用？ | **不啟用**；業務說明為：組織者未完成培訓時，不能獲批報名活動。 |
| C07 | Activity Report Audit、Student Group Registration Approval、Student Group Registration Appeal | 當時功能尚未開發或尚未 UAT 測試，暫時停用並隱藏通知樣本。**2026-10 註**：新版活動報告審批與修訂版學生組織註冊／申訴流程已上線並發送待辦及結果通知，相關文案不在本文範圍（活動報告見《活動報告提交與審批流程》第 5 節）。 |
| C08 | 通知正文抬頭 | 啟用通知統一使用預設問候語 `Dear User,` / `您好，`，不使用個人姓名抬頭。 |
| C09 | 學生端連結 | 學生沒有 to-do-list；學生收到的 withdraw、re-enrol、resubmit、review 類連結不得指向待辦列表。 |
| C10 | Incident Report 郵件結構 | 所有事件報告郵件統一加入郵件頭與系統頁腳；有審核連結時，只保留按鈕或連結之一，不重複顯示。 |
| C11 | Incident Report Type 欄位 | Supervisor 不需要提交 Emergency Report；Organisers 提交 1-day 和 2-week incident reports。 |
| R01（**開放**） | 事件報告管理層通知的接收範圍（Dean / 管理單位 / 學生事務長等）是否已完整覆蓋？ | 當前發送給系統現有的管理 / 最終審閱人員範圍。**若業務要求加入學生事務長或其他授權人員，請提供明確的角色、用戶組或數據來源。** |

---

## 4. 活動推廣通知

### 4.1 推廣申請已提交（站內訊息 + 郵件）

- 觸發：推廣申請提交成功並進入審批後。
- 接收人：推廣申請人。
- 問候語：統一使用預設問候語 `Dear User,` / `您好，`。
- 包含欄位：活動名稱、主辦單位、申請人、推廣 / 報名開始與結束時間。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Promotion Application Submitted | Your activity promotion application has been successfully submitted and is now under review. |
| 繁中 | 宣傳申請已提交 | 您的活動宣傳申請已提交，目前正在審核中。 |
| 簡中 | 推广申请已提交 | 您的活动推广申请已提交，目前正在审核中。 |

### 4.2 推廣待審核（站內訊息 + 郵件）

- 觸發：推廣審批任務產生時。
- 接收人：當前推廣審批人 / 候選審批人。
- 包含欄位：活動名稱、主辦單位、申請人、推廣 / 報名開始與結束時間、審核連結。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Promotion Pending Review | An activity promotion application has been submitted and is awaiting your review. Kindly review the details and proceed via the link below. |
| 繁中 | 宣傳待審核 | 有一項活動宣傳申請已提交，正等待您進行審核。請點擊下方連結審閱詳情。 |
| 簡中 | 推广待审核 | 有一项活动推广申请已提交，正等待您进行审核。请点击下方链接审阅详情。 |

### 4.3 推廣審批通過（站內訊息 + 郵件）

- 觸發：推廣審批通過、流程完成後。
- 接收人：推廣申請人 / 建立人。
- 問候語：統一使用預設問候語 `Dear User,` / `您好，`。
- 包含欄位：活動名稱、主辦單位、申請人、審核結果；不顯示 Reviewer、Review Time、Comments。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Promotion Approved | Your activity promotion application has been approved. |
| 繁中 | 宣傳審批通過 | 您的活動宣傳申請已通過審批。 |
| 簡中 | 推广审批通过 | 您的活动推广申请已通过审批。 |

### 4.4 推廣審批拒絕 / 退回修改（站內訊息 + 郵件）

- 觸發：推廣審批拒絕或退回、流程完成後。
- 接收人：推廣申請人 / 建立人。
- 問候語：統一使用預設問候語 `Dear User,` / `您好，`。
- 包含欄位：活動名稱、主辦單位、申請人、審核結果、原因、重新提交連結；不顯示 Reviewer、Review Time。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Promotion Rejected | Your activity promotion application has been rejected. Please review the comments below, make the necessary amendments, and resubmit via the system. |
| 繁中 | 宣傳審批被拒絕 | 您的活動推廣申請已被拒絕。請查看下方的審批意見，修正相關內容後重新提交申請。 |
| 簡中 | 推广审批被拒绝 | 您的活动推广申请已被拒绝。请查看下方的审批意见，修正相关内容后重新提交申请。 |

### 4.5 審批完成同步告知（站內訊息 + 郵件）

- 觸發：推廣審批結果產生後，同步告知相關人員。
- 接收人：其他活動指導（Supervisors）、OC 成員和組織負責人（Group Leader）；**排除**申請人與本次審批人（詳見 C01）。
- 包含欄位：活動名稱、審核結果、原因；不顯示 Reviewer、Review Time。

| 結果 | 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- | --- |
| 通過 | English | Promotion Approved | The activity promotion application has been approved by another Supervisor. No further review action is required. |
| 拒絕 / 退回 | English | Promotion Rejected | The activity promotion application has been rejected by another Supervisor. The applicant will be asked to revise and resubmit. No further review action is required from you at this stage. |
| 通過 | 繁中 | 宣傳已通過 | 此宣傳申請已獲其他活動指導審批通過，無需您進一步操作。 |
| 拒絕 / 退回 | 繁中 | 宣傳已被拒絶 | 此宣傳申請已被其他活動指導退回給申請人修改。申請人將在修訂後重新提交，目前無需您進行任何處理。 |
| 通過 | 簡中 | 推广已通过 | 此推广申请已被其他活动指导审批通过，无需您进一步操作。 |
| 拒絕 / 退回 | 簡中 | 活动推广已被拒绝 | 此推广申请已被其他活动指导退回给申请人修改。申请人将在修订后重新提交，目前无需您进行任何处理。 |

---

## 5. 活動報名通知

### 5.1 報名已提交（站內訊息 + 郵件）

- 觸發：學生提交活動報名。
- 接收人：報名學生。
- 問候語：統一使用預設問候語 `Dear User,` / `您好，`。
- 包含欄位：活動名稱、主辦單位、活動日期、報名時間、撤回報名連結。撤回報名連結不得指向學生待辦列表。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Enrolment Submitted | Your activity enrolment has been submitted and is under review. |
| 繁中 | 活動報名已提交 | 您的活動報名已提交，目前正在審核中。 |
| 簡中 | 活动报名已提交 | 您的活动报名申请已提交，目前正在审核中。 |

### 5.2 報名名單待審核（站內訊息 + 郵件）

- 觸發：報名名單獲 OC 推薦並進入活動指導審核時。
- 接收人：相關活動指導。
- 包含欄位：活動名稱、主辦單位、活動日期、報名時間、審核報名連結。
- English 術語統一使用 `Enrolment List Approval`，不得使用 `Enrollment List Approval`。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Enrolment Pending Review | The activity enrolment list has been submitted and is awaiting your review. Kindly review the details and proceed via the link below. |
| 繁中 | 活動報名待審核 | 活動報名名單已提交，正等待您進行審核。請點擊下方連結審閱詳情。 |
| 簡中 | 活动报名待审核 | 活动报名名单已提交，正等待您进行审核。请点击下方链接审阅详情。 |

### 5.3 報名審批結果（站內訊息 + 郵件）

- 觸發：單個報名被通過 / declined / returned，或批量審批完成後。
- 接收人：報名學生。
- 問候語：統一使用預設問候語 `Dear User,` / `您好，`。
- 包含欄位：活動名稱、主辦單位、活動日期、審核結果，以及撤回 / 重新報名 / 重新提交連結；報名審批結果不顯示 Review Time。Approved 通知不顯示 Comments，Declined 通知不顯示 Reason。
- 學生連結不得指向待辦列表。Declined 後的連結指向 SLAS 活動列表或活動頁；Returned 後須提供重新提交報名連結。

| 結果 | 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- | --- |
| 通過 | English | Enrolment Successful | Your activity enrolment is successful. Please attend the activity as scheduled, or cancel your enrolment via the link below if you can no longer attend. |
| Declined | English | Enrolment Declined | We regret to inform you that your enrolment application has been declined.<br><br>However, we welcome you to visit SLAS to explore and enrol in other exciting activities:<br><https://pappl.eduhk.hk/slas><br><br>If you have any questions, please contact the activity organiser directly. |
| Returned | English | Enrolment Returned | Your enrolment application has been returned. Please check the details and comments, and resubmit your enrolment if necessary. |
| 通過 | 繁中 | 活動報名成功 | 您的活動報名申請已通過審批。請準時出席活動；如未能出席，請點擊下方連結取消報名。 |
| Declined | 繁中 | 活動報名未獲通過 | 我們很遺憾地通知您，您的活動報名申請未獲通過。<br><br>歡迎您前往 SLAS，探索並參與其他精彩活動：<br><https://pappl.eduhk.hk/slas><br><br>如有任何疑問，請與活動主辦方聯繫。 |
| Returned | 繁中 | 活動報名已被退回 | 您的活動報名申請已被退回。請點擊下方連結查看詳情及意見，並在必要時重新提交申請。 |
| 通過 | 簡中 | 活动报名成功 | 您的活动报名申请已通过审批。请准时出席活动；如未能出席，请点击下方链接取消报名。 |
| Declined | 簡中 | 活动报名未获通过 | 我们很遗憾地通知您，您的活动报名申请未获通过。<br><br>欢迎您前往 SLAS 平台，探索并参与其他精彩活动：<br><https://pappl.eduhk.hk/slas><br><br>如有任何疑问，请与活动主办方联系。 |
| Returned | 簡中 | 活动报名已被退回 | 您的活动报名申请已被退回。请点击下方链接查看详情及审批意见，并在必要时重新提交申请。 |

### 5.4 撤回報名（站內訊息 + 郵件）

- 觸發：學生自行點擊「取消報名」併成功執行後。
- 接收人：報名學生。
- 包含欄位：活動名稱、主辦單位、活動日期、撤回時間、重新報名連結。重新報名連結不得指向學生待辦列表。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Enrolment Withdrawn Successfully | Your enrolment for the activity has been successfully withdrawn. If you wish to re-enrol, please visit the activity page via the link below. |
| 繁中 | 成功撤回活動報名 | 您的活動報名申請已成功撤回。若您希望重新報名參加，請點擊下方連結返回活動頁面。 |
| 簡中 | 成功撤回活动报名 | 您的活动报名申请已成功撤回。若您希望重新报名参加，请点击下方链接返回活动页面。 |

---

## 6. 活動出席通知

> 本階段僅啟用以下三類提醒；活動開始前 2 小時提醒、缺席統計通知、活動完成通知**不啟用**（詳見 C04 與第 9 節）。
> 出席提醒的 TC / SC 下拉值必須顯示對應中文值，不得繼續顯示 English 值。學生連結不得指向待辦列表。

### 6.1 活動前 24 小時出席提醒（站內訊息 + 郵件）

- 觸發：活動開始前約 24 小時自動觸發。
- 接收人：已獲批報名學生。
- 包含欄位：活動名稱、主辦單位、活動日期、撤回報名連結。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Event Reminder: `{ACTIVITY_NAME}` Starts Tomorrow | Your upcoming activity will start soon. Please attend on time, or cancel your enrolment via the link below if you can no longer attend. |
| 繁中 | 活動出席提醒：`{ACTIVITY_NAME}` 將於明天開始 | 您報名的活動即將開始。請準時出席活動；如未能出席，請點擊下方連結取消報名。 |
| 簡中 | 活动出席提醒：`{ACTIVITY_NAME}` 将于明天开始 | 您报名的活动即将开始。请准时出席活动；如未能出席，请点击下方链接取消报名。 |

### 6.2 簽到提醒（站內訊息 + 郵件）

- 觸發：活動開始時間後 30 分鐘內仍未簽到。
- 接收人：已獲批報名但未簽到的學生。
- 包含欄位：活動名稱、主辦單位、活動日期、撤回報名連結。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Action Required: Please Complete Check-in for `{ACTIVITY_NAME}` | Please contact the organisers on-site to complete your check-in. If you are still waiting for it to begin, remember to check in and out to record your attendance.<br><br>Click the link below to de-register yourself if you cannot attend the event. |
| 繁中 | 請完成簽到：`{ACTIVITY_NAME}` | 請聯繫現場籌辦者完成簽到。若您仍在等待活動開始，請記得在現場進行簽到及簽退，以完整記錄您的出席。<br><br>若您無法出席，請點擊下方連結取消報名。 |
| 簡中 | 请完成签到：`{ACTIVITY_NAME}` | 请联系现场组织者完成签到。若您仍在等待活动开始，请记得在现场进行签到及签退，以完整记录您的出席。<br><br>若您无法出席，请点击下方链接取消报名。 |

### 6.3 簽退提醒（站內訊息 + 郵件）

- 觸發：活動原定結束前 30 分鐘內仍未簽退。
- 接收人：已簽到但未簽退的學生。
- 包含欄位：活動名稱、主辦單位、活動日期。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Action Required: Please Complete Check-out for `{ACTIVITY_NAME}` | The activity is drawing to a close. Please contact the organisers on-site to complete your check-out to record your attendance. |
| 繁中 | 請完成簽退：`{ACTIVITY_NAME}` | 活動即將結束。請聯繫現場籌辦者完成簽退程序，以完整記錄您的出席。 |
| 簡中 | 请完成签退：`{ACTIVITY_NAME}` | 活动即将结束。请联系现场组织者完成签退程序，以完整记录您的出席。 |

### 6.4 出席變更待審核（站內訊息 + 郵件）〔2026-09 新增〕

> 出席變更申請用於在出席記錄定稿後更正個別學生的出席狀態，經 Checker（如有）及 Supervisor 審批後才寫入正式出席記錄。申請人提交時**不另發提交確認**（提交成功的畫面提示即為確認，審批完成後另行通知）。

- 觸發：出席變更申請提交後，流程進入以下環節時：
  - **Checker 檢查**：只在該活動的活動報告曾由 Coordinator 指派 Checker、且該人仍持有 Checker 角色並為啟用帳戶時出現；否則略過此環節。
  - **Supervisor 推薦**：Coordinator 最近一次為活動報告選定的 Supervisors（如已不屬活動現任活動指導，則改為活動全部現任活動指導）；多人並行處理。
- 接收人：該環節的處理人（每人一封）。
- 包含欄位：活動編號、活動名稱。審批人可於待辦列表處理。
- 語言：按每位接收人的語言偏好顯示。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Attendance Change Pending Review | An attendance change request is awaiting your review. |
| 繁中 | 出席變更待審核 | 有一份出席變更申請等待您審核。 |
| 簡中 | 出席变更待审核 | 有一份出席变更申请等待您审核。 |

### 6.5 出席變更審批結果（站內訊息 + 郵件）〔2026-09 新增〕

- 觸發：
  - **通過**：所有 Supervisors 均推薦，變更即寫入正式出席記錄；
  - **退回**：Checker 退回，或任何一位 Supervisor 退回（其餘 Supervisors 的待辦隨即撤銷），流程結束，如需更正須重新提交新申請。
- 接收人：**只發給申請人**（審批人已在待辦中看過該申請，不另行同步）。申請人自行撤回申請時不發通知。
- 包含欄位：活動編號、活動名稱。
- 語言：按申請人的語言偏好顯示。

| 結果 | 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- | --- |
| 通過 | English | Attendance Change Approved | Your attendance change request has been approved and applied to the official roster. |
| 退回 | English | Attendance Change Returned | Your attendance change request has been returned. Please review the comments and submit a new request. |
| 通過 | 繁中 | 出席變更審批通過 | 您的出席變更申請已通過審批並已生效。 |
| 退回 | 繁中 | 出席變更已退回 | 您的出席變更申請已被退回，請查看審批意見後重新提交。 |
| 通過 | 簡中 | 出席变更审批通过 | 您的出席变更申请已通过审批并已生效。 |
| 退回 | 簡中 | 出席变更已退回 | 您的出席变更申请已被退回，请查看审批意见后重新提交。 |

### 6.6 活動報告需要修訂（僅站內訊息）〔2026-09 新增〕

- 觸發：出席變更獲批後，系統即時（另有每 2 分鐘一次的定時檢查補做）把變更帶到該活動的活動報告，並按報告當時的狀態處理：

  | 活動報告狀態 | 系統處理 | 是否發本通知 |
  | --- | --- | --- |
  | 草稿 / 已退回 / 需要修訂 | 變更併入下一輪聯署與審批 | 是，發給籌委 |
  | OC 聯署中 | 本輪聯署作廢（已收集的簽署保留作記錄），報告轉為「需要修訂」，須重新聯署 | 是，發給籌委；若作廢的一輪本身是修訂輪，另發給原 Checker 與 Supervisors |
  | 已獲批 | 已批版本維持有效，另開「修訂輪」，報告轉為「需要修訂」 | 是，發給籌委及原 Checker 與 Supervisors |
  | 審批進行中 | 不中斷審批人的工作；待本輪結束後再處理 | 暫不發送，待處理時才發 |
  | 尚未建立活動報告 | 待報告建立後一併帶入 | 暫不發送 |

- 接收人：
  - **籌委（OC）成員**：活動報告上列名的籌委成員及報告提交人；報告尚未填寫任何籌委時，改為活動登記的籌委成員（含活動建立人）。
  - **原 Checker 與 Supervisors**：僅在上表註明的修訂輪情況下，按最近一次由 Coordinator 作出的指派。
- 發送方式：**僅站內訊息**，不發郵件。
- 語言：按每位接收人的語言偏好顯示。
- 正文末附「開啟活動報告」連結，直接開啟該份活動報告。
- 佔位說明：`{SESSION_NO}` 為場次編號；`{REVISION}` 為變更後的出席記錄版本號。

| 語言 | 標題 | 正文 | 連結文字 |
| --- | --- | --- | --- |
| English | Activity Report Amendment Required | The attendance records of "{ACTIVITY_NAME}" (session {SESSION_NO}) were amended to revision {REVISION} following an approved attendance change. Please review the attendance records in the Activity Report and ask the Organising Committee to endorse the revised report again. | Open the Activity Report |
| 繁中 | 活動報告需要修訂 | 活動「{ACTIVITY_NAME}」（場次 {SESSION_NO}）的出席記錄經審批變更後已更新至第 {REVISION} 版。請核對活動報告的出席記錄，並請籌委會重新聯署修訂後的報告。 | 開啟活動報告 |
| 簡中 | 活动报告需要修订 | 活动「{ACTIVITY_NAME}」（场次 {SESSION_NO}）的出席记录经审批变更后已更新至第 {REVISION} 版。请核对活动报告的出席记录，并请筹委会重新联署修订后的报告。 | 打开活动报告 |

### 6.7 出席變更未能帶到活動報告：管理員提示（僅站內訊息）〔2026-09 新增〕

- 觸發：
  - 同一出席變更連續處理失敗，每累計 10 次提示一次；或
  - 出席變更獲批已超過 14 天仍在等待（例如活動一直未建立報告），之後每日再提示一次。
- 接收人：所有 SAO Administrator。
- 發送方式：**僅站內訊息**，使用系統通知模板，以英文顯示（運作層面的提示）。
- 用途：提醒管理員跟進個別卡住的出席變更；一般等待（例如報告審批進行中）在 14 天內不會提示。

| 語言 | 內容 |
| --- | --- |
| English | Attendance change {CHANGE_ID} for {ACTIVITY_NAME} (session {SESSION_ID}) has not reached its Activity Report: status {STATUS}, reason {REASON}, attempts {ATTEMPTS}. |

---

## 7. 活動報告 / 事件報告通知

> 事件報告流程按報告類型與事件級別（低 / 中 / 高）裁剪：低級別在活動指導跟進後結束；中 / 高級別會進入 Dean / 管理單位的待閱與最終審閱環節。以下通知按所處流程節點和角色範圍發送。
> 所有 Incident Report 郵件標題不帶活動名稱，避免與其他通知標題規則不一致；活動名稱仍可作為正文資訊欄位顯示。郵件必須包含統一郵件頭與系統頁腳。若通知提供審核連結，只能顯示 Review Now 按鈕或原始連結之一，不得同時顯示按鈕和連結。
> 事件級別欄位只顯示級別值，不追加 `(Medium)` 等括號後綴。

### 7.1 事件報告提交確認（站內訊息 + 郵件）

- 觸發：OC 或 Supervisor 成功提交事件報告後。
- 接收人：報告提交人。
- 包含欄位：活動名稱、主辦單位、事件報告類別、提交人、角色、提交時間、查看連結。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Incident Report Submitted | The incident report has been submitted. Please click the link below to review the report details. |
| 繁中 | 事件報告提交確認 | 系統已收到事件報告。請點擊下方連結查看報告詳情。 |
| 簡中 | 事件报告提交确认 | 系统已收到事件报告。请点击下方链接查看报告详情。 |

### 7.2 事件報告待活動指導確認（站內訊息 + 郵件）

- 觸發：需活動指導先行確認的事件報告進入待確認節點。
- 接收人：本活動的活動指導（Supervisors）。
- 包含欄位：活動名稱、主辦單位、事件報告類別、提交人、角色、提交時間、審核連結。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Incident Report Pending Review | An incident report has been submitted and is awaiting your confirmation. Kindly review the details and proceed via the link below. |
| 繁中 | 事件報告待審閱 | 系統已收到事件報告，正等待您進行確認。請點擊下方連結審閱詳情。 |
| 簡中 | 事件报告待审阅 | 系统已收到事件报告，正等待您进行确认。请点击下方链接审阅详情。 |

### 7.3 事件待分級員分級（站內訊息 + 郵件）

- 觸發：活動指導提交緊急事件報告，或確認 OC 事件報告且勾選為「有事故」後。
- 接收人：事件分級員（Incident Level Classifier）。
- 包含欄位：活動名稱、主辦單位、事件報告類別、提交人、角色、提交時間、審核連結。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Incident Pending Classification | An incident report has been submitted and is awaiting your classification. Kindly review the details and proceed via the link below. |
| 繁中 | 事件待分級 | 系統已收到事件報告，正等待您進行事件分級與評估。請點擊下方連結審閱詳情。 |
| 簡中 | 事件待分级 | 系统已收到事件报告，正等待您进行事件分级与评估。请点击下方链接审阅详情。 |

### 7.4 事件待活動指導跟進（站內訊息 + 郵件）

- 觸發：事件分級員完成分級後。
- 接收人：本活動的活動指導（Supervisors）。
- 包含欄位：活動名稱、主辦單位、事件報告類別、事件級別、處理報告提交連結。
- 備註：Incident Report Type 應按報告提交角色顯示。Supervisor 不需要提交 Emergency Report；Organisers 提交 1-day 和 2-week incident reports。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Incident Pending Follow-up | The incident reported has been classified. After handling, please complete a report detailing how the incident was managed via the link below. |
| 繁中 | 事件待跟進 | 此事件已完成分級。請於事件處理完畢後，點擊下方連結提交處理詳情。 |
| 簡中 | 事件待跟进 | 该事件已完成分级。请在事件处理完成后，点击下方链接提交处理详情。 |

### 7.5 事件處理報告待審閱（站內訊息 + 郵件）

- 觸發：活動指導提交事件處理報告後（僅中 / 高級別事件）。
- 接收人：Dean / 管理單位等最終審閱人（詳見 R01）。
- 包含欄位：活動名稱、主辦單位、事件報告類別、處理報告查看連結。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Incident Handling Report Pending Review | The supervisor has submitted the incident handling report, which is now awaiting your final review and endorsement. Please click the link below to review the handling details. |
| 繁中 | 事件處理報告待審閱 | 活動指導已提交事件處理報告，目前正等待您進行最終審閱與核准。請點擊下方連結審閱處理詳情。 |
| 簡中 | 事件处理报告待审阅 | 活动指导已提交相关事件之处理报告，目前正等待您进行最终审阅与核准。请点击下方链接审阅处理详情。 |

### 7.6 事件報告最終結果通知報告人（站內訊息 + 郵件）

- 觸發：OC 提交的事件報告審批流程完成。
- 接收人：報告提交人。
- 包含欄位：活動名稱、主辦單位、事件報告類別、提交人、審核人、審核結果。
- 學生連結不得指向待辦列表。

| 結果 | 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- | --- |
| 通過 | English | Incident Report Approved | The incident report has been approved. |
| 退回 | English | Incident Report Returned for Revision | The incident report has been returned for revision. Kindly review the feedback, make the necessary amendments, and resubmit for approval via the link below. |
| 通過 | 繁中 | 事件報告已通過 | 事件報告已正式通過審核。 |
| 退回 | 繁中 | 事件報告已被退回修改 | 事件報告被退回。請點擊下方連結審閱修改意見，並於完成修正後重新提交審核。 |
| 通過 | 簡中 | 事件报告已通过 | 事件报告已正式通过审核。 |
| 退回 | 簡中 | 事件报告已被退回修改 | 事件报告被退回。请点击下方链接审阅修改意见，并在完成修正后重新提交审核。 |

### 7.7 事件處理報告結果通知（站內訊息 + 郵件）

- 觸發：事件處理報告審閱通過或退回。
- 接收人：活動指導 / 相關處理人。
- 包含欄位：活動名稱、主辦單位、事件報告類別、審核人、審核結果、原因。

| 結果 | 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- | --- |
| 通過 | English | Incident Handling Report Endorsed | The incident handling report has been endorsed. |
| 退回 | English | Incident Handling Report Returned for Revision | The incident handling report has been returned for revision. Kindly review the feedback, make the necessary amendments, and resubmit for approval via the link below. |
| 通過 | 繁中 | 事件處理報告已通過 | 事件處理報告已正式通過審閱。 |
| 退回 | 繁中 | 事件處理報告已被退回修改 | 事件處理報告被退回。請點擊下方連結審閱修改意見，並於完成修正後重新提交審核。 |
| 通過 | 簡中 | 事件处理报告已通过 | 事件处理报告已正式通过审阅。 |
| 退回 | 簡中 | 事件处理报告已被退回修改 | 事件处理报告被退回。请点击下方链接审阅修改意见，并在完成修正后重新提交审核。 |

### 7.8 分級退回活動指導（站內訊息 + 郵件）

- 觸發：事件分級員退回事件報告。
- 接收人：活動指導（Supervisors）。
- 包含欄位：活動名稱、主辦單位、事件報告類別、提交人、退回原因；操作按鈕連結到事件報告詳情 / 重新提交入口。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Incident Report Returned for Revision | The incident report has been returned for revision. Kindly review the feedback, make the necessary amendments, and resubmit for approval via the link below. |
| 繁中 | 事件報告已被退回修改 | 事件報告被退回。請點擊下方連結審閱修改意見，並於完成修正後重新提交審核。 |
| 簡中 | 事件报告已被退回修改 | 事件报告被退回。请点击下方链接审阅修改意见，并在完成修正后重新提交审核。 |

### 7.9 事件報告提交限期提醒（站內訊息 + 郵件）

- 觸發：事件報告臨近提交截止日期（約截止前 3 天內）且報告仍未完成提交。
- 接收人：活動負責人 / 活動指導。
- 包含欄位：活動名稱、活動日期、組織者名稱、報告狀態、提交連結。提交連結不得指向學生待辦列表。
- 抄送：郵件需 BCC Supervisor 和 Coordinator。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Incident Report Deadline Reminder | Please click the link below to complete and submit the incident report before the deadline. Please note that late submission or a NIL-submission may lead to a formal investigation by the Supervisor(s). |
| 繁中 | 事件報告提交限期提醒 | 請點擊下方連結，並於截止日期前完成及提交相關的事件報告。請注意：逾期未交或漏報，活動指導將可能推定活動曾發生事故並進行正式調查。 |
| 簡中 | 事件报告提交限期提醒 | 请点击下方链接，并在截止日期前完成及提交相关的事件报告。请注意：逾期未交或漏报，活动指导将可能推定活动曾发生事故并进行正式调查。 |

> 簡中標題已由源文案 `事件報告截止日` 修正為 `事件報告提交限期提醒`，與英文 / 繁中保持一致。

### 7.10 管理層通知 / 事件警報（站內訊息 + 郵件）

- 觸發：中 / 高級別事件進入管理層監控 / 最終審閱環節。
- 接收人：Dean / 管理單位等管理層人員（接收範圍詳見 R01）。
- 包含欄位：活動名稱、主辦單位、事件報告類別、事件級別、報告連結。

| 語言 | 標題 / 郵件主題 | 正文 |
| --- | --- | --- |
| English | Incident Alert | An incident reported might require your immediate attention. Please click the link below to review the report details. |
| 繁中 | 事件警報 | 事件可能需要您即時關注。請點擊下方連結審閱報告詳情。 |
| 簡中 | 事件警报 | 事件可能需要您即时关注。请点击下方链接审阅报告详情。 |

---

## 8. 培訓提醒 / 合規通知

培訓相關提醒在本階段**全部不啟用**（詳見 C06 與第 9 節）。

業務意見：不需要發送培訓提醒；組織者若未完成培訓，將無法獲批報名活動。

---

## 9. 不啟用通知確認清單

以下通知在本階段**確定不發送**，請確認客戶同意停用。

| 階段 | 不啟用通知 | 不啟用原因 |
| --- | --- | --- |
| 活動推廣 | 推廣生效通知 | 經客戶批註刪除，不單獨發送。 |
| 活動報名 | 新報名申請給組織者 | 不需要；不接入主流程。 |
| 活動報名 | 名額已滿提醒 | 不需要；不接入主流程。 |
| 活動報名 | 報名名單審批完成給組織者 | 與「報名審批結果」重複，刪除或併入。 |
| 活動報名 | Enrolment List Approved | 客戶要求停用，不單獨發送給 Organizer。 |
| 活動報名 | Enrolment List Rejected | 客戶要求停用，不單獨發送給 Organizer。 |
| 活動報名 | 報名名單審批完成給學生 | 與「報名審批結果」重複，刪除或併入。 |
| 活動出席 | 活動開始前 2 小時提醒 | 客戶確認不需要。 |
| 活動出席 | 缺席統計通知 | 客戶確認不需要；可保留必要的缺席標記能力，但不發送通知。 |
| 活動出席 | 活動完成通知 | 建議由活動後評價問卷通知替代。 |
| Activity Report Audit | 全流程通知 | 當時功能尚未開發或尚未 UAT 測試，暫時隱藏通知樣本（2026-10 註：見 C07）。 |
| Student Group Registration Approval | 全流程通知 | 當時功能尚未開發或尚未 UAT 測試，暫時隱藏通知樣本（2026-10 註：見 C07）。 |
| Student Group Registration Appeal | 全流程通知 | 當時功能尚未開發或尚未 UAT 測試，暫時隱藏通知樣本（2026-10 註：見 C07）。 |
| 出席變更 | 提交確認（給申請人） | 提交成功的畫面提示即為確認；審批完成後另發結果通知（6.5）。 |
| 出席變更 | 審批結果同步給其他審批人 | 審批人已在待辦中處理過該申請，不另行同步。 |
| 事件報告 | 跟進進展更新給報告人 | 客戶批註要求刪除，不必要。 |
| 事件報告 | 給組織負責人的結果知會 | 客戶批註要求刪除，不必要。 |
| 事件報告 | High-Level Incident Requires Escalation | 與 Incident Alert 重複，停用。 |
| 事件報告 | 待 Dean 監控的重複通知 | 與管理層通知重複，不另建重複模板。 |
| 事件報告 | 逾期催交提醒 | 當前只更新逾期天數，不單獨發通知。 |
| 培訓 | 培訓進度 / 截止 / 完成 / 自定義提醒 | 客戶確認不啟用。 |
| 培訓 | 培訓合規結果通知 | 客戶確認不啟用。 |

---

## 10. 通用規則

### 10.1 變量

欄位沒有值時，不顯示該欄位行，不留空標籤或空行。

| 變量 | 含義 | 主要使用場景 | 示例 |
| --- | --- | --- | --- |
| `{ACTIVITY_CODE}` | 活動編號 | 活動類通知（資訊欄位首行） | SLA-2526-0046 |
| `{ACTIVITY_NAME}` | 活動名稱 | 全階段 | Campus Music Night 2026 |
| `{ORGANISATION_NAME}` | 主辦單位名稱 | 推廣、報名、事件報告 | Singing Club |
| `{APPLICANT_NAME}` | 申請人名稱 | 推廣 | Alex Chan |
| `{ACTIVITY_DATE}` | 活動日期 | 報名、出席 | 2026-09-15 19:00 - 2026-09-15 21:30 |
| `{REVIEW_LINK}` | 審核 / 查看連結 | 待審核、待處理、事件報告 | https://slas.example.edu.hk/... |
| `{RESULT}` | 審核結果 | 審批結果 | Approved |
| `{RESUBMIT_LINK}` | 重新提交連結 | 推廣、報名、事件報告退回 | https://slas.example.edu.hk/... |
| `{WITHDRAW_LINK}` | 撤回報名連結 | 報名、出席 | https://slas.example.edu.hk/... |
| `{RE_ENROL_LINK}` | 重新報名連結 | 報名撤回後 | https://slas.example.edu.hk/... |
| `{INCIDENT_REPORT_TYPE}` | 事件報告類別 | 事件報告 | Safety incident |
| `{INCIDENT_LEVEL}` | 事件級別，不帶括號後綴 | 事件報告 | Level 2 |
| `{DEADLINE}` | 截止日期 | 事件報告提醒 | 2026-09-20 |
| `{SESSION_NO}` | 場次編號 | 活動報告需要修訂（6.6） | 2 |
| `{REVISION}` | 出席記錄版本號 | 活動報告需要修訂（6.6） | 3 |

> **2026-07 UAT 意見後的通用調整（現行）**：活動類通知的資訊欄位以「活動編號（Activity Code）」為第一行；所有通知不再顯示「審核意見（Comments）」欄，只有拒絕類通知保留「原因（Reason）」欄。

### 10.2 欄位標籤（三語）

| 欄位 | English | 繁中 | 簡中 |
| --- | --- | --- | --- |
| 預設問候語 | Dear User, | 您好， | 您好， |
| 活動名稱 | Activity Name | 活動名稱 | 活动名称 |
| 主辦單位 | Organising Unit | 主辦單位名稱 | 主办单位名称 |
| 申請人 | Applicant | 申請人 | 申请人 |
| 活動日期 | Activity Date | 活動日期 | 活动日期 |
| 審核連結 | Review Link | 審核連結 | 审核链接 |
| 審核結果 | Result | 審核結果 | 审核结果 |
| 原因 | Reason | 原因 | 原因 |
| 事件報告類別 | Incident Report Type | 事件報告類別 | 事件报告类别 |
| 事件級別 | Incident Level | 事件級別 | 事件级别 |
| 截止日期 | Deadline | 截止日期 | 截止日期 |
| 通過 | Approved | 已通過 | 已通过 |
| 拒絕 | Rejected | 已拒絕 | 已拒绝 |
| 退回修改 | Returned for Revision | 已退回修改 | 已退回修改 |

### 10.3 站內訊息展示順序

1. 通知標題
2. 問候語
3. 正文固定文案
4. 活動 / 報名 / 事件報告資訊欄位
5. 操作連結（如適用）

### 10.4 郵件展示順序

1. 郵件主題
2. 免回覆聲明
3. 問候語
4. 正文固定文案
5. 活動 / 報名 / 事件報告資訊欄位
6. 操作連結（如適用）
7. 系統頁腳

### 10.5 免回覆聲明與系統頁腳

免回覆聲明與頁腳規則與《活動申請通知模板設計說明（客戶審核版）》保持一致。

免回覆聲明：

| 語言 | 文案 |
| --- | --- |
| English | This is a system-generated message from the Student-led Activities System (SLAS). Please do not reply. |
| 繁中 | 本郵件由學生主導活動系統 (SLAS) 自動生成，請勿直接回覆。 |
| 簡中 | 本邮件由学生主导活动系统 (SLAS) 自动生成，请勿直接回复。 |

系統頁腳（現行；按 2026-07 UAT 意見，原「如有查詢」及系統名稱標題段、保密聲明前綴已移除，並加入郵件語言說明；事件報告、培訓等其他模組的郵件亦使用同一頁腳）：

| 語言 | 頁腳 |
| --- | --- |
| English | This message may contain confidential information intended only for the designated recipient(s). If you received it in error, please delete it and contact student-led@eduhk.hk.<br>Note: The language of this email depends on the webpage language settings used when this notification was triggered. |
| 繁中 | 本郵件可能載有保密資料，僅供指定收件人閱覽。如您誤收本郵件，請刪除並聯絡 student-led@eduhk.hk。<br>註：本郵件的發送語言，取決於您觸發此通知時的網頁語言設定。 |
| 簡中 | 本邮件可能载有保密资料，仅供指定收件人查阅。如您误收本邮件，请删除并联系 student-led@eduhk.hk。<br>备注：本邮件的发送语言，取决于您触发此通知时的网页语言设置。 |
