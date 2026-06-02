# SLAS 文檔（給客戶版）

> 本倉庫存放 **Student-Led Activities System（SLAS）** 對客戶開放的設計與操作文檔。
> 倉庫內容分為兩大類：**設計文檔**（說明功能與流程的設計邏輯）與 **操作文檔**（步驟化指引，方便讀文檔就能完成測試 / 驗收）。

---

## 📐 設計文檔（功能與流程設計邏輯）

說明系統每個業務環節「為什麼這樣設計、由誰觸發、走哪條路徑、什麼條件分支」。閱讀對象：客戶業務負責人、需要確認流程合規性的人員。

| 文檔 | 範圍 |
| --- | --- |
| [activity-publish-workflow-design.md](activity-publish-workflow-design.md) | 活動發布審批的完整業務流程（NSOA / 非 NSOA、Supervisor / IRG / VP / Dean 多層審批） |
| [student-org-workflow-flowcharts.md](student-org-workflow-flowcharts.md) | 學生組織註冊與申訴審批的兩條流程 |
| [notification-and-email-guide.md](notification-and-email-guide.md) | 各業務流程在「什麼環節、向誰、用什麼方式」發出通知 / 郵件 |
| [roles-menus-permissions-matrix.md](roles-menus-permissions-matrix.md) | 角色 × 菜單 × 權限對照表，便於客戶確認每個角色能看到 / 操作什麼 |

---

## 🛠 操作文檔（步驟化指引，可獨立完成測試）

按系統實際介面寫的步驟化指引。閱讀對象：UAT 測試人、業務培訓人員、未來的最終使用者。每篇都從「進入哪個頁面、點哪個按鈕、填什麼欄位」開始講，不依賴開發人員陪同。

| 文檔 | 涵蓋場景 |
| --- | --- |
| [activity-end-to-end-demo-guide.md](activity-end-to-end-demo-guide.md) | 活動從草稿、OC 認可、Supervisor / IRG / VP / Dean 審批到發布的全鏈路演練 |
| [activity-enrollment-guide.md](activity-enrollment-guide.md) | 學生報名 → 推薦 → 審核 → 凍結名冊 → 名冊審批 |
| [activity-promotion-guide.md](activity-promotion-guide.md) | 活動推廣的提交、審核與上架；含「導入活動 vs 系統內發布活動」的差異提醒 |
| [activity-attendance-guide.md](activity-attendance-guide.md) | 活動出席（QR 簽到 + 手動補簽 + 出席終結） |
| [activity-report-guide.md](activity-report-guide.md) | 事件報告 / 活動報告的提交與審核 |
| [import-modules-guide.md](import-modules-guide.md) | 活動成員、社團組織的 Excel 批次導入 |
| [student-org-end-to-end-demo-guide.md](student-org-end-to-end-demo-guide.md) | 學生組織註冊 + 申訴流程全鏈路演練 |

---

## 閱讀順序建議

- **第一次接觸 SLAS**：先讀 [activity-publish-workflow-design.md](activity-publish-workflow-design.md) 了解最核心的活動審批設計，再翻 [activity-end-to-end-demo-guide.md](activity-end-to-end-demo-guide.md) 跑一遍流程。
- **準備 UAT / 培訓**：以「操作文檔」一節的 7 份為主，按業務模組分頭演練。
- **驗收流程合規性**：以「設計文檔」一節為主，重點看 [activity-publish-workflow-design.md](activity-publish-workflow-design.md) 與 [notification-and-email-guide.md](notification-and-email-guide.md)。

## 反饋

如閱讀過程發現流程描述與實際系統行為不一致，請聯絡 SLAS 項目組記錄；我們會在下一輪文檔同步時更新。
