---
title: 角色 × 選單 × 權限對照表
nav_order: 16
parent: 設計文檔
---

# SLAS 角色 × 選單 × 權限對照表（Roles × Menus × Permissions Matrix）

> 本文說明各系統角色可進入哪些選單（§1）、頁面內哪些操作受權限標識控制（§2），以及進入頁面後可見的資料範圍（§3）。
> 角色名稱一律採用系統「角色管理」頁所顯示的正式名稱（`SYSTEM_ROLE.NAME`）；流程中的習慣稱呼以「功能別名」另行註明。
> 更新日期：2026-10-09

---

> ## ⚠️ 閱讀須知：§1 的逐格授權以 2026-05 基線快照為底
>
> §1 各表的 `✓` 取自 2026-05 中旬的資料庫狀態。此後角色、選單與角色-選單綁定經過多次調整（其中 2026-06 曾全面重整一次角色、選單及綁定資料），因此 §1 未標示的格子只適合用來理解「哪類角色大致能進哪些選單」，**不宜直接作為驗收依據**。
>
> - 基線之後的每項授權變更，按日期列於 §1.0。
> - 基線之後新增或改動、並已按最新授權填寫的選單，在 §1 各表中以「**〔新〕**」或「**〔更新〕**」標示。
> - 逐格授權請以目標環境的實際查詢為準：
>
> ```sql
> SELECT r.id, r.name, m.id AS menu_id, m.name AS menu_name
> FROM   SLAS.SYSTEM_ROLE_MENU rm
> JOIN   SLAS.SYSTEM_ROLE r ON r.id = rm.role_id
> JOIN   SLAS.SYSTEM_MENU m ON m.id = rm.menu_id
> WHERE  m.type IN (1,2) AND r.deleted = 0 AND m.deleted = 0 AND rm.deleted = 0
> ORDER  BY r.id, m.id;
> ```

## 1. 選單 × 角色 詳細矩陣（三語）/ Menu × Role Detailed Matrix

### 1.0 基線之後的授權變更紀錄

| 日期 | 變更 | 涉及角色 |
|---|---|---|
| 2026-05-15 | 新增 Supervisor 活動審批權限 | Supervisor |
| 2026-06-14 | **全面重整**角色、選單及角色-選單綁定，清理歷史髒資料 | 全部 |
| 2026-06-16 | 「管理中心」授予 IRG Secretary 與 VPSLA Secretary | IRG Secretary、VPSLA Secretary |
| 2026-06-25 | 「通知模板」與「我的社團」設為不在側欄顯示（「我的社團」已於 2026-09-14 恢復，見下） | — |
| 2026-06-26 | Coordinator、Activity Application Reviewer、Delegate 改為自定義部門資料範圍（見 §3） | 115、149、150 |
| 2026-06-26 | 各「中心」選單重新排序並改名（例如管理中心的「管理出席」改名「查看出席」） | — |
| 2026-06-27／28 | 新增「通知樣本」選單並授予 SAO Administrator | SAO Administrator |
| 2026-06-30 | Checker 資料範圍改回「全部」；UAT 與 PROD 綁定對齊；為自定義部門角色回填使用者範圍；解除 Supervisor 的社團審核選單 | Checker、115、149、150、Supervisor |
| 2026-07-03 | Head 資料範圍由「全部」收窄為本院系 | Head |
| 2026-07-09 | 修正 Coordinator 的培訓記錄查詢權限 | Coordinator |
| 2026-07-25 | 新版活動報告的權限標識 `activity:report:*`（見 §2.2） | Group Leader、Student、Coordinator、Checker、Supervisor、VPSLA Secretary／Member、Activity Application Reviewer、Delegate |
| 2026-08-21 | 主辦中心新增「管理活動報告」選單 | Group Leader、SuperAdmin - Dev |
| 2026-09-14 | 「我的社團」恢復在側欄顯示 | Student、Group Leader |
| 2026-09-19 | 新增出席變更申請的權限標識 `activity:attendance:change:*`（見 §2.2） | Student、Group Leader、Coordinator、Supervisor、Checker、SuperAdmin - Dev |
| 2026-09-28 | 新增角色 **Appeal Group Secretary（153）**，選單與 Registration Appeal Endorser（139）相同；角色 142 由「Activity Application Checker」改名為 **Checker**（活動申請與學生組織註冊共用） | 153、142 |
| 2026-09-29 | 管理中心新增「組織類別申請期」「續期驗證碼」「評審小組成員」選單；「審批人管理」改掛管理中心並補上權限標識（見 §1.7、§2.2） | SAO Administrator、SuperAdmin - Dev、Registration Administrator、Appeal Group Secretary |
| 2026-10-03 | Appeal Group Secretary（153）加入流程引擎候選組，申訴的秘書檢查與秘書審閱待辦由此可正確派發及通知 | 153 |
| 2026-10-08 | 「續期驗證碼」頁新增「設定組織狀態」權限（停用、恢復、解散） | SAO Administrator、SuperAdmin - Dev |

