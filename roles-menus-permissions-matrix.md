# SLAS Roles × Menus × Permissions Matrix

> 数据源 / Source / 數據源：DEV (Oracle 19c, schema=`SLAS`) — 2026-05-07
> 范围 / Scope / 範圍：`SYSTEM_ROLE.STATUS=0 AND DELETED=0` 共 41 个活跃角色；`SYSTEM_MENU` 共 312 节点（14 目录 / 96 菜单 / 202 按钮）。
> **角色名权威源 / Role-name source of truth**：DB **`SYSTEM_ROLE.NAME`**，与 [`activity-publish-workflow-design.md §2.1`](./activity-publish-workflow-design.md) 及 [`student-org-end-to-end-demo-guide.md §2`](./student-org-end-to-end-demo-guide.md) 对齐。文中如有 `code` 引用（如 `sg_leader`、`supervisor`），仅作技术对照；显示名一律使用 `SYSTEM_ROLE.NAME`。
> 菜单名三语来源 / Menu i18n source：`SLAS_UI/src/language/locales/{en,zh-CN,zh-hk}/menus.json`。

---

## 10. 菜单 × 角色 详细矩阵（三语）/ Menu × Role Detailed Matrix (Trilingual)

> 视图说明：纵向 = 每一个菜单节点（仅 `TYPE∈{1,2}`，即目录与菜单页，不含按钮），横向 = 12 个代表性角色。
> 单元格 `✓` 表示该角色被授权访问该菜单（来自 `SYSTEM_ROLE_MENU`），空白表示未授权。
> 列头一律采用 DB **`SYSTEM_ROLE.NAME`** 权威名。
> Vertical = menu nodes (`TYPE∈{1,2}`, directories & pages only). Horizontal = 12 representative roles. `✓` = role bound to menu. Column headers use canonical `SYSTEM_ROLE.NAME`.

**列头说明 / Column legend**（列头使用完整 `SYSTEM_ROLE.NAME` 权威名）

| 列头 / Column | code | ID |
|---|---|---:|
| Staff | `staff` | 4 |
| Student | `student` | 112 |
| Guest | `guest` | 3 |
| Group Leader | `sg_leader` | 114 |
| Coordinator | `coordinator` | 115 |
| Incident Level Classifier | `lv_classifier` | 128 |
| Dean of Students | `do_student_admin` | 129 |
| Dean | `dean` | 149 |
| Activity Application Referrer | `supervisor` | 116 |
| SAO Administrator | `sao_admin` | 120 |
| System Admin (OCIO) | `ocio_admin` | 121 |
| SuperAdmin - Dev | `super_admin` | 1 |

> 注 / Note：
> - 「Dean」(id=149) 是活动发布工作流中的院长角色，与「Dean of Students」(id=129) **是两个不同角色**，不要混淆。
> - 「Activity Application Referrer」即代码 `code=supervisor`，业内常称 "Supervisor"，本文统一用权威名。

---

### 10.1 首页 / Home / 首頁

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 首页 | 首頁 | Home | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 10.2 仪表盘 / Dashboard / 儀表板

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 仪表盘 | 儀表板 | Dashboard | | | | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 控制台 | └ 控制台 | └ Console | | | | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 10.3 待办事项 / To-do / 待辦事項

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 待办事项 | 待辦事項 | To-do | | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 待办事项 | └ 待辦事項 | └ To-do List | | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 10.4 事件中心 / Incident Center / 事件中心

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 事件中心 | 事件中心 | Incident Center | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 查询突发事件 | └ 查詢突發事件 | └ Query Incidents | | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 突发事件报告 | └ 突發事件報告 | └ Incident Report | | | | | | | | | | | | |
| └ 呈报突发事件 | └ 呈報突發事件 | └ Report Incident | | | | | | | | | ✓ | | ✓ | ✓ |
| └ 事件详情 | └ 事件詳情 | └ Incident Detail | | | | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 提交处理报告 | └ 提交處理報告 | └ Submit Handling Report | | | | ✓ | | ✓ | | | ✓ | ✓ | ✓ | ✓ |
| └ 呈报活动报告 | └ 呈報活動報告 | └ Report Activity Report | | | | ✓ | | | | | | | | |
| └ 查看事件列表 | └ 查看事件列表 | └ View Event List | | | | | ✓ | | | | | | | |

