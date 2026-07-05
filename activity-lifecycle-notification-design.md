# 活动生命周期通知模板设计说明（客户确认版）

> 版本日期：2026-07-01
> 用途：本文用于向业务方说明「活动推广 / 活动报名 / 活动出席 / 活动报告（事件报告）」四个生命周期阶段全部站内消息与邮件通知的**触发时机、接收人、发送方式和三语文案**，供业务**最终确认**。
> 本文只描述业务需求，不包含任何技术实现方案。
> 原始基线：GitHub Issue #268《活动生命周期通知需求规格（P1 / 2026-06-09）》；本次核对修订来源：`zhlibai-asal-SLAS_PRO/docs/design/P1 Noti Comments 20260701.md`。
> 配套文档：活动申请主流程通知见《活动申请通知模板设计说明（客户审核版）》。

---

## 1. 阅读指引

- 本文是**最终拟定文案**，请逐节核对标题、正文、接收人是否符合业务预期。
- 第 3 节《已确认事项与仍需确认事项》列出 2026-07-01 修订后已拍板的规则，以及仍需业务确认的角色范围。
- 第 9 节《不启用通知确认清单》列出本阶段**确定不发送**的通知，请确认客户同意停用。
- 所有启用通知均提供 **English / 繁体中文 / 简体中文** 三语，三语必须表达同一业务动作。
- 占位符（如 `{ACTIVITY_NAME}`）在发送时替换为实际内容；某字段没有值时，该字段整行不显示，不留空标签或空行。
- **发送方式**统一说明：「站内消息 + 邮件」表示两者都发；当接收人没有邮箱或邮件服务不可用时自动跳过邮件，站内消息照常发送。邮件与站内消息使用同一业务内容。

---

## 2. 通知总览（启用通知）

| 阶段 | 通知 | 接收人 | 发送方式 |
| --- | --- | --- | --- |
| 活动推广 | 推广申请已提交、推广待审核、推广审批通过、推广审批拒绝 / 退回、审批完成同步告知 | 申请人、当前审批人、其他活动指导 / OC 成员 / 组织负责人 | 站内消息 + 邮件 |
| 活动报名 | 报名已提交、报名名单待审核、报名审批结果、撤回报名 | 报名学生、相关活动指导 | 站内消息 + 邮件 |
| 活动出席 | 活动前 24 小时提醒、签到提醒、签退提醒 | 已获批报名 / 已签到学生 | 站内消息 + 邮件 |
| 活动报告（事件报告） | 提交确认、待活动指导确认、待事件分级、待活动指导跟进、处理报告待审阅、最终结果、退回、提交限期提醒、管理层通知 / 事件警报 | 报告人、活动指导、事件分级员、Dean / 管理单位 | 站内消息 + 邮件 |

> **本文不覆盖**：活动申请主流程通知（见 #210）、学生组织注册 / 申诉流程通知、非活动生命周期 P1 范围的其他系统通知。
>
> **确定不启用**的通知（推广生效、活动开始前 2 小时提醒、缺席统计、活动完成、培训提醒等）汇总于第 9 节，请一并确认。

---

## 3. 已确认事项与仍需确认事项

以下结论已按 2026-07-01 客户修订意见更新。其中仅 R01 为尚待业务提供信息的开放问题，其余按本版执行。