> 視圖說明：縱向 = 每一個選單節點（僅目錄與選單頁，不含按鈕），橫向 = 12 個代表性角色。
> 儲存格 `✓` 表示該角色獲授權進入該選單，空白表示未授權。列頭一律採用系統角色正式名稱。
> Vertical = menu nodes (directories & pages only). Horizontal = 12 representative roles. `✓` = role bound to menu. Column headers use canonical role names.

**列頭說明 / Column legend**

| 列頭 / Column | 角色代碼 / code | ID |
|---|---|---:|
| Staff | `staff` | 4 |
| Student | `student` | 112 |
| Guest | `guest` | 3 |
| Group Leader | `sg_leader` | 114 |
| Coordinator | `coordinator` | 115 |
| Incident Level Classifier | `lv_classifier` | 128 |
| Dean of Students | `do_student_admin` | 129 |
| Activity Application Reviewer | `act_app_reviewer` | 149 |
| Supervisor | `supervisor` | 116 |
| SAO Administrator | `sao_admin` | 120 |
| System Admin (OCIO) | `ocio_admin` | 121 |
| SuperAdmin - Dev | `super_admin` | 1 |

> 註 / Note：
> - **三個 Dean 類角色務必區分**：
>
>   | ID | 正式名稱 | 代碼 |
>   |---:|---|---|
>   | 129 | Dean of Students | `do_student_admin` |
>   | 130 | **Dean** | `doc_unit` |
>   | 149 | **Activity Application Reviewer** | `act_app_reviewer` |
>
>   舊版本文件曾把 149 標為「Dean」，這是錯的。149 的正式名稱是 `Activity Application Reviewer`，是活動申請非 NSOA 分支的審批候選角色；真正名為 `Dean` 的是 130。
> - 「Supervisor」（116）是活動審批中由 Coordinator 指定、多人並行審核的角色；自 2026-09 起亦是學生組織註冊的並行審核角色（見 §1.15）。
> - 「Checker」（142）原名「Activity Application Checker」，2026-09-28 起改為「Checker」，同時負責活動申請、活動報告、出席變更及學生組織註冊的初審。
> - 2026-05 起 Coordinator（115）曾按當時 149 的選單補齊「待辦／審核中心／事件查詢」等流程入口；2026-06 全面重整後此繼承關係是否仍完全成立，請以實際查詢為準。

---

### 1.1 首页 / Home / 首頁

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 首页 | 首頁 | Home | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 1.2 仪表盘 / Dashboard / 儀表板

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 仪表盘 | 儀表板 | Dashboard | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 控制台 | └ 控制台 | └ Console | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 1.3 待办事项 / To-do / 待辦事項

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 待办事项 | 待辦事項 | To-do | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 待办事项 | └ 待辦事項 | └ To-do List | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 1.4 事件中心 / Incident Center / 事件中心

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 事件中心 | 事件中心 | Incident Center | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 查询突发事件 | └ 查詢突發事件 | └ Query Incidents | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 突发事件报告 | └ 突發事件報告 | └ Incident Report | | | | | | | | | | | | |
| └ 呈报突发事件 | └ 呈報突發事件 | └ Report Incident | | | | | | | | | ✓ | | ✓ | ✓ |
| └ 事件详情 | └ 事件詳情 | └ Incident Detail | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 提交处理报告 | └ 提交處理報告 | └ Submit Handling Report | | | | ✓ | | ✓ | | | ✓ | ✓ | ✓ | ✓ |
| └ 呈报活动报告 | └ 呈報活動報告 | └ Report Activity Report | | | | ✓ | | | | | | | | |
| └ 查看事件列表 | └ 查看事件列表 | └ View Event List | | | | | ✓ | | | | | | | |

