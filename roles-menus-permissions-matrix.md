# SLAS Roles × Menus × Permissions Matrix

> 数据源 / Source / 數據源：DEV (Oracle 19c, schema=`SLAS`) — 2026-05-07
> 范围 / Scope / 範圍：`SYSTEM_ROLE.STATUS=0 AND DELETED=0` 共 41 个活跃角色；`SYSTEM_MENU` 共 312 节点（14 目录 / 96 菜单 / 202 按钮）。
> **角色名权威源 / Role-name source of truth**：DB **`SYSTEM_ROLE.NAME`**，与 [`activity-publish-workflow-design.md §2.1`](./activity-publish-workflow-design.md) 及 [`student-org-end-to-end-demo-guide.md §2`](./student-org-end-to-end-demo-guide.md) 对齐。文中如有 `code` 引用（如 `sg_leader`、`supervisor`），仅作技术对照；显示名一律使用 `SYSTEM_ROLE.NAME`。
> 菜单名三语来源 / Menu i18n source：`SLAS_UI/src/language/locales/{en,zh-CN,zh-hk}/menus.json`。

---

## 1. 模型说明 / Domain Model / 資料模型

| 表 / Table | 用途 / Purpose / 用途 |
|---|---|
| `SYSTEM_ROLE` | 角色定义（41 个） / Role definitions (41 active) / 角色定義（41 個） |
| `SYSTEM_MENU` | 菜单 + 权限点 / Menu nodes + permission keys / 選單 + 權限點 |
| `SYSTEM_ROLE_MENU` | 角色↔菜单绑定 / Role↔menu bindings / 角色↔選單綁定 |
| `SYSTEM_USER_ROLE` | 用户↔角色绑定 / User↔role bindings / 用戶↔角色綁定 |

**菜单类型 / `MENU.TYPE`**

| TYPE | 说明 | EN | 繁體 |
|---|---|---|---|
| 1 | 目录 | Directory | 目錄 |
| 2 | 菜单 | Menu page | 選單頁 |
| 3 | 按钮（带 PERMISSION key） | Button (with permission key) | 按鈕（帶權限鍵） |

**权限模型 / Permission Model / 權限模型**

```
User → Role(s) → Menu/Button (TYPE=3) → PERMISSION key  ──→  Spring @PreAuthorize("@ss.hasPermission('xxx')")
                                       └─→ also gate Vue routes & UI element visibility
                                       └─→ BPM 流程节点的 candidate-group 也用 ROLE.CODE 直接绑定
```

按钮 (TYPE=3) 的 `PERMISSION` 字段是 Spring `@PreAuthorize` 的真实校验键；目录/菜单 (TYPE=1/2) 主要控制可见性。
Button (TYPE=3) `PERMISSION` is the actual key checked by Spring; directory/menu (TYPE=1/2) only controls visibility.
按鈕 (TYPE=3) `PERMISSION` 才是 Spring 真正校驗的鍵；目錄/選單 (TYPE=1/2) 只控制可見性。

---

## 2. 角色清单 / Roles

> 名称口径：以 DB **`SYSTEM_ROLE.NAME`** 为权威；与 [`activity-publish-workflow-design.md §2.1`](./activity-publish-workflow-design.md) 及 [`student-org-end-to-end-demo-guide.md §2`](./student-org-end-to-end-demo-guide.md) 对齐。
> Naming source of truth: DB `SYSTEM_ROLE.NAME`. Aligned with the canonical role tables in `activity-publish-workflow-design.md §2.1` and `student-org-end-to-end-demo-guide.md §2`.
> "用户数 / Users" 来自 `SYSTEM_USER_ROLE` 实际绑定（DEV）；`data_scope`：1=全部 / 2=本部门 / 3=本部门及下级。