| 编号 | 事项 | 处理 |
| --- | --- | --- |
| C01 | 活动推广「审批完成同步告知」发送给哪些人？是否排除申请人与本次审批人？ | 发送给其他活动指导（Supervisors）、OC 成员和组织负责人（Group Leader），并**排除**申请人与本次审批人。 |
| C02 | 报名相关的「新报名申请给组织者」「名额已满提醒」是否启用？ | **不启用**；仅保留「报名已提交」确认与「报名审批结果」。 |
| C03 | 报名名单审批完成给组织者 / 给学生、单独报名拒绝等重复通知如何处理？ | **停用**；不单独发送重复通知。 |
| C04 | 活动出席提醒保留哪些？ | 仅保留**活动前 24 小时提醒、签到提醒、签退提醒**；停用活动开始前 2 小时提醒、缺席统计通知、活动完成通知。 |
| C05 | 事件报告「最终结果」中「退回」的语义如何统一？ | 统一为 **`Returned for Revision / 退回修改`**，不与 `Rejected / 拒绝` 混用。 |
| C06 | 培训提醒与培训合规结果通知是否启用？ | **不启用**；业务说明为：组织者未完成培训时，不能获批报名活动。 |
| C07 | Activity Report Audit、Student Group Registration Approval、Student Group Registration Appeal | 功能尚未开发或尚未 UAT 测试，暂时停用并隐藏通知样本。 |
| C08 | 通知正文抬头 | 启用通知统一使用默认问候语 `Dear User,` / `您好，`，不使用个人姓名抬头。 |
| C09 | 学生端链接 | 学生没有 to-do-list；学生收到的 withdraw、re-enrol、resubmit、review 类链接不得指向待办列表。 |
| C10 | Incident Report 邮件结构 | 所有事件报告邮件统一加入邮件头与系统页脚；有审核链接时，只保留按钮或链接之一，不重复显示。 |
| C11 | Incident Report Type 字段 | Supervisor 不需要提交 Emergency Report；Organisers 提交 1-day 和 2-week incident reports。 |
| R01（**开放**） | 事件报告管理层通知的接收范围（Dean / 管理单位 / 学生事务长等）是否已完整覆盖？ | 当前发送给系统现有的管理 / 最终审阅人员范围。**若业务要求加入学生事务长或其他授权人员，请提供明确的角色、用户组或数据来源。** |

---

## 4. 活动推广通知

### 4.1 推广申请已提交（站内消息 + 邮件）

- 触发：推广申请提交成功并进入审批后。
- 接收人：推广申请人。
- 问候语：统一使用默认问候语 `Dear User,` / `您好，`。
- 包含字段：活动名称、主办单位、申请人、推广 / 报名开始与结束时间。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Promotion Application Submitted | Your activity promotion application has been successfully submitted and is now under review. |
| 繁中 | 宣傳申請已提交 | 您的活動宣傳申請已提交，目前正在審核中。 |
| 简中 | 推广申请已提交 | 您的活动推广申请已提交，目前正在审核中。 |

### 4.2 推广待审核（站内消息 + 邮件）

- 触发：推广审批任务产生时。
- 接收人：当前推广审批人 / 候选审批人。
- 包含字段：活动名称、主办单位、申请人、推广 / 报名开始与结束时间、审核链接。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Promotion Pending Review | An activity promotion application has been submitted and is awaiting your review. Kindly review the details and proceed via the link below. |
| 繁中 | 宣傳待審核 | 有一項活動宣傳申請已提交，正等待您進行審核。請點擊下方連結審閱詳情。 |
| 简中 | 推广待审核 | 有一项活动推广申请已提交，正等待您进行审核。请点击下方链接审阅详情。 |

### 4.3 推广审批通过（站内消息 + 邮件）

- 触发：推广审批通过、流程完成后。
- 接收人：推广申请人 / 建立人。
- 问候语：统一使用默认问候语 `Dear User,` / `您好，`。
- 包含字段：活动名称、主办单位、申请人、审核结果；不显示 Reviewer、Review Time、Comments。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Promotion Approved | Your activity promotion application has been approved. |
| 繁中 | 宣傳審批通過 | 您的活動宣傳申請已通過審批。 |
| 简中 | 推广审批通过 | 您的活动推广申请已通过审批。 |

### 4.4 推广审批拒绝 / 退回修改（站内消息 + 邮件）

- 触发：推广审批拒绝或退回、流程完成后。
- 接收人：推广申请人 / 建立人。
- 问候语：统一使用默认问候语 `Dear User,` / `您好，`。
- 包含字段：活动名称、主办单位、申请人、审核结果、原因、重新提交链接；不显示 Reviewer、Review Time。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Promotion Rejected | Your activity promotion application has been rejected. Please review the comments below, make the necessary amendments, and resubmit via the system. |
| 繁中 | 宣傳審批被拒絕 | 您的活動推廣申請已被拒絕。請查看下方的審批意見，修正相關內容後重新提交申請。 |
| 简中 | 推广审批被拒绝 | 您的活动推广申请已被拒绝。请查看下方的审批意见，修正相关内容后重新提交申请。 |

### 4.5 审批完成同步告知（站内消息 + 邮件）

- 触发：推广审批结果产生后，同步告知相关人员。
- 接收人：其他活动指导（Supervisors）、OC 成员和组织负责人（Group Leader）；**排除**申请人与本次审批人（详见 C01）。
- 包含字段：活动名称、审核结果、原因；不显示 Reviewer、Review Time。