### 1.5 主办中心 / Organiser Center / 主辦中心

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 主办中心 | 主辦中心 | Organiser Center | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 创建活动 | └ 創建活動 | └ Create Activity | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 管理报名 | └ 管理報名 | └ Manage Enrolment | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 管理出席 | └ 管理出席 | └ Manage Attendance | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 提交活动推广 | └ 提交活動推廣 | └ Submit Activity Promotion | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 提交事件报告 | └ 提交事件報告 | └ Submit Incident Report | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 提交活动报告 | └ 提交活動報告 | └ Submit Activity Report | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 管理活动报告 | └ 管理活動報告 | └ Manage Activity Reports **〔新〕** | | | | ✓ | | | | | | | | ✓ |
| └ 管理活动发布 | └ 管理活動發佈 | └ Manage Activity Publish | | | | ✓ | | | | | | | | ✓ |

### 1.6 审核中心 (BPM) / Review Center / 審核中心

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 审核中心 | 審核中心 | Review Center | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 待办总览 | └ 待辦總覽 | └ Todo Overview | | | | | | ✓ | | | ✓ | ✓ | ✓ | ✓ |
| └ 我的待办 | └ 我的待辦 | └ My Todo | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 我的已办 | └ 我的已辦 | └ My Done | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 我的申请 | └ 我的申請 | └ My Applications | | | | | | | | | ✓ | ✓ | ✓ | ✓ |
| └ 工作流管理 | └ 工作流管理 | └ Workflow Management | | | | | | | | | ✓ | ✓ | ✓ | ✓ |

### 1.7 管理中心 / Admin Oversight Center / 管理中心

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 管理中心 | 管理中心 | Admin Oversight Center | | | | | | | | | ✓ | ✓ | ✓ | ✓ |
| └ 数据总览 | └ 數據總覽 | └ Data Overview | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 查阅培训记录 | └ 查閱培訓記錄 | └ View Training Records | | | | | | | | | ✓ | ✓ | ✓ | ✓ |
| └ 查阅组织清单 | └ 查閱組織清單 | └ View Organisation List | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 查阅活动清单 | └ 查閱活動清單 | └ View Activity List | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 查阅事件报告 | └ 查閱事件報告 | └ View Incident Reports | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 新生迎新申请期管理 | └ 新生迎新申請期管理 | └ Orientation Application Period Management | | | | | | | | | | ✓ | | ✓ |
| └ 查看出席 | └ 查看出席 | └ Attendance Records **〔更新〕** | | | | | | | | | ✓ | | | |
| └ 管理报名 | └ 管理報名 | └ Manage Enrolment | | | | | | | | | | | | |
| └ 管理推广可见性 | └ 管理推廣可見性 | └ Manage Promotion Visibility | | | | | | | | | | ✓ | | |
| └ 查阅黑名单 | └ 查閱黑名單 | └ View Blacklist | | | | | | | | | | ✓ | | |
| └ 审批人管理 | └ 審批人管理 | └ Reviewer Management **〔更新〕**¹ | | | | | | | | | | ✓ | | ✓ |
| └ 组织类别申请期 | └ 組織類別申請期 | └ Group Type Application Period **〔新〕** | | | | | | | | | | ✓ | | ✓ |
| └ 续期验证码 | └ 續期驗證碼 | └ Renew Verification Codes **〔新〕** | | | | | | | | | | ✓ | | ✓ |
| └ 评审小组成员 | └ 評審小組成員 | └ Review Group Members **〔新〕**¹ | | | | | | | | | | ✓ | | ✓ |

> ¹ 表格以外的角色：「審批人管理」另授予 Registration Administrator（122）；「評審小組成員」另授予 Registration Administrator（122）與 Appeal Group Secretary（153）。兩者亦因此可見「管理中心」目錄。詳見 §1.15。

### 1.8 用户管理 / User Management / 用戶管理

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 用户管理 | 用戶管理 | User Management | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 账户管理 | └ 帳戶管理 | └ Account Management | | | | | | | | | | | ✓ | ✓ |
| └ 部门管理 | └ 部門管理 | └ Department Management | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 角色管理 | └ 角色管理 | └ Role Management | | | | | | | | | | | ✓ | ✓ |
| └ 审核设置 | └ 審核設定 | └ Review Settings | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 岗位管理 | └ 崗位管理 | └ Post Management | | | | | | | | | | | ✓ | ✓ |