| ID | code | `SYSTEM_ROLE.NAME`（最新角色名 / canonical） | 旧名 / 别名 | 职责简述 | type | scope | 用户数 |
|---:|---|---|---|---|---:|---:|---:|
| 1 | `super_admin` | **SuperAdmin - Dev** | SuperAdmin | 系统全权管理员（含 BPM 引擎部署） | 1 | 1 | 3 |
| 2 | `common` | **Common** | Common Role | 通用基础角色 | 1 | 2 | 46 |
| 3 | `guest` | **Guest** | — | 系统访客 | 1 | 1 | 6 |
| 4 | `staff` | **Staff** | — | 一般员工 | 2 | 1 | 11 |
| 112 | `student` | **Student** | — | 学生 | 3 | 1 | 231 |
| 114 | `sg_leader` | **Group Leader** | OC, 学生组织负责人 | 学生组织发起方；主办中心唯一真正使用者 | 3 | 1 | 62 |
| 115 | `coordinator` | **Coordinator** | — | 活动发布 Phase 1 初审；指派 Checker；BPM `coordinatorGroupId` 候选组 | 1 | 1 | 18 |
| 116 | `supervisor` | **Activity Application Referrer** | Supervisor, 活动指导 | 组织/活动一级审核员；多人并行；BPM `supervisorsReviewTask` 候选 | 3 | 1 | 23 |
| 117 | `approver` | **Approver** | — | 审批员（旧版高权审批角色） | 1 | 3 | 4 |
| 118 | `irg_reviewer` | **IRG Reviewer** | — | 独立审查组审查员（旧版） | 1 | 2 | 4 |
| 119 | `vp_member` | **Vetting Panel Member** | — | 审查小组成员（旧版；与 id=147 共用 code）| 1 | 2 | 4 |
| 120 | `sao_admin` | **SAO Administrator** | — | 学生事务办公室管理员；业务全数据查阅 | 1 | 1 | 8 |
| 121 | `ocio_admin` | **System Admin (OCIO)** | OCIO Admin | 信息技术办公室系统管理员；用户/角色/基础设施 | 1 | 1 | 6 |
| 122 | `sg_reg_secretary` | **Registration Administrator** | Student Group Registration Secretary | 学生组织注册流 Node 1：初审 / 指派 Reviewer | 1 | 1 | 8 |
| 123 | `sg_reg_reviewer` | **Registration Reviewer** | — | 学生组织注册流 Node 4：收集意见（多实例） | 1 | 1 | 7 |
| 124 | `sg_reg_approver` | **Registration Approver** | — | 学生组织注册流 Node 6：最终审批 | 1 | 1 | 7 |
| 125 | `sg_app_reviewer` | **Registration Appeal Reviewer** | — | 注册申诉流 Node 1：收集申诉意见 | 1 | 1 | 5 |
| 126 | `sg_app_approver` | **Registration Appeal Approver** | — | 注册申诉流 Node 3：最终申诉审批 | 1 | 1 | 6 |
| 127 | `act_app_approver` | **Activity Application Approver** | — | 活动申请审批员（旧版） | 1 | 1 | 3 |
| 128 | `lv_classifier` | **Incident Level Classifier** | — | 突发事件级别分类 | 1 | 2 | 4 |
| 129 | `do_student_admin` | **Dean of Students** | — | 学生事务院长；中高级别事件跟进 | 1 | 1 | 5 |
| 130 | `doc_unit` | **Dean of Custodian Unit** | — | 托管单位院长 | 1 | 2 | 5 |
| 131 | `academy_coordinator` | **Academy Coordinator** | — | 学院协调员；事件呈报与跟进 | 1 | 1 | 7 |
| 132 | `sg_reg_checker_academic` | **Registration Referrer** | Student Group Registration Academic Checker | 学生组织注册流 Node 3：学术审核 | 1 | 1 | 8 |
| 134 | `sg_reg_approver_secretary` | **Student Group Registration Approver Secretary** | — | 注册流 Node 6 备选签发人 | 1 | 1 | 4 |
| 135 | `sg_app_approver_secretary` | **Student Group Appeal Approver Secretary** | — | 申诉流 Node 3 备选签发人 | 1 | 1 | 4 |
| 136 | `sg_reg_checker_administrative` | **Registration Checker** | Student Group Registration Administrative Checker | 学生组织注册流 Node 2：行政审核 | 1 | 1 | 10 |
| 138 | `sg_reg_summary_reviewer` | **Registration Endorser** | Student Group Registration Summary Reviewer | 学生组织注册流 Node 5：汇总审核 / 拒绝草拟 | 1 | 1 | 1 |
| 139 | `sg_app_summary_reviewer` | **Registration Appeal Endorser** | — | 申诉流 Node 2：汇总审核 | 1 | 1 | 1 |
| 141 | `estate_office` | **EO Venue Reviewer** | Estate Office | 活动发布：校园公共场地审批（EO） | 2 | 1 | 1 |
| 142 | `activity_checker` | **Activity Application Checker** | Sponsorship Approver（`BpmUserSyncService.java` 硬编码遗留） | 活动发布 Phase 1 ②：由 Coordinator 指派的详细审查 | 2 | 1 | 1 |
| 144 | `irg_secretary` | **IRG Secretary** | — | NSOA：IRG 选组 / 摘要审核 | 2 | 1 | 1 |
| 145 | `irg_member` | **IRG Member** | — | NSOA：IRG 投票 | 2 | 1 | 5 |
| 146 | `vp_secretary` | **VPSLA Secretary** | — | NSOA：VP 选组 / 共识决定 | 2 | 1 | 1 |
| 147 | `vp_member` | **VPSLA Member** | — | NSOA：VP 投票（含 ChairPerson 候选；与 id=119 共用 code） | 2 | 1 | 6 |
| 148 | `head` | **Head** | — | 部门 Head（仍存在但**当前 BPMN 不再放入候选组**；Guest Endorsement / Sponsorship 已统一由 149/150 承担） | 2 | 1 | 1 |
| 149 | `dean` | **Dean** | — | 嘉宾背书 / 赞助 / 活动内容审批（必经） | 2 | 1 | 1 |
| 150 | `delegate` | **Delegate** | — | Dean 的委派人；与 Dean 共候选组 | 2 | 1 | 1 |
| 151 | `vprd` | **VP(RD)** | VPRD（BPMN 注释 / 前端遗留写法） | 最终嘉宾审批 | 2 | 1 | 1 |
| 152 | `vprd_delegate` | **VP(RD) Delegate** | VPRD Delegate | VP(RD) 的委派人 | 2 | 1 | 1 |