| 结果 | 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- | --- |
| 通过 | English | Promotion Approved | The activity promotion application has been approved by another Supervisor. No further review action is required. |
| 拒绝 / 退回 | English | Promotion Rejected | The activity promotion application has been rejected by another Supervisor. The applicant will be asked to revise and resubmit. No further review action is required from you at this stage. |
| 通过 | 繁中 | 宣傳已通過 | 此宣傳申請已獲其他活動指導審批通過，無需您進一步操作。 |
| 拒绝 / 退回 | 繁中 | 宣傳已被拒絶 | 此宣傳申請已被其他活動指導退回給申請人修改。申請人將在修訂後重新提交，目前無需您進行任何處理。 |
| 通过 | 简中 | 推广已通过 | 此推广申请已被其他活动指导审批通过，无需您进一步操作。 |
| 拒绝 / 退回 | 简中 | 活动推广已被拒绝 | 此推广申请已被其他活动指导退回给申请人修改。申请人将在修订后重新提交，目前无需您进行任何处理。 |

---

## 5. 活动报名通知

### 5.1 报名已提交（站内消息 + 邮件）

- 触发：学生提交活动报名。
- 接收人：报名学生。
- 问候语：统一使用默认问候语 `Dear User,` / `您好，`。
- 包含字段：活动名称、主办单位、活动日期、报名时间、撤回报名链接。撤回报名链接不得指向学生待办列表。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Enrolment Submitted | Your activity enrolment has been submitted and is under review. |
| 繁中 | 活動報名已提交 | 您的活動報名已提交，目前正在審核中。 |
| 简中 | 活动报名已提交 | 您的活动报名申请已提交，目前正在审核中。 |

### 5.2 报名名单待审核（站内消息 + 邮件）

- 触发：报名名单获 OC 推荐并进入活动指导审核时。
- 接收人：相关活动指导。
- 包含字段：活动名称、主办单位、活动日期、报名时间、审核报名链接。
- English 术语统一使用 `Enrolment List Approval`，不得使用 `Enrollment List Approval`。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Enrolment Pending Review | The activity enrolment list has been submitted and is awaiting your review. Kindly review the details and proceed via the link below. |
| 繁中 | 活動報名待審核 | 活動報名名單已提交，正等待您進行審核。請點擊下方連結審閱詳情。 |
| 简中 | 活动报名待审核 | 活动报名名单已提交，正等待您进行审核。请点击下方链接审阅详情。 |

### 5.3 报名审批结果（站内消息 + 邮件）

- 触发：单个报名被通过 / declined / returned，或批量审批完成后。
- 接收人：报名学生。
- 问候语：统一使用默认问候语 `Dear User,` / `您好，`。
- 包含字段：活动名称、主办单位、活动日期、审核结果，以及撤回 / 重新报名 / 重新提交链接；报名审批结果不显示 Review Time。Approved 通知不显示 Comments，Declined 通知不显示 Reason。
- 学生链接不得指向待办列表。Declined 后的链接指向 SLAS 活动列表或活动页；Returned 后须提供重新提交报名链接。

| 结果 | 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- | --- |
| 通过 | English | Enrolment Successful | Your activity enrolment is successful. Please attend the activity as scheduled, or cancel your enrolment via the link below if you can no longer attend. |
| Declined | English | Enrolment Declined | We regret to inform you that your enrolment application has been declined.<br><br>However, we welcome you to visit SLAS to explore and enrol in other exciting activities:<br><https://pappl.eduhk.hk/slas><br><br>If you have any questions, please contact the activity organiser directly. |
| Returned | English | Enrolment Returned | Your enrolment application has been returned. Please check the details and comments, and resubmit your enrolment if necessary. |
| 通过 | 繁中 | 活動報名成功 | 您的活動報名申請已通過審批。請準時出席活動；如未能出席，請點擊下方連結取消報名。 |
| Declined | 繁中 | 活動報名未獲通過 | 我們很遺憾地通知您，您的活動報名申請未獲通過。<br><br>歡迎您前往 SLAS，探索並參與其他精彩活動：<br><https://pappl.eduhk.hk/slas><br><br>如有任何疑問，請與活動主辦方聯繫。 |
| Returned | 繁中 | 活動報名已被退回 | 您的活動報名申請已被退回。請點擊下方連結查看詳情及意見，並在必要時重新提交申請。 |
| 通过 | 简中 | 活动报名成功 | 您的活动报名申请已通过审批。请准时出席活动；如未能出席，请点击下方链接取消报名。 |
| Declined | 简中 | 活动报名未获通过 | 我们很遗憾地通知您，您的活动报名申请未获通过。<br><br>欢迎您前往 SLAS 平台，探索并参与其他精彩活动：<br><https://pappl.eduhk.hk/slas><br><br>如有任何疑问，请与活动主办方联系。 |
| Returned | 简中 | 活动报名已被退回 | 您的活动报名申请已被退回。请点击下方链接查看详情及审批意见，并在必要时重新提交申请。 |