### 1.9 系统管理 / System Management / 系統管理

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 系统管理 | 系統管理 | System Management | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 系统设置 | └ 系統設定 | └ System Settings | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 通知模板 | └ 通知模板 | └ Notification Template | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 邮箱配置 | └ 郵箱配置 | └ Mailbox Config | | | | | | | | | | | | ✓ |
| └ 邮件记录 | └ 郵件記錄 | └ Mail Log | | | | | | | | | | | | ✓ |
| └ 操作日志 | └ 操作日誌 | └ Operation Log | | | | | | | | | | | ✓ | ✓ |
| └ 登录日志 | └ 登入日誌 | └ Login Log | | | | | | | | | | | ✓ | ✓ |
| └ 菜单管理 | └ 選單管理 | └ Menu Management | | | | | | | | | | | ✓ | ✓ |
| └ 字典管理 | └ 字典管理 | └ Dictionary Management | | | | | | | | | | | | ✓ |
| └ 通知设置 | └ 通知設定 | └ Notification Settings | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 审计日志 | └ 審計日誌 | └ Audit Log | | | | | | | | | | | | ✓ |
| └ OAuth 2.0 | └ OAuth 2.0 | └ OAuth 2.0 | | | | | | | | | | | | ✓ |
| └ └ 应用管理 | └ └ 應用管理 | └ └ Application Management | | | | | | | | | | | | ✓ |
| └ └ 令牌管理 | └ └ 令牌管理 | └ └ Token Management | | | | | | | | | | | | ✓ |

### 1.10 废弃 / Deprecated / 廢棄

> ⚠️ 這些選單已被流程（BPM）待辦取代，但仍綁定在多個角色上，建議清理。廢棄角色與選單不再維護。
> Legacy menus replaced by BPM workflow but still bound to roles — cleanup candidates. Deprecated roles are no longer maintained.

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 废弃 | 廢棄 | Deprecated | | ✓ | | | | ✓ | | | ✓ | ✓ | ✓ | ✓ |
| └ 主办组织审核 | └ 主辦組織審核 | └ Organiser Group Review | | | | | | | | | ✓ | ✓ | ✓ | ✓ |
| └ 活动发布审核 | └ 活動發佈審核 | └ Activity Publish Review | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 活动审核详情 | └ 活動審核詳情 | └ Activity Review Detail | | | | | | | | | ✓ | ✓ | ✓ | ✓ |
| └ 活动报名审核 | └ 活動報名審核 | └ Activity Enrolment Review | | | | | | | | | ✓ | ✓ | ✓ | ✓ |
| └ 事件报告审核 | └ 事件報告審核 | └ Incident Report Review | | ✓ | | | | ✓ | | | ✓ | ✓ | ✓ | ✓ |
| └ 审核设置 | └ 審核設定 | └ Review Settings | | | | | | | | | ✓ | ✓ | ✓ | ✓ |
| └ 活动出席审核 | └ 活動出席審核 | └ Activity Attendance Review | | | | | | | | | ✓ | ✓ | ✓ | ✓ |
| └ 活动推广审核 | └ 活動推廣審核 | └ Activity Promotion Review | | | | | | | | | ✓ | ✓ | ✓ | ✓ |

### 1.11 个人中心 / For You / 個人中心

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 个人中心 | 個人中心 | For You | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 通知及提醒 | └ 通知及提醒 | └ Notifications | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 我的社团 | └ 我的社團 | └ My Group **〔更新〕**² | | ✓ | | ✓ | | | | | | | ✓ | ✓ |
| └ 我的资料 | └ 我的資料 | └ My Info | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 我的培训状态 | └ 我的培訓狀態 | └ My Training Status | | ✓ | ✓ | ✓ | | | | | | | | ✓ |
| └ 我的组织 | └ 我的組織 | └ My Organisations | | ✓ | ✓ | ✓ | | | | | | | | ✓ |
| └ 我的活动 | └ 我的活動 | └ My Activities | | ✓ | ✓ | ✓ | | | | | | | | ✓ |
| └ 喜欢的活动 | └ 喜歡的活動 | └ Liked Activities | | ✓ | ✓ | ✓ | | | | | | | | ✓ |

> ² 「我的社團」曾於 2026-06 被設為不在側欄顯示，2026-09-14 起恢復顯示（授權角色不變：Student、Group Leader）。學生組織的註冊申請、續期申請均由此頁進入。