> ⚠️ **CODE 重复 / Duplicate `vp_member` code**：id=119 (`Vetting Panel Member`，旧版) 与 id=147 (`VPSLA Member`，新版) 共用 code `vp_member`，`@PreAuthorize("hasRole('vp_member')")` 会同时命中。
> ⚠️ **遗留同步代码风险**：`slas-module-bpm/.../BpmUserSyncService.java` 仍硬编码 `createGroupIfNotExists("142", "Sponsorship Approver", ...)` —— 服务启动用户/群组同步可能把 142 名称从 `Activity Application Checker` 覆写回旧名 `Sponsorship Approver`，详见 `activity-publish-workflow-design.md §2.2 实作备注 #5`。
> ⚠️ **`VP(RD)` 名称口径不统一**：BPMN 注释、前端任务标题、部分变量名仍写 `VPRD / VPRD Delegate`，本文与 DB 一致采用 `VP(RD) / VP(RD) Delegate`。

---

## 3. 顶层模块（菜单根节点）/ Top-level Modules / 頂層模組

> 14 个 `PARENT_ID=0` 节点。"菜单/按钮总数"指该模块及所有后代节点中具体可被绑定到角色的项数。
> 14 root nodes (`PARENT_ID=0`). "Total" counts the module and all descendants.