### 10.5 主办中心 / Organiser Center / 主辦中心

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 主办中心 | 主辦中心 | Organiser Center | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 创建活动 | └ 創建活動 | └ Create Activity | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 管理报名 | └ 管理報名 | └ Manage Enrolment | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 管理出席 | └ 管理出席 | └ Manage Attendance | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 提交活动推广 | └ 提交活動推廣 | └ Submit Activity Promotion | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 提交事件报告 | └ 提交事件報告 | └ Submit Incident Report | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 提交活动报告 | └ 提交活動報告 | └ Submit Activity Report | | | | ✓ | | | | | | | ✓ | ✓ |
| └ 管理活动发布 | └ 管理活動發佈 | └ Manage Activity Publish | | | | ✓ | | | | | | | | ✓ |

### 10.6 审核中心 (BPM) / Review Center / 審核中心

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 审核中心 | 審核中心 | Review Center | | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 待办总览 | └ 待辦總覽 | └ Todo Overview | | | | | | ✓ | | | ✓ | ✓ | ✓ | ✓ |
| └ 我的待办 | └ 我的待辦 | └ My Todo | | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 我的已办 | └ 我的已辦 | └ My Done | | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 我的申请 | └ 我的申請 | └ My Applications | | | | | | | | | ✓ | ✓ | ✓ | ✓ |
| └ 工作流管理 | └ 工作流管理 | └ Workflow Management | | | | | | | | | ✓ | ✓ | ✓ | ✓ |

### 10.7 管理中心 / Admin Oversight Center / 管理中心

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 管理中心 | 管理中心 | Admin Oversight Center | | | | | | | | | ✓ | ✓ | ✓ | ✓ |
| └ 数据总览 | └ 數據總覽 | └ Data Overview | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 查阅培训记录 | └ 查閱培訓記錄 | └ View Training Records | | | | | | | | | ✓ | ✓ | ✓ | ✓ |
| └ 查阅组织清单 | └ 查閱組織清單 | └ View Organisation List | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 查阅活动清单 | └ 查閱活動清單 | └ View Activity List | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 查阅事件报告 | └ 查閱事件報告 | └ View Incident Reports | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 管理出席 | └ 管理出席 | └ Manage Attendance | | | | | | | | | ✓ | | | |
| └ 管理报名 | └ 管理報名 | └ Manage Enrolment | | | | | | | | | | | | |
| └ 管理推广可见性 | └ 管理推廣可見性 | └ Manage Promotion Visibility | | | | | | | | | | ✓ | | |
| └ 查阅黑名单 | └ 查閱黑名單 | └ View Blacklist | | | | | | | | | | ✓ | | |
| └ Reviewer Management | └ Reviewer Management | └ Reviewer Management | | | | | | | | | | | | |

### 10.8 用户管理 / User Management / 用戶管理

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 用户管理 | 用戶管理 | User Management | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 账户管理 | └ 帳戶管理 | └ Account Management | | | | | | | | | | | ✓ | ✓ |
| └ 部门管理 | └ 部門管理 | └ Department Management | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 角色管理 | └ 角色管理 | └ Role Management | | | | | | | | | | | ✓ | ✓ |
| └ 审核设置 | └ 審核設定 | └ Review Settings | | | | | | | | | | ✓ | ✓ | ✓ |
| └ 岗位管理 | └ 崗位管理 | └ Post Management | | | | | | | | | | | ✓ | ✓ |

### 10.9 系统管理 / System Management / 系統管理

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
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

### 10.10 废弃 / Deprecated / 廢棄

> ⚠️ 这些菜单已被 BPM 工作流取代，但仍绑定在多个角色上，建议清理。废弃角色与菜单不再维护。
> Legacy menus replaced by BPM workflow but still bound to roles — cleanup candidates. Deprecated roles are no longer maintained.

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
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