### 1.12 关于 SLAS / About SLAS / 關於 SLAS

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 关于 SLAS | 關於 SLAS | About SLAS | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 联系我们 | └ 聯繫我們 | └ Contact Us | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 如何举办活动 | └ 如何舉辦活動 | └ How to Create Activities | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 如何参与活动 | └ 如何參與活動 | └ How to Join Activities | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 如何管理活动 | └ 如何管理活動 | └ How to Manage Activities | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 隐私政策 | └ 私隱政策 | └ Privacy Policy | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 服务条款 | └ 服務條款 | └ Terms of Service | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 1.13 基础设施 / Infrastructure / 基礎設施

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 基础设施 | 基礎設施 | Infrastructure | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 代码生成 | └ 程式碼生成 | └ Code Generation | | | | | | | | | | | ✓ | ✓ |
| └ 数据源配置 | └ 數據源配置 | └ Data Source Config | | | | | | | | | | | ✓ | ✓ |
| └ 表单构建 | └ 表單構建 | └ Form Builder | | | | | | | | | | | ✓ | ✓ |
| └ API 接口 | └ API 接口 | └ API Interface | | | | | | | | | | | ✓ | ✓ |
| └ API 日志 | └ API 日誌 | └ API Log | | | | | | | | | | | ✓ | ✓ |
| └ 文件管理 | └ 文件管理 | └ File Management | | | | | | | | | | | ✓ | ✓ |
| └ └ 文件配置 | └ └ 文件配置 | └ └ File Config | | | | | | | | | | | ✓ | ✓ |
| └ └ 文件列表 | └ └ 文件列表 | └ └ File List | | | | | | | | | | | ✓ | ✓ |
| └ 定时任务 | └ 定時任務 | └ Scheduled Tasks | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 配置管理 | └ 配置管理 | └ Config Management | | | | | | | | | | | ✓ | ✓ |
| └ 监控中心 | └ 監控中心 | └ Monitor Center | | | | | | | | | | | ✓ | ✓ |
| └ └ MySQL 监控 | └ └ MySQL 監控 | └ └ MySQL Monitor | | | | | | | | | | | ✓ | ✓ |
| └ └ Redis 监控 | └ └ Redis 監控 | └ └ Redis Monitor | | | | | | | | | | | ✓ | ✓ |
| └ └ Java 监控 | └ └ Java 監控 | └ └ Java Monitor | | | | | | | | | | | ✓ | ✓ |
| └ └ 链路追踪 | └ └ 鏈路追蹤 | └ └ Tracing | | | | | | | | | | | ✓ | ✓ |
| └ └ 访问日志 | └ └ 訪問日誌 | └ └ Access Log | | | | | | | | | | | ✓ | ✓ |
| └ └ 错误日志 | └ └ 錯誤日誌 | └ └ Error Log | | | | | | | | | | | ✓ | ✓ |

### 1.14 BPM 工作流 / BPM Workflow / BPM 工作流

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Activity Application Reviewer | Supervisor | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| BPM 工作流 | BPM 工作流 | BPM Workflow | | | | | | | | | | | | ✓ |
| └ 手动部署管理 | └ 手動部署管理 | └ Manual Deployment | | | | | | | | | | | | ✓ |
| └ 工作流管理 | └ 工作流管理 | └ Workflow Management | | | | | | | | | | | | ✓ |
| └ └ 流程状态跟踪 | └ └ 流程狀態追蹤 | └ └ Process Status Tracking | | | | | | | | | | | | ✓ |
| └ └ 待办任务 | └ └ 待辦任務 | └ └ Pending Tasks | | | | | | | | | | | | ✓ |


---

### 1.15 學生組織註冊／續期／申訴流程角色（2026-09 修訂版）

> 學生組織流程的處理權主要由流程指派決定（誰收到待辦就由誰處理），選單只決定能否進入相關管理頁。下表按 2026-09-28 修訂後的流程整理；續期申請沿用註冊流程。

**註冊（含續期）**

| 順序 | 環節 | 處理角色（正式名稱，ID） | 功能別名 | 說明 |
|---:|---|---|---|---|
| ① | 秘書檢查 | Registration Administrator（122） | Review Group Secretary／評審小組秘書 | 通過時須指定一名或多名 Checker 及 Supervisor；亦可退回申請人 |
| ② | 初審 | Checker（142） | — | 由秘書指定，可多人並行；全部通過才進入下一步，任何一人退回即結束本輪 |
| ③ | 活動指導審核 | Supervisor（116） | 活動指導 | 由秘書指定，可多人並行，規則同上。**取代舊流程的 Registration Referrer（132）** |
| ④ | 設定傳閱期 | Registration Administrator（122） | 評審小組秘書 | — |
| ⑤ | 評審意見 | Registration Reviewer（123） | 評審小組成員 | 傳閱期內提交意見；秘書可發回重新收集（另起一輪） |
| ⑥ | 秘書審閱 | Registration Administrator（122） | 評審小組秘書 | 草擬批准條件、跟進事項或拒絕／退回理由；可補充秘書意見 |
| ⑦ | 主席決定 | Registration Endorser（138） | Review Group Chairperson／評審小組主席 | 秘書提交後主席待辦才解鎖；可退回秘書或退回申請人 |
| ⑧ | 最終審批 | Registration Approver（124）或 Registration Approver Delegate（134） | DSA／ADSA | 兩者決定權相同，任一人處理即可；可批准、拒絕或退回主席 |
| ⑨ | 主席覆議 | Registration Endorser（138） | 評審小組主席 | 僅在最終審批退回主席時出現 |