| ID | 简体 | English | 繁體 | 性质 / Nature / 性質 | 总节点数 |
|---:|---|---|---|---|---:|
| 2999 | 首页 | Home | 首頁 | 通用 / Common | 1 |
| 3002 | 仪表盘 | Dashboard | 儀表板 | 通用 | 2 |
| 3010 | 待办事项 | To-do | 待辦事項 | 工作流 / Workflow | 2 |
| 3007 | 事件中心 | Incident Center | 事件中心 | 业务-事件 / Incident | ~20 |
| 5001 | 审核中心 | Review Center (BPM) | 審核中心 | 工作流 / BPM | ~16 |
| 6500 | BPM 工作流 | BPM Workflow Admin | BPM 工作流 | 平台-BPM 引擎 | ~5 |
| 81 | 主办中心 | Organiser Center | 主辦中心 | 业务-发起 / Organiser | ~40 |
| 51 | 管理中心 | Admin/Oversight Center | 管理中心 | 业务-监管 / Oversight | ~30 |
| 57 | 用户管理 | User Management | 用戶管理 | 平台 / Platform | ~30 |
| 1 | 系统管理 | System Management | 系統管理 | 平台 | ~40 |
| 2 | 基础设施 | Infrastructure | 基礎設施 | 平台 | ~54 |
| 89 | 个人中心 | For You | 個人中心 | 通用 | 8 |
| 21 | 关于 SLAS | About SLAS | 關於 SLAS | 通用 | 7 |
| 3006 | **废弃** | **Deprecated** | **廢棄** | 历史遗留 / Legacy | 9 |

---

## 4. 角色 × 模块 矩阵 / Role × Module Matrix

> 单元格为 `菜单数+按钮数`（`MENU+BTN`，仅取 TYPE∈{1,2,3}）。
> `·` 表示该角色未绑定该模块。`废弃` 仅作健康度提示，是清理候选。
> 第一列以 `code` 列出（DB `SYSTEM_ROLE.CODE`，稳定不变）；对应的 `SYSTEM_ROLE.NAME` 权威名见 §2。
> 共两行 `vp_member`，因 id=119（**Vetting Panel Member**，旧版）与 id=147（**VPSLA Member**，新版）共用同一 `code`，本表用 `(legacy 119)` / `(VPSLA 147)` 标注。

| 角色 (code) | 用户 | 主办 | 审核 | 管理 | 事件 | 待办 | 用户 | 系统 | 基设 | BPM | 废弃 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `super_admin` | 3 | 39 | 15 | 29 | 5 | 2 | 29 | 39 | 54 | 5 | 9 |
| `ocio_admin` | 6 | 38 | 15 | 31 | 5 | 2 | 29 | 12 | 54 | · | 13 |
| `sao_admin` | 8 | · | 15 | 32 | 12 | 2 | 7 | 4 | 9 | · | 13 |
| `sg_leader` | 62 | **40** | · | · | 4 | · | · | · | · | · | · |
| `student` | 231 | · | · | · | · | · | · | · | · | · | 2 |
| `coordinator` | 18 | · | · | · | 2 | · | · | · | · | · | · |
| `academy_coordinator` | 7 | 5 | 6 | 6 | 5 | 2 | · | 4 | · | · | 6 |
| `supervisor` | 23 | · | 15 | 22 | 16 | 2 | · | · | · | · | 11 |
| `act_app_approver` | 3 | 3 | · | 29 | · | · | · | 27 | · | · | 7 |
| `approver` | 4 | · | · | 29 | · | · | · | · | · | · | 8 |
| `lv_classifier` | 4 | · | 13 | · | 11 | 2 | · | · | · | · | 5 |
| `do_student_admin` | 5 | · | 3 | · | 3 | 2 | · | · | · | · | · |
| `doc_unit` | 5 | · | 3 | · | 10 | 2 | · | · | · | · | · |
| `irg_reviewer` (legacy 118) | 4 | 1 | · | 16 | · | 2 | · | · | · | · | 3 |
| `vp_member` (legacy 119, Vetting Panel Member) | 4 | 1 | · | · | · | 2 | · | 4 | · | · | 3 |
| `sg_reg_secretary` | 8 | · | 15 | 2 | · | 2 | · | · | · | · | · |
| `sg_reg_reviewer` | 7 | · | 15 | 2 | · | 2 | · | · | · | · | · |
| `sg_reg_approver` | 7 | · | 15 | 2 | · | 2 | · | · | · | · | · |
| `sg_app_reviewer` | 5 | · | 15 | 2 | · | 2 | · | · | · | · | · |
| `sg_app_approver` | 6 | · | 15 | 2 | · | 2 | · | · | · | · | · |
| `sg_reg_checker_academic` | 8 | · | 15 | 2 | · | 2 | · | · | · | · | · |
| `sg_reg_checker_administrative` | 10 | · | 15 | · | · | 2 | · | · | · | · | · |
| `sg_reg_approver_secretary` | 4 | · | 15 | 3 | · | 2 | · | · | · | · | · |
| `sg_app_approver_secretary` | 4 | · | 15 | 2 | · | 2 | · | · | · | · | · |
| `sg_reg_summary_reviewer` | 1 | · | 15 | 2 | · | 2 | · | · | · | · | · |
| `sg_app_summary_reviewer` | 1 | · | 15 | 2 | · | 2 | · | · | · | · | · |
| `estate_office` | 1 | · | 3 | · | 13 | 2 | · | · | · | · | · |
| `activity_checker` | 1 | · | 3 | · | 13 | 2 | · | · | · | · | · |
| `irg_secretary` | 1 | · | 3 | · | 13 | 2 | · | · | · | · | · |
| `irg_member` (145, IRG Member) | 5 | · | 3 | · | 13 | 2 | · | · | · | · | · |
| `vp_secretary` | 1 | · | 3 | · | 13 | 2 | · | · | · | · | · |
| `vp_member` (147, VPSLA Member) | 6 | · | 3 | · | 13 | 2 | · | · | · | · | · |
| `head` | 1 | · | 3 | · | 13 | 2 | · | · | · | · | · |
| `dean` | 1 | · | 3 | · | 13 | 2 | · | · | · | · | · |
| `delegate` | 1 | · | 3 | · | 13 | 2 | · | · | · | · | · |
| `vprd` | 1 | · | 3 | · | 13 | 2 | · | · | · | · | · |
| `vprd_delegate` | 1 | · | 3 | · | 13 | 2 | · | · | · | · | · |
| `common` / `staff` / `guest` | 11–46 | · | · | · | · | · | · | · | · | · | · |