### 10.11 个人中心 / For You / 個人中心

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 个人中心 | 個人中心 | For You | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 通知及提醒 | └ 通知及提醒 | └ Notifications | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 我的社团 | └ 我的社團 | └ My Group | | ✓ | | ✓ | | | | | | | ✓ | ✓ |
| └ 我的资料 | └ 我的資料 | └ My Info | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 我的培训状态 | └ 我的培訓狀態 | └ My Training Status | | ✓ | ✓ | ✓ | | | | | | | | ✓ |
| └ 我的组织 | └ 我的組織 | └ My Organisations | | ✓ | ✓ | ✓ | | | | | | | | ✓ |
| └ 我的活动 | └ 我的活動 | └ My Activities | | ✓ | ✓ | ✓ | | | | | | | | ✓ |
| └ 喜欢的活动 | └ 喜歡的活動 | └ Liked Activities | | ✓ | ✓ | ✓ | | | | | | | | ✓ |

### 10.12 关于 SLAS / About SLAS / 關於 SLAS

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 关于 SLAS | 關於 SLAS | About SLAS | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 联系我们 | └ 聯繫我們 | └ Contact Us | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 如何举办活动 | └ 如何舉辦活動 | └ How to Create Activities | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 如何参与活动 | └ 如何參與活動 | └ How to Join Activities | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 如何管理活动 | └ 如何管理活動 | └ How to Manage Activities | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 隐私政策 | └ 私隱政策 | └ Privacy Policy | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| └ 服务条款 | └ 服務條款 | └ Terms of Service | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 10.13 基础设施 / Infrastructure / 基礎設施

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
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

### 10.14 BPM 工作流 / BPM Workflow / BPM 工作流

| 菜单（SC） | 菜單（TC） | Menu (EN) | Staff | Student | Guest | Group Leader | Coordinator | Incident Level Classifier | Dean of Students | Dean | Activity Application Referrer | SAO Administrator | System Admin (OCIO) | SuperAdmin - Dev |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| BPM 工作流 | BPM 工作流 | BPM Workflow | | | | | | | | | | | | ✓ |
| └ 手动部署管理 | └ 手動部署管理 | └ Manual Deployment | | | | | | | | | | | | ✓ |
| └ 工作流管理 | └ 工作流管理 | └ Workflow Management | | | | | | | | | | | | ✓ |
| └ └ 流程状态跟踪 | └ └ 流程狀態追蹤 | └ └ Process Status Tracking | | | | | | | | | | | | ✓ |
| └ └ 待办任务 | └ └ 待辦任務 | └ └ Pending Tasks | | | | | | | | | | | | ✓ |

---

### 10.15 速读 / Quick Reading

- 共通菜单（首页 / 个人中心 / 关于 SLAS）所有 12 个角色都能访问。
- **Group Leader (`sg_leader`)** 是唯一进入「主办中心」的真正业务角色 — 12 列里只有 Group Leader + System Admin (OCIO) + SuperAdmin - Dev 三个有 ✓。
- 「废弃」一栏在 11 个角色上仍然有 ✓（包括 Student 看到「事件报告审核」），是 dead-code 包袱。
- **Dean (id=149)**（活动发布工作流中的 Dean，与 id=129 `Dean of Students` **不同角色**）在这张表里看起来很"窄"：除了通用菜单外，只在 待办 / 事件中心 / 审核中心 见到 ✓ — 因为它是 BPM 流程角色，真正的"批准"动作发生在 BPM 任务节点（candidate-group 绑定），不依赖菜单可见性。
- **System Admin (OCIO)** ≈ **SuperAdmin - Dev**：除 BPM 工作流引擎管理 + 部分系统配置（OAuth/字典/邮件）外几乎相同。
- All 12 roles share the common menus (Home / For You / About).
- **Group Leader (`sg_leader`) is the sole real user of the Organiser Center** — only 3 of 12 columns show ✓.
- The "Deprecated" group still shows ✓ on 11 roles incl. Student — clear cleanup target.
- **Dean (id=149)** is the activity-publish workflow Dean, **not** `Dean of Students` (id=129) — its narrow row reflects BPM-task-driven approval rather than menu visibility.

— end —