**申訴**

| 順序 | 環節 | 處理角色（正式名稱，ID） | 功能別名 | 說明 |
|---:|---|---|---|---|
| ① | 秘書檢查 | **Appeal Group Secretary（153）〔新〕** | 申訴小組秘書 | 通過時設定傳閱期 |
| ② | 評審意見 | Registration Appeal Reviewer（125） | 申訴小組成員 | — |
| ③ | 秘書審閱 | Appeal Group Secretary（153） | 申訴小組秘書 | 原由 Registration Appeal Endorser（139）兼任，2026-09-28 起移交 153 |
| ④ | 主席決定 | Registration Appeal Endorser（139） | Appeal Group Chairperson／申訴小組主席 | — |
| ⑤ | 最終審批 | Registration Appeal Approver（126）或角色 135 | DSA／ADSA | 兩者決定權相同；可批准或拒絕，退回時只可退回主席（不可直接退回申請人） |
| ⑥ | 主席覆議 | Registration Appeal Endorser（139） | 申訴小組主席 | — |

**管理頁授權**

| 選單 | 權限標識 | 授權角色 |
|---|---|---|
| 管理中心 > 審批人管理（更換未完成的 Checker／Supervisor 等） | `stugroup:reviewer-management:manage` | SAO Administrator、Registration Administrator（122）、SuperAdmin - Dev |
| 管理中心 > 評審小組成員（維護評審小組／申訴小組成員） | `stugroup:review-group:manage` | SAO Administrator、Registration Administrator（122）、Appeal Group Secretary（153）、SuperAdmin - Dev |
| 管理中心 > 續期驗證碼（簽發／撤銷驗證碼） | `stugroup:renew-code:manage` | SAO Administrator、SuperAdmin - Dev |
| 同上頁：設定組織狀態（停用、恢復、解散） | `stugroup:group-standing:update` | SAO Administrator、SuperAdmin - Dev |
| 管理中心 > 組織類別申請期（每個組織類別的新註冊申請起訖日） | `stugroup:group-type:query／create／update／delete` | SAO Administrator、SuperAdmin - Dev |
| 個人中心 > 我的社團（提交註冊、續期申請） | — | Student、Group Leader |

> 註：
> - **角色 135 的名稱與代碼待統一**：系統中 135 的正式名稱為「Registration Appeal Administrator」（代碼 `sg_app_admin`），流程設計文件則稱之為「Appeal Approver Delegate」（代碼 `sg_app_approver_secretary`）。流程按角色 **ID 135** 指派最終審批，所以功能不受影響；但在「角色管理」中按名稱或代碼查找時請留意。
> - Registration Referrer（132）與 Registration Checker（136）只用於修訂前已啟動、仍按舊版流程運行的個案。
> - 組織類別申請期只限制**新註冊**及其退回後的重新提交；續期申請不受此限。

---

### 1.16 速讀 / Quick Reading

- 共通選單（首頁／個人中心／關於 SLAS）所有 12 個角色都能進入。
- **Group Leader（`sg_leader`）** 是唯一進入「主辦中心」的真正業務角色——12 列中只有 Group Leader、System Admin (OCIO) 與 SuperAdmin - Dev 有 ✓。
- 「廢棄」一欄的舊審核選單仍綁定在多個角色上（包括 Student 可見「事件報告審核」），屬待清理項目。
- **Activity Application Reviewer（149）** 在表中看起來很「窄」：除通用選單外，只在待辦／事件中心／審核中心見到 ✓——因為它是流程角色，真正的批准動作發生在流程待辦，與選單可見性無關。
- **System Admin (OCIO)** 與 **SuperAdmin - Dev** 大致相同，差別在流程引擎管理及部分系統配置（OAuth／字典／郵件）。
- 2026-09 起，學生組織相關的管理頁（審批人管理、評審小組成員、續期驗證碼、組織類別申請期）集中在「管理中心」，主要由 SAO Administrator 使用；評審小組秘書（122）與申訴小組秘書（153）只獲其職責所需的頁面。
- All 12 roles share the common menus (Home / For You / About).
- **Group Leader (`sg_leader`) is the sole real business user of the Organiser Center.**
- **Activity Application Reviewer (149)** has a narrow row because approval happens through workflow tasks, not menu visibility.
- Since 2026-09 the student-organisation admin pages (Reviewer Management, Review Group Members, Renew Verification Codes, Group Type Application Period) live under the Admin Oversight Center.