> 共通模块（首页 / 个人中心 / 关于 SLAS）所有角色都有，故省略。
> Common modules (Home / For You / About SLAS) granted to every role — omitted.

---

## 5. 业务流程视角 / Functional Groupings

> 角色名一律采用 §2 的 `SYSTEM_ROLE.NAME` 权威名；括号内为 DEV 用户数。

### 5.1 平台管理 / Platform Admins

| 角色（canonical name） | code | 能做什么 |
|---|---|---|
| **SuperAdmin - Dev** (3) | `super_admin` | 全权限，含 BPM 引擎部署、菜单/角色/字典/审计/OAuth |
| **System Admin (OCIO)** (6) | `ocio_admin` | 用户/部门/角色 + 基础设施（代码生成、API 日志、定时任务、文件、监控）+ 系统设置；不含 BPM 引擎部署 |
| **SAO Administrator** (8) | `sao_admin` | 业务全数据查阅（培训、组织、活动、事件、黑名单、推广可见性）+ 用户管理（部门/审核设置）+ 通知模板/系统设置；含部分定时任务 |

### 5.2 学生与发起方 / Students & Organisers

| 角色（canonical name） | code | 能做什么 |
|---|---|---|
| **Student** (231) | `student` | 浏览活动、参与（关于 SLAS、个人中心） |
| **Group Leader** (62) | `sg_leader` | **唯一真正使用「主办中心」的角色**：创建活动、提交活动推广、管理报名/出席、提交事件/活动报告、管理活动发布 |
| **Common / Staff / Guest** | `common` / `staff` / `guest` | 仅通用菜单（首页 / About / 个人中心） |

### 5.3 学生组织注册 & 申诉流 / Student-Group Registration & Appeal Workflow

11 个角色共享几乎完全相同的菜单（仅审核中心 + 我的申请 + 工作流管理 + 查阅组织清单）；
**业务区分完全在 BPMN 节点的 candidate-group 绑定**，与 [`student-org-end-to-end-demo-guide.md`](./student-org-end-to-end-demo-guide.md) 的最新角色名口径一致。