### 5.4 撤回报名（站内消息 + 邮件）

- 触发：学生自行点击「取消报名」并成功执行后。
- 接收人：报名学生。
- 包含字段：活动名称、主办单位、活动日期、撤回时间、重新报名链接。重新报名链接不得指向学生待办列表。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Enrolment Withdrawn Successfully | Your enrolment for the activity has been successfully withdrawn. If you wish to re-enrol, please visit the activity page via the link below. |
| 繁中 | 成功撤回活動報名 | 您的活動報名申請已成功撤回。若您希望重新報名參加，請點擊下方連結返回活動頁面。 |
| 简中 | 成功撤回活动报名 | 您的活动报名申请已成功撤回。若您希望重新报名参加，请点击下方链接返回活动页面。 |

---

## 6. 活动出席通知

> 本阶段仅启用以下三类提醒；活动开始前 2 小时提醒、缺席统计通知、活动完成通知**不启用**（详见 C04 与第 9 节）。
> 出席提醒的 TC / SC 下拉值必须显示对应中文值，不得继续显示 English 值。学生链接不得指向待办列表。

### 6.1 活动前 24 小时出席提醒（站内消息 + 邮件）

- 触发：活动开始前约 24 小时自动触发。
- 接收人：已获批报名学生。
- 包含字段：活动名称、主办单位、活动日期、撤回报名链接。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Event Reminder: `{ACTIVITY_NAME}` Starts Tomorrow | Your upcoming activity will start soon. Please attend on time, or cancel your enrolment via the link below if you can no longer attend. |
| 繁中 | 活動出席提醒：`{ACTIVITY_NAME}` 將於明天開始 | 您報名的活動即將開始。請準時出席活動；如未能出席，請點擊下方連結取消報名。 |
| 简中 | 活动出席提醒：`{ACTIVITY_NAME}` 将于明天开始 | 您报名的活动即将开始。请准时出席活动；如未能出席，请点击下方链接取消报名。 |

### 6.2 签到提醒（站内消息 + 邮件）

- 触发：活动开始时间后 30 分钟内仍未签到。
- 接收人：已获批报名但未签到的学生。
- 包含字段：活动名称、主办单位、活动日期、撤回报名链接。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Action Required: Please Complete Check-in for `{ACTIVITY_NAME}` | Please contact the organisers on-site to complete your check-in. If you are still waiting for it to begin, remember to check in and out to record your attendance.<br><br>Click the link below to de-register yourself if you cannot attend the event. |
| 繁中 | 請完成簽到：`{ACTIVITY_NAME}` | 請聯繫現場籌辦者完成簽到。若您仍在等待活動開始，請記得在現場進行簽到及簽退，以完整記錄您的出席。<br><br>若您無法出席，請點擊下方連結取消報名。 |
| 简中 | 请完成签到：`{ACTIVITY_NAME}` | 请联系现场组织者完成签到。若您仍在等待活动开始，请记得在现场进行签到及签退，以完整记录您的出席。<br><br>若您无法出席，请点击下方链接取消报名。 |

### 6.3 签退提醒（站内消息 + 邮件）

- 触发：活动原定结束前 30 分钟内仍未签退。
- 接收人：已签到但未签退的学生。
- 包含字段：活动名称、主办单位、活动日期。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Action Required: Please Complete Check-out for `{ACTIVITY_NAME}` | The activity is drawing to a close. Please contact the organisers on-site to complete your check-out to record your attendance. |
| 繁中 | 請完成簽退：`{ACTIVITY_NAME}` | 活動即將結束。請聯繫現場籌辦者完成簽退程序，以完整記錄您的出席。 |
| 简中 | 请完成签退：`{ACTIVITY_NAME}` | 活动即将结束。请联系现场组织者完成签退程序，以完整记录您的出席。 |