---

## 2. 操作權限（按鈕層級）

> §1 只涵蓋目錄與選單頁。頁面內的個別操作由「權限標識」控制（例如 `activity:report:submit`），可在「選單管理」中查看、在「角色管理」中分配。本節列出與活動、出席及學生組織流程相關的現行設定。

### 2.1 審批類操作：不以權限標識把關，改按流程指派核對

以下操作**不檢查權限標識**；系統在處理時核對「目前使用者是否為該待辦的處理人或候選人」：

| 範圍 | 操作 | 說明 |
|---|---|---|
| 活動申請審批 | Supervisor 審核、IRG／VPSLA 各環節（分組、評審、摘要、共識檢查、秘書決定）、主席決定、嘉賓審批、Dean 綜合審批 | 能否處理取決於流程指派，與角色是否勾選相關權限無關 |
| 活動申請審批（唯讀） | 查看審批摘要、投票記錄、AI 摘要 | 持有 `activity:approval:query` 或 `activity:approval:ai-summary` 者可查看全部；其餘使用者只可查看自己正在處理或曾經參與的流程 |
| 系統設定 | 新生迎新申請期、角色代理、單位 Coordinator 的新增／修改／刪除 | 只要能進入頁面即可操作；實際存取依靠「不開放選單」來限制 |

> 背景：2026-04 曾為審批類操作一次性加上權限檢查，但相關角色的權限資料未同步到 UAT／PROD，導致流程被拒絕存取而中斷。因此改為按流程指派核對，不再依賴權限資料。

### 2.2 受權限標識控制的操作（現行）

| 權限標識 | 用途 | 授權角色 |
|---|---|---|
| `activity:report:query` | 查看活動報告（亦是「主辦中心 > 管理活動報告」選單的進入條件） | Group Leader、Student、Coordinator、Checker、Supervisor、VPSLA Secretary、VPSLA Member、Activity Application Reviewer、Delegate |
| `activity:report:create`／`update` | 建立、修改活動報告 | Group Leader |
| `activity:report:submit` | 提交活動報告（送 OC 聯署） | Group Leader、Student |
| `activity:report:approve` | 處理活動報告審批待辦 | Coordinator、Checker、Supervisor、VPSLA Secretary、VPSLA Member、Activity Application Reviewer、Delegate |
| `activity:attendance:change:query`／`create`／`submit` **〔新〕** | 查看、建立、提交出席變更申請；其中 `submit` 用於撤回已提交的申請 | Student、Group Leader、Coordinator、Supervisor、SuperAdmin - Dev |
| `activity:attendance:change:approve` **〔新〕** | 出席變更審批：Checker 檢查、Supervisor 推薦 | Checker、Supervisor、SuperAdmin - Dev（Checker 另獲 `query`） |
| `stugroup:reviewer-management:manage` **〔新〕** | 審批人管理 | 見 §1.15 |
| `stugroup:review-group:manage` **〔新〕** | 評審小組／申訴小組成員維護 | 見 §1.15 |
| `stugroup:renew-code:manage` **〔新〕** | 簽發、撤銷續期驗證碼 | SAO Administrator、SuperAdmin - Dev |
| `stugroup:group-standing:update` **〔新〕** | 設定組織狀態（停用、恢復、解散） | SAO Administrator、SuperAdmin - Dev |
| `stugroup:group-type:query`／`create`／`update`／`delete` **〔新〕** | 組織類別申請期 | SAO Administrator、SuperAdmin - Dev |

> 註：
> - 活動報告除權限標識外，系統亦按「是否為該活動的建立人或籌委（OC）成員」核對可否查看及提交；審批則按流程指派核對。
> - 出席變更申請的**建立、提交與查看**目前只要求已登入，申請資格由系統按業務規則另行核對；`query`／`create` 兩個權限標識主要供選單管理使用。實際以權限標識把關的是「Checker 檢查」「Supervisor 推薦」（`approve`）與「撤回已提交申請」（`submit`）。
> - 上述權限若部署到新環境時未一併建立權限資料，對應操作會被拒絕存取；部署後請以 §1 的查詢核對。

---

## 3. 資料範圍 / Data Scope（第三個維度）

> §1 與 §2 只回答「**能不能進這個頁面／做這個操作**」，回答不了「**進去之後看得見哪些資料**」——這是獨立的第三個維度，由角色的「資料範圍」設定與系統的業務過濾共同決定。同一個選單，兩個角色都有 `✓`，看到的筆數可以完全不同。