```
注册主线 / Registration main line
[Node 1 初审]                 [Node 2 行政审核]              [Node 3 学术审核]
Registration Administrator → Registration Checker        → Registration Referrer
(122 sg_reg_secretary)       (136 sg_reg_checker_admini.)   (132 sg_reg_checker_academic)
   ↓
[Node 4 收集意见 多实例]       [Node 5 汇总审核]              [Node 6 最终审批 / 备选签发]
Registration Reviewer       → Registration Endorser     → Registration Approver
(123 sg_reg_reviewer)         (138 sg_reg_summary_review.)   (124 sg_reg_approver)
                                                          ↳ Student Group Registration Approver Secretary
                                                            (134 sg_reg_approver_secretary)

申诉路径 / Appeal path
[Node 1 收集申诉意见]              [Node 2 汇总审核]                [Node 3 最终审批 / 备选签发]
Registration Appeal Reviewer  → Registration Appeal Endorser → Registration Appeal Approver
(125 sg_app_reviewer)            (139 sg_app_summary_reviewer)   (126 sg_app_approver)
                                                              ↳ Student Group Appeal Approver Secretary
                                                                (135 sg_app_approver_secretary)
```

> 旧名对照：`Student Group Registration Secretary` → **Registration Administrator**；`Student Group Registration Summary Reviewer` → **Registration Endorser**；详见 §2「旧名 / 别名」列。

### 5.4 活动发布工作流 / Activity-Publish Workflow

下表 13 个角色覆盖完整的活动发布审批链；其中 **141–152 的 11 个角色**（`estate_office` / `activity_checker` / `irg_secretary` / `irg_member` / `vp_secretary` / `vp_member` / `head` / `dean` / `delegate` / `vprd` / `vprd_delegate`）**菜单与权限点完全相同**，仅作为 BPMN candidate-group 标记，区分通过流程节点而非 PERMISSION。
`coordinator` (115) 与 `supervisor` (116) 不属于这 11 个"占位"角色，菜单更丰富（参见 §4 矩阵）。
口径权威源：[`activity-publish-workflow-design.md §2.1`](./activity-publish-workflow-design.md)。

| ID | code | `SYSTEM_ROLE.NAME` | BPM 节点职责 |
|---:|---|---|---|
| 115 | `coordinator` | **Coordinator** | ① Phase 1 初审 / 指派 Checker / VP 秘书决议；BPM `coordinatorGroupId` 候选组 |
| 142 | `activity_checker` | **Activity Application Checker** | ② Phase 1 详细审查（由 Coordinator 指派；`BpmUserSyncService.java` 仍硬编码旧名 `Sponsorship Approver`，启动同步会覆写） |
| 116 | `supervisor` | **Activity Application Referrer** | ③ Phase 2 多实例并行审核 |
| 141 | `estate_office` | **EO Venue Reviewer** | ④ Phase 3 校园公共场地审批（EO） |
| 149 | `dean` | **Dean** | ⑤⑥⑥' Phase 3 嘉宾背书 / 赞助 / 活动内容审批（必经） |
| 150 | `delegate` | **Delegate** | ⑤⑥⑥' Phase 3 Dean 委派；与 Dean 共候选组 |
| 148 | `head` | **Head** | 仍存在但**不在当前 BPMN 候选组**（旧版赞助审批） |
| 151 | `vprd` | **VP(RD)** | ⑦ 最终嘉宾审批 |
| 152 | `vprd_delegate` | **VP(RD) Delegate** | ⑦ VP(RD) 委派 |
| 144 | `irg_secretary` | **IRG Secretary** | ⑧⑩ Phase 4 NSOA：IRG 选组 / 摘要审核 |
| 145 | `irg_member` | **IRG Member** | ⑨ Phase 4 NSOA：IRG 投票 |
| 146 | `vp_secretary` | **VPSLA Secretary** | ⑪⑬ Phase 4–5 NSOA：VP 选组 / 共识决定 |
| 147 | `vp_member` | **VPSLA Member** | ⑫⑭ Phase 4 / Phase 6 NSOA：VP 投票（含 ChairPerson 候选） |

> 上述 141–152 的 11 个 type=2 角色共用同一组 PERMISSION：`activity:approval:query` · `activity:approval:supervisor-approve` · `activity:approval:vp-secretary-decision`（外加 7 个 `incident:incident-report:*`）。

### 5.5 突发事件流 / Incident Workflow