---

## 7. 活动报告 / 事件报告通知

> 事件报告流程按报告类型与事件级别（低 / 中 / 高）裁剪：低级别在活动指导跟进后结束；中 / 高级别会进入 Dean / 管理单位的待阅与最终审阅环节。以下通知按所处流程节点和角色范围发送。
> 所有 Incident Report 邮件标题不带活动名称，避免与其他通知标题规则不一致；活动名称仍可作为正文信息字段显示。邮件必须包含统一邮件头与系统页脚。若通知提供审核链接，只能显示 Review Now 按钮或原始链接之一，不得同时显示按钮和链接。
> 事件级别字段只显示级别值，不追加 `(Medium)` 等括号后缀。

### 7.1 事件报告提交确认（站内消息 + 邮件）

- 触发：OC 或 Supervisor 成功提交事件报告后。
- 接收人：报告提交人。
- 包含字段：活动名称、主办单位、事件报告类别、提交人、角色、提交时间、查看链接。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Incident Report Submitted | The incident report has been submitted. Please click the link below to review the report details. |
| 繁中 | 事件報告提交確認 | 系統已收到事件報告。請點擊下方連結查看報告詳情。 |
| 简中 | 事件报告提交确认 | 系统已收到事件报告。请点击下方链接查看报告详情。 |

### 7.2 事件报告待活动指导确认（站内消息 + 邮件）

- 触发：需活动指导先行确认的事件报告进入待确认节点。
- 接收人：本活动的活动指导（Supervisors）。
- 包含字段：活动名称、主办单位、事件报告类别、提交人、角色、提交时间、审核链接。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Incident Report Pending Review | An incident report has been submitted and is awaiting your confirmation. Kindly review the details and proceed via the link below. |
| 繁中 | 事件報告待審閱 | 系統已收到事件報告，正等待您進行確認。請點擊下方連結審閱詳情。 |
| 简中 | 事件报告待审阅 | 系统已收到事件报告，正等待您进行确认。请点击下方链接审阅详情。 |

### 7.3 事件待分级员分级（站内消息 + 邮件）

- 触发：活动指导提交紧急事件报告，或确认 OC 事件报告且勾选为「有事故」后。
- 接收人：事件分级员（Incident Level Classifier）。
- 包含字段：活动名称、主办单位、事件报告类别、提交人、角色、提交时间、审核链接。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Incident Pending Classification | An incident report has been submitted and is awaiting your classification. Kindly review the details and proceed via the link below. |
| 繁中 | 事件待分級 | 系統已收到事件報告，正等待您進行事件分級與評估。請點擊下方連結審閱詳情。 |
| 简中 | 事件待分级 | 系统已收到事件报告，正等待您进行事件分级与评估。请点击下方链接审阅详情。 |

### 7.4 事件待活动指导跟进（站内消息 + 邮件）

- 触发：事件分级员完成分级后。
- 接收人：本活动的活动指导（Supervisors）。
- 包含字段：活动名称、主办单位、事件报告类别、事件级别、处理报告提交链接。
- 备注：Incident Report Type 应按报告提交角色显示。Supervisor 不需要提交 Emergency Report；Organisers 提交 1-day 和 2-week incident reports。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Incident Pending Follow-up | The incident reported has been classified. After handling, please complete a report detailing how the incident was managed via the link below. |
| 繁中 | 事件待跟進 | 此事件已完成分級。請於事件處理完畢後，點擊下方連結提交處理詳情。 |
| 简中 | 事件待跟进 | 该事件已完成分级。请在事件处理完成后，点击下方链接提交处理详情。 |

### 7.5 事件处理报告待审阅（站内消息 + 邮件）

- 触发：活动指导提交事件处理报告后（仅中 / 高级别事件）。
- 接收人：Dean / 管理单位等最终审阅人（详见 R01）。
- 包含字段：活动名称、主办单位、事件报告类别、处理报告查看链接。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Incident Handling Report Pending Review | The supervisor has submitted the incident handling report, which is now awaiting your final review and endorsement. Please click the link below to review the handling details. |
| 繁中 | 事件處理報告待審閱 | 活動指導已提交事件處理報告，目前正等待您進行最終審閱與核准。請點擊下方連結審閱處理詳情。 |
| 简中 | 事件处理报告待审阅 | 活动指导已提交相关事件之处理报告，目前正等待您进行最终审阅与核准。请点击下方链接审阅处理详情。 |