### 3.1 兩條並行的過濾方式

| 方式 | 機制 | 典型角色 |
|---|---|---|
| **部門維度** | 按角色的資料範圍設定，以部門集合過濾 | Coordinator、Dean、Head、Activity Application Reviewer、Delegate |
| **關係維度** | 按「分派給本人」等業務關係過濾；關係解析不出時一律返回空結果（寧缺勿濫） | Checker、EO Venue Reviewer、Group Leader |

兩種方式會**疊加**。因此走關係維度的角色，其資料範圍必須設為「全部」：否則部門條件會再收窄一層，把分派給本人、但不屬本人部門的活動過濾掉。2026-06-30 把 Checker（142）改回「全部」正是為此。

### 3.2 資料範圍取值與部門來源

| 資料範圍 | 含義 | 部門集合如何計算 |
|---:|---|---|
| `1` | 全部 | 不按部門過濾 |
| `2` | 自定義部門 | 見下 |

資料範圍為 `2` 時，部門集合有**兩個可能的來源**，這是最容易混淆的地方：

1. **使用者級範圍（每人一份）**——在「角色分配」時為該使用者指定的根部門，例如 `[10402,10403]`。系統會自動把每個根部門**連同其全部下級單位**展開。用於「每人負責不同院系」的角色（115／149／150）。
2. **角色級留空**——此時採用預設行為，返回**本人所屬部門及其下級單位**。用於「一律只看本院系」的角色（Dean 130、Head 148）。

> **注意：使用者級範圍留空 ≠ 本院系全部。** 若某使用者的使用者級範圍為空，系統只會加入該使用者**自己的部門、不含下級單位**，下級單位的資料會全部遺漏。2026-06-30 已為存量使用者回填「範圍 = 本人部門」；今後新分配的自定義部門角色亦會自動填入同樣的預設值。兩者都**只在為空時填入**，不會覆蓋管理員的明確選擇。
>
> **前置條件**：回填只對**有所屬部門**的使用者生效。所屬部門為空的使用者會被略過，須先補正部門。

### 3.3 已知角色的資料範圍

| ID | 角色 | 資料範圍 | 實際可見範圍 | 調整日期 |
|---:|---|:---:|---|---|
| 115 | Coordinator | 2 | 使用者級範圍指定的院系及下級單位 | 2026-06-26／06-30 |
| 129 | Dean of Students | 1 | 全部 | — |
| 130 | Dean | 2（角色級留空） | 本人院系及下級單位 | — |
| 141 | EO Venue Reviewer | 1 | 全部（再按業務關係收窄） | 2026-06-30 |
| 142 | Checker | 1 | 全部（再收窄為**分派給本人**的個案） | 2026-06-30 |
| 148 | Head | 2（角色級留空） | 本人院系及下級單位 | 2026-07-03（此前為「全部」） |
| 149 | Activity Application Reviewer | 2 | 使用者級範圍指定的院系及下級單位 | 2026-06-26／06-30 |
| 150 | Delegate | 2 | 同上 | 2026-06-26／06-30 |
| 153 | Appeal Group Secretary | 1 | 全部（處理權由流程指派決定） | 2026-09-28 |

驗證語句：

```sql
-- 角色級
SELECT id, name, code, data_scope, data_scope_dept_ids
FROM   SLAS.SYSTEM_ROLE WHERE deleted = 0 ORDER BY id;

-- 使用者級（自定義部門角色才需要）
SELECT ur.user_id, ur.role_id, ur.scope, u.dept_id
FROM   SLAS.SYSTEM_USER_ROLE ur
JOIN   SLAS.SYSTEM_USERS u ON u.id = ur.user_id
WHERE  ur.role_id IN (115,149,150);
```

### 3.4 排查「某角色看不到／看得太多」的順序

1. 選單進得去嗎？→ §1（以實際查詢為準）
2. 操作有沒有權限標識把關？→ §2
3. 角色的資料範圍是 1 還是 2？
4. 若是 2：使用者級範圍填了嗎？該使用者有所屬部門嗎？
5. 該列表是否按業務關係過濾？——這類頁面「看到空白」往往不是權限被拒，而是關係解析不出來。

> 活動列表、事件列表、培訓三個模組的資料範圍口徑仍在演進（例如 Coordinator 按自定義範圍、Supervisor 按所督導的活動、SAO 看全部，均**與本人所屬部門無關**）。涉及具體業務口徑時，請以對應模組的專項文件與最新實現為準，不要只按本節的框架規則推斷。

— 完 —