```
[发起方 / Reporters]
Group Leader (sg_leader)              → submit incident report (主办中心)
Academy Coordinator (academy_coordin.) → 呈报突发事件（Academy）
                                                 │
                                                 ▼
[Incident Level Classifier (lv_classifier) 事件分级]
       ↓
[Activity Application Referrer (supervisor) 一审签批]
       ↓
[Dean of Students (do_student_admin) / Dean of Custodian Unit (doc_unit) 跟进]
       ↘
        [Activity Application Approver (act_app_approver) 审批] （中高级别）
       ↘
        [Approver (approver) 高权审批]

[SAO Administrator (sao_admin)] 全程数据查阅与跟进
```

| 角色（canonical） | code | 可见 / 操作 |
|---|---|---|
| **Incident Level Classifier** (4) | `lv_classifier` | 事件中心 + 处理报告 + 待办；分级评估 |
| **Activity Application Referrer** (23) | `supervisor` | 审核 + 管理中心（含管理出席、培训记录）+ 一审签批 |
| **Dean of Students** (5) | `do_student_admin` | 事件查询 / 事件详情 + 待办 |
| **Dean of Custodian Unit** (5) | `doc_unit` | 事件查询 + 提交处理报告 |
| **Coordinator** (18) | `coordinator` | 仅事件列表（极轻量监督） |
| **Approver** (4) | `approver` | 仅看管理中心数据，不直接处理事件 |

---

## 6. 权限码分布 / Permission-Code Distribution / 權限碼分佈

> 按 `PERMISSION` 第一段（domain）汇总每角色的按钮（TYPE=3）数量。
> Aggregated by first segment of permission key (domain).

| 角色 | activity | bpm | incident | infra | system | training | 总按钮 |
|---|---:|---:|---:|---:|---:|---:|---:|
| `super_admin` | 43 | 9 | · | 36 | 48 | 11 | **147** |
| `ocio_admin` | 46 | 9 | 3 | 36 | 28 | 11 | 133 |
| `sao_admin` | 14 | 9 | 11 | 7 | 4 | 11 | 56 |
| `act_app_approver` | 13 | · | · | · | 15 | 11 | 39 |
| `academy_coordinator` | 13 | 9 | · | · | · | 11 | 33 |
| `irg_reviewer` (legacy) | 13 | · | · | · | · | · | 13 |
| `approver` | 12 | · | · | · | · | 11 | 23 |
| `supervisor` | 11 | 9 | 11 | · | · | 11 | 42 |
| `lv_classifier` | · | 9 | 10 | · | · | · | 19 |
| `sg_leader` | 32 | · | · | · | · | · | 32 |
| `sg_*_*` (注册流 10 角色) | · | 9 | · | · | · | · | 9 |
| 活动发布工作流 12 角色 | 3 | · | 7 | · | · | · | 10 |
| `doc_unit` | · | · | 7 | · | · | · | 7 |

**关键观察 / Key observations / 關鍵觀察**

- 注册流 10 个 `sg_*` 角色按钮权限**完全相同**（`bpm:*` 9 项），无 `activity` 域权限——他们只在 BPM 流程节点被授权。
- 活动发布 12 个工作流角色按钮权限**完全相同**（`activity:approval:*` 3 项 + `incident:incident-report:*` 7 项）——区分靠 BPMN candidate-group。
- `act_app_approver` 持有 15 项 `system:*` 按钮（菜单管理、审计日志、OAuth 等），与角色业务定位不符 → **疑越权配错**。
- `ocio_admin.activity` 数 (46) 比 `super_admin.activity` (43) 还多——值得校验。
- The 10 `sg_*` registration roles share **identical** button permissions (9 × `bpm:*`); differentiation is entirely BPMN-driven.
- The 12 activity-publish workflow roles share **identical** permission keys (3 `activity:approval:*` + 7 `incident:incident-report:*`).
- `act_app_approver` having 15 `system:*` buttons is suspicious — likely a misconfiguration.
- `ocio_admin.activity` count (46) exceeds `super_admin` (43) — worth verifying.

---

## 7. 异常与遗留 / Anomalies & Legacy / 異常與遺留