### 7.6 事件报告最终结果通知报告人（站内消息 + 邮件）

- 触发：OC 提交的事件报告审批流程完成。
- 接收人：报告提交人。
- 包含字段：活动名称、主办单位、事件报告类别、提交人、审核人、审核结果。
- 学生链接不得指向待办列表。

| 结果 | 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- | --- |
| 通过 | English | Incident Report Approved | The incident report has been approved. |
| 退回 | English | Incident Report Returned for Revision | The incident report has been returned for revision. Kindly review the feedback, make the necessary amendments, and resubmit for approval via the link below. |
| 通过 | 繁中 | 事件報告已通過 | 事件報告已正式通過審核。 |
| 退回 | 繁中 | 事件報告已被退回修改 | 事件報告被退回。請點擊下方連結審閱修改意見，並於完成修正後重新提交審核。 |
| 通过 | 简中 | 事件报告已通过 | 事件报告已正式通过审核。 |
| 退回 | 简中 | 事件报告已被退回修改 | 事件报告被退回。请点击下方链接审阅修改意见，并在完成修正后重新提交审核。 |

### 7.7 事件处理报告结果通知（站内消息 + 邮件）

- 触发：事件处理报告审阅通过或退回。
- 接收人：活动指导 / 相关处理人。
- 包含字段：活动名称、主办单位、事件报告类别、审核人、审核结果、原因。

| 结果 | 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- | --- |
| 通过 | English | Incident Handling Report Endorsed | The incident handling report has been endorsed. |
| 退回 | English | Incident Handling Report Returned for Revision | The incident handling report has been returned for revision. Kindly review the feedback, make the necessary amendments, and resubmit for approval via the link below. |
| 通过 | 繁中 | 事件處理報告已通過 | 事件處理報告已正式通過審閱。 |
| 退回 | 繁中 | 事件處理報告已被退回修改 | 事件處理報告被退回。請點擊下方連結審閱修改意見，並於完成修正後重新提交審核。 |
| 通过 | 简中 | 事件处理报告已通过 | 事件处理报告已正式通过审阅。 |
| 退回 | 简中 | 事件处理报告已被退回修改 | 事件处理报告被退回。请点击下方链接审阅修改意见，并在完成修正后重新提交审核。 |

### 7.8 分级退回活动指导（站内消息 + 邮件）

- 触发：事件分级员退回事件报告。
- 接收人：活动指导（Supervisors）。
- 包含字段：活动名称、主办单位、事件报告类别、提交的活动指导、重交链接。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Incident Report Returned for Revision | The incident report has been returned for revision. Kindly review the feedback, make the necessary amendments, and resubmit for approval via the link below. |
| 繁中 | 事件報告已被退回修改 | 事件報告被退回。請點擊下方連結審閱修改意見，並於完成修正後重新提交審核。 |
| 简中 | 事件报告已被退回修改 | 事件报告被退回。请点击下方链接审阅修改意见，并在完成修正后重新提交审核。 |

### 7.9 事件报告提交限期提醒（站内消息 + 邮件）

- 触发：事件报告临近提交截止日期（约截止前 3 天内）且报告仍未完成提交。
- 接收人：活动负责人 / 活动指导。
- 包含字段：活动名称、活动日期、组织者名称、报告状态、提交链接。提交链接不得指向学生待办列表。
- 抄送：邮件需 BCC Supervisor 和 Coordinator。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Incident Report Deadline Reminder | Please click the link below to complete and submit the incident report before the deadline. Please note that late submission or a NIL-submission may lead to a formal investigation by the Supervisor(s). |
| 繁中 | 事件報告提交限期提醒 | 請點擊下方連結，並於截止日期前完成及提交相關的事件報告。請注意：逾期未交或漏報，活動指導將可能推定活動曾發生事故並進行正式調查。 |
| 简中 | 事件报告提交限期提醒 | 请点击下方链接，并在截止日期前完成及提交相关的事件报告。请注意：逾期未交或漏报，活动指导将可能推定活动曾发生事故并进行正式调查。 |

> 简中标题已由源文案 `事件报告截止日` 修正为 `事件报告提交限期提醒`，与英文 / 繁中保持一致。

### 7.10 管理层通知 / 事件警报（站内消息 + 邮件）

- 触发：中 / 高级别事件进入管理层监控 / 最终审阅环节。
- 接收人：Dean / 管理单位等管理层人员（接收范围详见 R01）。
- 包含字段：活动名称、主办单位、事件报告类别、事件级别、报告链接。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Incident Alert | An incident reported might require your immediate attention. Please click the link below to review the report details. |
| 繁中 | 事件警報 | 事件可能需要您即時關注。請點擊下方連結審閱報告詳情。 |
| 简中 | 事件警报 | 事件可能需要您即时关注。请点击下方链接审阅报告详情。 |

---

## 8. 培训提醒 / 合规通知

培训相关提醒在本阶段**全部不启用**（详见 C06 与第 9 节）。

业务意见：不需要发送培训提醒；组织者若未完成培训，将无法获批报名活动。

---

## 9. 不启用通知确认清单

以下通知在本阶段**确定不发送**，请确认客户同意停用。

| 阶段 | 不启用通知 | 不启用原因 |
| --- | --- | --- |
| 活动推广 | 推广生效通知 | 经客户批注删除，不单独发送。 |
| 活动报名 | 新报名申请给组织者 | 不需要；不接入主流程。 |
| 活动报名 | 名额已满提醒 | 不需要；不接入主流程。 |
| 活动报名 | 报名名单审批完成给组织者 | 与「报名审批结果」重复，删除或并入。 |
| 活动报名 | Enrolment List Approved | 客户要求停用，不单独发送给 Organizer。 |
| 活动报名 | Enrolment List Rejected | 客户要求停用，不单独发送给 Organizer。 |
| 活动报名 | 报名名单审批完成给学生 | 与「报名审批结果」重复，删除或并入。 |
| 活动出席 | 活动开始前 2 小时提醒 | 客户确认不需要。 |
| 活动出席 | 缺席统计通知 | 客户确认不需要；可保留必要的缺席标记能力，但不发送通知。 |
| 活动出席 | 活动完成通知 | 建议由活动后评价问卷通知替代。 |
| Activity Report Audit | 全流程通知 | 功能尚未开发或尚未 UAT 测试，暂时隐藏通知样本。 |
| Student Group Registration Approval | 全流程通知 | 功能尚未开发或尚未 UAT 测试，暂时隐藏通知样本。 |
| Student Group Registration Appeal | 全流程通知 | 功能尚未开发或尚未 UAT 测试，暂时隐藏通知样本。 |
| 事件报告 | 跟进进展更新给报告人 | 客户批注要求删除，不必要。 |
| 事件报告 | 给组织负责人的结果知会 | 客户批注要求删除，不必要。 |
| 事件报告 | High-Level Incident Requires Escalation | 与 Incident Alert 重复，停用。 |
| 事件报告 | 待 Dean 监控的重复通知 | 与管理层通知重复，不另建重复模板。 |
| 事件报告 | 逾期催交提醒 | 当前只更新逾期天数，不单独发通知。 |
| 培训 | 培训进度 / 截止 / 完成 / 自定义提醒 | 客户确认不启用。 |
| 培训 | 培训合规结果通知 | 客户确认不启用。 |

---

## 10. 通用规则

### 10.1 变量

字段没有值时，不显示该字段行，不留空标签或空行。

| 变量 | 含义 | 主要使用场景 | 示例 |
| --- | --- | --- | --- |
| `{ACTIVITY_NAME}` | 活动名称 | 全阶段 | Campus Music Night 2026 |
| `{ORGANISATION_NAME}` | 主办单位名称 | 推广、报名、事件报告 | Singing Club |
| `{APPLICANT_NAME}` | 申请人名称 | 推广 | Alex Chan |
| `{ACTIVITY_DATE}` | 活动日期 | 报名、出席 | 2026-09-15 19:00 - 2026-09-15 21:30 |
| `{REVIEW_LINK}` | 审核 / 查看链接 | 待审核、待处理、事件报告 | https://slas.example.edu.hk/... |
| `{RESULT}` | 审核结果 | 审批结果 | Approved |
| `{RESUBMIT_LINK}` | 重新提交链接 | 推广、报名、事件报告退回 | https://slas.example.edu.hk/... |
| `{WITHDRAW_LINK}` | 撤回报名链接 | 报名、出席 | https://slas.example.edu.hk/... |
| `{RE_ENROL_LINK}` | 重新报名链接 | 报名撤回后 | https://slas.example.edu.hk/... |
| `{INCIDENT_REPORT_TYPE}` | 事件报告类别 | 事件报告 | Safety incident |
| `{INCIDENT_LEVEL}` | 事件级别，不带括号后缀 | 事件报告 | Level 2 |
| `{DEADLINE}` | 截止日期 | 事件报告提醒 | 2026-09-20 |