| # | 现象 | 建议 |
|---|---|---|
| 1 | `vp_member` code 重复（id=119 旧 vs 147 新） / Duplicate code | 改一方为 `vp_member_legacy` 或下线 id=119；检查 `@PreAuthorize("hasRole('vp_member')")` 命中范围 |
| 2 | "废弃" 模块仍绑定 11 个角色（共 9 个旧入口）/ Deprecated module still bound | 清理 `SYSTEM_ROLE_MENU` 中 root=3006 的引用；从 `SYSTEM_MENU` 软删 |
| 3 | `act_app_approver` 拥有 15 项 `system:*` 按钮 / Suspicious system perms | 审核是否需要 OAuth/操作日志权限；多半是配置漂移 |
| 4 | `role_id` 21 / 42 / 43 / 109 / 110 / 111 / 113 在 `role_menu` 仍被引用，但角色已被删除 / Orphan bindings | `DELETE FROM SYSTEM_ROLE_MENU WHERE ROLE_ID IN (...)`，注意先备份 |
| 5 | 109 / 111 各持 214 菜单（接近全权限）/ Ghost role with full perms | 确认归属，必要时回收 |
| 6 | `irg_secretary` / `vp_secretary` 仅 1 个用户（DEV）/ Under-staffed in DEV | 上线前补全测试账号 |
| 7 | i18n 缺口：11 个活动发布工作流角色（141–152）+ 4 个 `sg_reg_checker*/secretary` 在 `bpm-roles.json` 无翻译 / i18n gaps | 补全 `bpm-roles.json` EN / zh-CN / zh-hk 三语 key |

---

## 8. 关系总览图 / Relationship Diagram / 關係總覽圖

```
                ┌─────────────┐
                │ SYSTEM_USERS│
                └──────┬──────┘
                       │ 1:N
                ┌──────▼─────────┐
                │SYSTEM_USER_ROLE│        ──→ SCOPE (CLOB) 控制角色生效维度
                └──────┬─────────┘
                       │ N:1
                ┌──────▼─────────┐
                │  SYSTEM_ROLE   │        ──→ DATA_SCOPE / DATA_SCOPE_DEPT_IDS
                └──────┬─────────┘
                       │ 1:N
                ┌──────▼─────────┐
                │SYSTEM_ROLE_MENU│        ──→ 菜单/按钮挂载
                └──────┬─────────┘
                       │ N:1
                ┌──────▼─────────┐
                │  SYSTEM_MENU   │        ──→ TYPE(1/2/3) · PERMISSION
                └────────────────┘            └─→ Spring @PreAuthorize
                                                BPMN candidateGroup (用 ROLE.CODE)
```

---

## 9. 维护建议 / Maintenance Notes / 維護建議

1. **i18n 单一来源** / Single source of truth：把 `bpm-roles.json` 拆成 `bpm-roles.{en,zh-CN,zh-hk}.json`，并以 `SYSTEM_ROLE.CODE` 为 key；避免 DB `NAME` 与前端字典各自维护。
2. **菜单清理** / Menu cleanup：`PARENT_ID=3006`（"废弃"）下 9 项与 11 个角色绑定可整批下线。
3. **角色去重** / Role dedup：合并新旧 `vp_member` / `irg_*`，区分 NSOA-only 与 legacy。
4. **权限审计** / Permission audit：对 `act_app_approver.system:*`、`role_id=109/111` 全权角色做一次治理。
5. **三语补全** / Trilingual gaps：12 + 4 个角色补 i18n。

---

## 10. 菜单 × 角色 详细矩阵（三语）/ Menu × Role Detailed Matrix (Trilingual)

> 视图说明：纵向 = 每一个菜单节点（仅 `TYPE∈{1,2}`，即目录与菜单页，不含按钮），横向 = 12 个代表性角色。
> 单元格 `✓` 表示该角色被授权访问该菜单（来自 `SYSTEM_ROLE_MENU`），空白表示未授权。
> 列头一律采用 DB **`SYSTEM_ROLE.NAME`** 权威名（与 §2 一致）。
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

> ⚠️ 这些菜单已被 BPM 工作流取代，但仍绑定在多个角色上，建议清理。
> Legacy menus replaced by BPM workflow but still bound to roles — cleanup candidates.

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