### 10.2 字段标签（三语）

| 字段 | English | 繁中 | 简中 |
| --- | --- | --- | --- |
| 默认问候语 | Dear User, | 您好， | 您好， |
| 活动名称 | Activity Name | 活動名稱 | 活动名称 |
| 主办单位 | Organising Unit | 主辦單位名稱 | 主办单位名称 |
| 申请人 | Applicant | 申請人 | 申请人 |
| 活动日期 | Activity Date | 活動日期 | 活动日期 |
| 审核链接 | Review Link | 審核連結 | 审核链接 |
| 审核结果 | Result | 審核結果 | 审核结果 |
| 原因 | Reason | 原因 | 原因 |
| 事件报告类别 | Incident Report Type | 事件報告類別 | 事件报告类别 |
| 事件级别 | Incident Level | 事件級別 | 事件级别 |
| 截止日期 | Deadline | 截止日期 | 截止日期 |
| 通过 | Approved | 已通過 | 已通过 |
| 拒绝 | Rejected | 已拒絕 | 已拒绝 |
| 退回修改 | Returned for Revision | 已退回修改 | 已退回修改 |

### 10.3 站内消息展示顺序

1. 通知标题
2. 问候语
3. 正文固定文案
4. 活动 / 报名 / 事件报告信息字段
5. 操作链接（如适用）

### 10.4 邮件展示顺序

1. 邮件主题
2. 免回复声明
3. 问候语
4. 正文固定文案
5. 活动 / 报名 / 事件报告信息字段
6. 操作链接（如适用）
7. 系统页脚

### 10.5 免回复声明与系统页脚

免回复声明与页脚规则与《活动申请通知模板设计说明（客户审核版）》保持一致。

免回复声明：

| 语言 | 文案 |
| --- | --- |
| English | This is a system-generated message from the Student-led Activities System (SLAS). Please do not reply. |
| 繁中 | 本郵件由學生主導活動系統 (SLAS) 自動生成，請勿直接回覆。 |
| 简中 | 本邮件由学生主导活动系统 (SLAS) 自动生成，请勿直接回复。 |

系统页脚：

| 语言 | 页脚 |
| --- | --- |
| English | For enquiries, please email student-led@eduhk.hk.<br>Student-led Activities System<br>This is a system-generated message from The Education University of Hong Kong. This message (including any attachments) may contain confidential, proprietary, privileged and/or private information, intended solely for the use of the individual(s) or entity named above. If you are not the intended recipient, please notify our support team immediately and delete this message and all its attachments. Please note that any disclosure, copying, distribution or other use of this message or any attachment by an unintended recipient is strictly prohibited. |
| 繁中 | 如有查詢，請電郵至 student-led@eduhk.hk。<br>學生主導活動系統<br>本郵件為香港教育大學系統自動生成的訊息。本訊息（包括任何附件）可能包含機密、專利、受特權保護及/或私隱的資訊，僅供上述指定的個人或實體使用。若您並非本訊息的預期接收者，請立即通知我們的支援團隊，並刪除本訊息及其所有附件。特此聲明，非預期接收者對本訊息或任何附件的任何披露、複製、分發或其他使用行為均被嚴格禁止。 |
| 简中 | 如有查询，请电邮至 student-led@eduhk.hk。<br>学生主导活动系统<br>本邮件为香港教育大学系统自动生成的讯息。本讯息（包括任何附件）可能包含机密、专利、受特权保护及/或隐私的信息，仅供上述指定的个人或实体使用。若您并非本讯息的预期接收者，请立即通知我们的支援团队，并删除本讯息及其所有附件。特此声明，非预期接收者对本讯息或任何附件的任何披露、复制、分发或其他使用行为均被严格禁止。 |
