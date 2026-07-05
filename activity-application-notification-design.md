# 活动申请通知模板设计说明（客户审核版）

> 版本日期：2026-07-01
> 用途：本文用于向业务方说明「活动申请主流程」全部站内消息与邮件通知的**触发时机、接收人、发送方式和三语文案**，供业务审核与确认。
> 本文只描述业务需求，不包含任何技术实现方案。
> 原始基线：GitHub Issue #210《活动申请通知需求规格（2026-06-02）》正文；本次核对修订来源：`zhlibai-asal-SLAS_PRO/docs/design/Activity Application Module Noti Comments 20260701.md`。

---

## 1. 阅读指引

- 本文是**最终拟定文案**，请逐节核对标题、正文、接收人是否符合业务预期。
- 第 3 节《已确认事项》列出 2026-07-01 修订后已拍板、会影响是否发送或如何展示的规则。
- 所有通知均提供 **English / 繁体中文 / 简体中文** 三语，三语必须表达同一业务动作。
- 占位符（如 `{ACTIVITY_NAME}`）在发送时替换为实际内容；某字段没有值时，该字段整行不显示，不留空标签或空行。

---

## 2. 通知总览

| 阶段 | 通知 | 接收人 | 发送方式 |
| --- | --- | --- | --- |
| 提交前 OC 认可 | 需要 OC 认可、修改后重新认可、部分成员已认可、所有成员已认可 | OC 成员 | 仅站内消息 |
| 申请提交 | 活动申请已提交 | **所有 OC 成员** | 站内消息 + 邮件 |
| 审批待办 | 各审批环节待办提醒 | 当前审批人 | 站内消息 + 邮件 |
| 审批结果 | 审批通过 / 拒绝 / 退回修改 | **所有 OC 成员** | 站内消息 + 邮件 |
| 审批同步 | 审批通过 / 拒绝 / 退回修改结果同步 | 已参与审批人员 | 邮件 BCC |

**本次不覆盖**：活动推广申请流程、活动报名/签到/出席记录、活动总结、事件报告，以及非活动申请主流程的其他通知。

> 站内消息与邮件使用同一业务内容，但展示长度不同：邮件保留完整内容；站内消息若内容过长，会自动使用较精简的文本和信息字段展示，避免超过系统站内消息长度限制。

### 2.1 相对旧版的主要变化

| 变化 | 旧版 | 本版 |
| --- | --- | --- |
| 业务术语 | activity publish request / 活动发布申请 | activity application / 活动申请 |
| 申请提交接收人 | 活动申请人 | 所有 OC 成员，样本接收人显示为系统角色 |
| 审批结果接收人 | 仅活动申请人 | 所有 OC 成员 |
| 审批结果字段 | 显示 Reviewer，Comments / Reason 显示长文本 | 不显示 Reviewer；Comments / Reason 直接显示审核详情 URL |
| 拒绝文案 | 可提示「修改后重新提交本申请」 | 拒绝后须重新发起**全新申请**，不得提示修改本申请 |
| IRG / VPSLA 术语 | vote / cast vote / VP group selection | assessment / recommendation / review / confirmation |
| 邮件结构 | 无统一免回复声明与页脚 | 统一加入免回复声明与系统页脚 |
| 样本语言切换 | 可能联动全站界面语言 | 仅切换通知标题与内容，不切换 SLAS 全站界面语言 |

---

## 3. 已确认事项

以下事项已按 2026-07-01 客户修订意见确认。

| 编号 | 确认事项 | 处理 |
| --- | --- | --- |
| Q01 | 「Dean / Delegate 外部嘉宾认可（Guest Endorsement）」待办通知 | 暂时停用，不在样本或真实发送中启用；VPRD / VPRD Delegate「嘉宾最终审批」仍按第 4.3 节发送 |
| Q02 | 「赞助审批」待办通知 | 暂时停用，不在样本或真实发送中启用 |
| Q03 | EO 校园场地使用建议字段 | 不显示申请人；改显示 Supervisor(s) / 活動指導 / 活动指导 |
| Q04 | 审批结果通知 | 发给所有 OC 成员，抬头统一使用默认问候语 Dear User；不显示 Reviewer |
| Q05 | 审批结果 Comments / Reason | 直接显示审核详情 URL，避免 VPSLA 长意见撑长通知 |
| Q06 | 审批同步通知 | 通过 BCC 同步发给所有已参与审批人员；迎新活动同样需要同步 |
| Q07 | 4.6 活动发布成功通知 | 已移除 |
| Q08 | 通知样本语言切换 | 只切换通知标题与内容，不联动页面上的 SLAS 全站界面语言 |
| Q09 | 邮件免回复声明 | 在邮件预览和实际邮件中置中显示 |

---

## 4. 各阶段通知文案

### 4.1 提交前 OC 认可（仅站内消息）

> 本节只在设计文档中保留规格说明。Workflow Notification Samples 页面无需新增 4.1.1 至 4.1.4 的通知样本。

#### 4.1.1 需要 OC 成员认可
- 触发：活动提交审批前，需 OC 成员确认参与并认可活动内容。
- 接收人：待认可的 OC 成员。

| 语言 | 标题 | 正文 |
| --- | --- | --- |
| English | Activity Endorsement Required | You have been designated as an Organising Committee (OC) member for the activity "{ACTIVITY_NAME}". Please review and endorse the activity before it can be submitted for approval. |
| 繁中 | 活動認可提醒 | 您已被列為活動「{ACTIVITY_NAME}」的籌備委員會（OC）成員。請審閱並予以認可，該活動方可提交正式審批流程。 |
| 简中 | 活动认可提醒 | 您已被列为活动「{ACTIVITY_NAME}」的组委会（OC）成员。请审阅并认可此活动，以便提交正式审批流程。 |

#### 4.1.2 活动修改后需重新认可
- 触发：活动草稿内容修改后，原 OC 认可不再有效。
- 接收人：需重新认可的 OC 成员。

| 语言 | 标题 | 正文 |
| --- | --- | --- |
| English | Activity Updated - Re-endorsement Required | "{ACTIVITY_NAME}" has been updated. Consequently, your previous endorsement is no longer valid. Please review the updated details and re-endorse. |
| 繁中 | 活動已更新 - 需重新認可 | 「{ACTIVITY_NAME}」的內容已更新，您先前的認可已不再有效。請重新審閱並予以認可。 |
| 简中 | 活动已更新 - 需重新认可 | 「{ACTIVITY_NAME}」已被更新，您之前的认可已不再有效。请重新审阅并认可。 |

#### 4.1.3 部分 OC 成员已认可
- 触发：某位 OC 成员已认可，其他成员仍需处理。
- 接收人：仍未认可的 OC 成员。

| 语言 | 标题 | 正文 |
| --- | --- | --- |
| English | Activity Awaiting Your Endorsement | {OC_ENDORSER_NAME} has endorsed the activity "{ACTIVITY_NAME}". Your endorsement is now required to proceed. |
| 繁中 | 活動待您認可 | {OC_ENDORSER_NAME} 已認可「{ACTIVITY_NAME}」。請您進行認可，以便後續流程繼續。 |
| 简中 | 活动等待您的认可 | {OC_ENDORSER_NAME} 已认可「{ACTIVITY_NAME}」。等待您认可后方可继续。 |

#### 4.1.4 所有 OC 成员已认可
- 触发：所有 OC 成员均已认可。
- 接收人：所有 OC 成员。

| 语言 | 标题 | 正文 |
| --- | --- | --- |
| English | Activity Ready for Submission | All Organising Committee (OC) members have endorsed "{ACTIVITY_NAME}". Any OC member can now submit it for approval. |
| 繁中 | 活動可提交 | 所有籌備委員會（OC）成員已認可「{ACTIVITY_NAME}」。任何 OC 成員現可提交該活動申請。 |
| 简中 | 活动可提交 | 所有组委会（OC）成员已认可「{ACTIVITY_NAME}」。任何 OC 成员即可提交活动申请。 |

### 4.2 申请提交确认（站内消息 + 邮件）

- 触发：活动申请提交成功并进入审批流程。
- 接收人：所有 OC 成员；样本页面接收人显示为系统角色。
- 问候语：统一使用默认问候语 `Dear User,` / `您好，`。
- 包含字段：活动名称、主办单位、申请人、活动日期。
- 活动名称：三语样本与实际通知均使用活动表单中的英文名称。

| 语言 | 标题 / 邮件主题 | 正文 |
| --- | --- | --- |
| English | Activity Application Submitted | Your activity application has been successfully submitted and is now under review. |
| 繁中 | 活動申請已提交 | 您的活動申請已成功提交，目前正在審核中。 |
| 简中 | 活动申请已提交 | 您的活动申请已提交，目前正在审核中。 |

> 不得继续使用「活动发布申请已提交」或 `activity publish application submitted` 等旧表达。

### 4.3 审批待办（站内消息 + 邮件）

- 接收人：当前审批人。
- 每条待办均包含：活动名称、主办单位、申请人、活动日期、审核链接。审核链接指向对应待办详情页。
- EO 校园场地使用建议通知不显示「申请人」字段，改显示 `Supervisor(s)` / `活動指導` / `活动指导`。
- 「Dean / Delegate 外部嘉宾认可（Guest Endorsement）」「赞助审批」两个环节暂时停用，不在样本或真实发送中启用；VPRD / VPRD Delegate「嘉宾最终审批」仍按下表发送。
- IRG / VPSLA 文案统一使用 assessment / recommendation / review / confirmation，不得出现 vote、cast vote、VP group selection。
- VPSLA 成员评审通知的 Note 前须保留一个空行。

| 审批环节 | English 标题 / 正文 | 繁中标题 / 正文 | 简中标题 / 正文 |
| --- | --- | --- | --- |
| Coordinator 活动申请分配 | Activity Review Pending Assignment / An activity application has been submitted and is awaiting your assignment to the Checker and Supervisor(s). Kindly review and take necessary action via the link below. | 活動申請待分配 / 有一項活動申請已提交，正等待您分配初審員（Checker）及活動指導（Supervisor）。請點擊下方連結進行分配。 | 活动申请待分配 / 有一项活动申请已提交，正等待您分配初审员（Checker）和活动指导（Supervisor）。请点击下方链接进行分配。 |
| EO 校园场地使用建议 | Advice Required on Campus Venue Usage / An activity application has been submitted, and the Supervisor has invited you to provide professional advice on campus venue usage. Kindly review and provide your input via the link below. | 校園場地使用待提供意見 / 有一項活動申請已提交，活動指導（Supervisor）邀請您就校園場地使用提供意見。請點擊下方連結進行審閱並提供建議。 | 校园场地使用待提供意见 / 有一项活动申请已提交，活动指导（Supervisor）邀请您就校园场地使用提供意见。请点击下方链接进行审阅并提供建议。 |
| Checker 审核 | Activity Pending Review / An activity application has been submitted and is awaiting your review. Kindly review the details and proceed via the link below. | 活動申請待審核 / 有一項活動申請已提交，正等待您進行審核。請點擊下方連結審閱詳情。 | 活动申请待审核 / 有一项活动申请已提交，正等待您进行审核。请点击下方链接审阅详情。 |
| Supervisor 审核 | Activity Pending Review / An activity application has been submitted and is awaiting your review. Kindly review the details and proceed via the link below. | 活動申請待審核 / 有一項活動申請已提交，正等待您進行審核。請點擊下方連結審閱詳情。 | 活动申请待审核 / 有一项活动申请已提交，正等待您进行审核。请点击下方链接审阅详情。 |
| 活动审批 | Activity Pending Review and Approval / An activity application has been submitted and is awaiting your review and approval. Kindly review the details and proceed via the link below. | 活動申請待審批 / 有一項活動申請已提交，正等待您的審批。請點擊下方連結審閱詳情。 | 活动申请待审批 / 有一项活动申请已提交，正等待您的审批。请点击下方链接审阅详情。 |
| IRG 小组选择 | IRG - Sub-group Assignment Required / An activity application is awaiting your assignment to an Independent Review Group (IRG) Sub-group. Kindly review the details and proceed via the link below. | IRG - 活動申請待分配分組 / 有一項活動申請已提交，請為此活動審核分配一個獨立評審小組（IRG）分組。請點擊下方連結進行分配。 | IRG - 活动申请待分配分组 / 有一项活动申请已提交，请为此活动审核分配一个独立评审小组（IRG）分组。请点击下方链接进行分配。 |
| IRG 成员活动评审 | IRG - Activity Pending Assessment / An activity application is awaiting your assessment as an Independent Review Group (IRG) member. Kindly review the details and submit your recommendation via the link below. | IRG - 活動獨立評審待處理 / 有一項活動申請等待您作為獨立評審小組（IRG）成員進行評審。請點擊下方連結審閱詳情並提交您的評審建議。 | IRG - 活动独立评审待处理 / 有一项活动申请等待您作为独立评审小组（IRG）成员进行评审。请点击下方链接审阅详情并提交您的评审建议。 |
| IRG 摘要审阅 | IRG - Review Summary Ready for Confirmation / The Independent Review Group (IRG) review period has concluded. Kindly review and confirm the summary for the Vetting Panel of Student-led Activities (VPSLA) via the link below. | IRG - 評審摘要待確認 / 獨立評審小組（IRG）評審階段已完成。請點擊下方連結審閱評審摘要，並確認提交予學生主導活動審核小組（VPSLA）。 | IRG - 评审摘要待确认 / 独立评审小组（IRG）评审阶段已完成。请点击下方链接审阅评审摘要，并确认提交予学生主导活动审核小组（VPSLA）。 |
| VPSLA 小组选择 | VPSLA - Activity Review and Confirmation Required / There are activity application(s) awaiting your confirmation to be passed to the VPSLA for further review. Kindly review and proceed via the link below. | VPSLA - 活動申請待確認放行 / 活動申請正等待您確認放行予學生主導活動審核小組（VPSLA）進行後續審核。請點擊下方連結進行審閱與確認。 | VPSLA - 活动申请待确认放行 / 活动申请正等待您确认放行予学生主导活动审核小组（VPSLA）进行后续审核。请点击下方链接进行审阅与确认。 |
| VPSLA 成员评审 | VPSLA - Activity Pending Review / Activity application(s) are awaiting your review as a Vetting Panel of Student-led Activities (VPSLA) member. Kindly review the details and submit your recommendation via the link below. Note: You may only submit your recommendation after the Independent Review Group (IRG) has completed the assessment. | VPSLA 評審待處理 / 活動申請正等待您作為學生主導活動審核小組（VPSLA）成員進行評審。請點擊下方連結審閱詳情並提交您的評審建議。注意：您必須在獨立評審小組（IRG）完成評審後，方可提交您的評審建議。 | VPSLA - 评审待处理 / 活动申请等待您作为学生主导活动审核小组（VPSLA）成员进行评审。请点击下方链接审阅详情并提交您的评审建议。注意：您必须在独立评审小组（IRG）完成评审后，方可提交您的评审建议。 |
| VPSLA 共识检查 | VPSLA - Consensus Check Required / The VPSLA review period has concluded. Please verify the consensus and determine the subsequent action via the link below. | VPSLA - 共識檢查待處理 / 學生主導活動審核小組（VPSLA）的評審已完成。請點擊下方連結檢查小組共識並進行後續處理。 | VPSLA - 共识检查待处理 / 学生主导活动审核小组（VPSLA）的评审已完成。请点击下方链接检查小组共识并进行后续处理。 |
| Chairperson 决定 | VPSLA - Chairperson Decision Required / Activity application(s) are awaiting your decision as Chairperson of the Vetting Panel of Student-led Activities. Kindly review the details and proceed via the link below. | VPSLA - 主席決議待處理 / 活動申請正等待您作為學生主導活動審核小組（VPSLA）的主席做出最終決議。請點擊下方連結審閱詳情並提交您的決定。 | VPSLA - 主席决议待处理 / 活动申请正等待您作为学生主导活动审核小组（VPSLA）的主席做出最终决议。请点击下方链接审阅详情并提交您的决定。 |
| VPRD / VPRD Delegate 嘉宾最终审批 | SLA - External Guest Final Review Required / An activity external guest invitation list is awaiting your final review. Kindly review the details and proceed via the link below. | 學生主導活動嘉賓名單待最終審閱 / 一項學生主導活動的外部嘉賓邀請名單正等待您進行最終審閱。請點擊下方連結審閱詳情。 | 学生主导活动嘉宾名单待最终审阅 / 一项学生主导活动的外部嘉宾邀请名单正等待您进行最终审阅。请点击下方链接审阅详情。 |

### 4.4 审批结果（站内消息 + 邮件）

- 接收人：**所有 OC 成员**。
- 问候语：统一使用默认问候语 `Dear User,` / `您好，`。
- 包含字段：活动名称、申请人、审核结果、审核时间，以及通过时的审核意见 / 拒绝退回时的原因；不显示审核人。
- 审核意见 / 原因字段直接显示审核详情 URL。

#### 4.4.1 审批通过

| 语言 | 标题 / 邮件主题 | 正文 | 结果值 |
| --- | --- | --- | --- |
| English | Activity Approved | Your activity application has been approved. Please proceed with submitting the activity promotion application. | Approved |
| 繁中 | 活動審批通過 | 您的活動申請已通過審批。請繼續提交活動宣傳申請。 | 已通過 |
| 简中 | 活动审批通过 | 您的活动申请已通过审批。请继续提交活动宣传申请。 | 已通过 |

#### 4.4.2 审批拒绝

| 语言 | 标题 / 邮件主题 | 正文 | 结果值 |
| --- | --- | --- | --- |
| English | Activity Application Rejected | Your activity application has been rejected. Please review the comments below for details. If you wish to proceed, please submit a new application. | Rejected |
| 繁中 | 活動申請已被拒 | 您的活動申請已被拒絕，請查看下方的審批意見以瞭解詳情。若要繼續辦理，需另行發起全新申請。 | 已拒絕 |
| 简中 | 活动申请已被拒 | 您的活动申请已被拒绝。请查看下方的审批意见以了解详情。若要继续办理，需另行发起全新申请。 | 已拒绝 |

> 拒绝后**不得**提示「修改后重新提交当前申请」。如需继续办理，须发起全新申请。

#### 4.4.3 退回修改

| 语言 | 标题 / 邮件主题 | 正文 | 结果值 |
| --- | --- | --- | --- |
| English | Activity Application Returned for Revision | Your activity application has been returned for revision. Please review the comments below, make the necessary amendments, and resubmit via the system. | Returned |
| 繁中 | 活動申請被退回修改 | 您的活動申請已被退回修改。請查看下方的審批意見，修正相關內容後重新提交申請。 | 已退回 |
| 简中 | 活动申请被退回修改 | 您的活动申请已被退回修改。请查看下方的审批意见，修正相关内容后重新提交申请。 | 已退回 |

> 退回与拒绝不同：退回**允许**提示修改后重新提交本申请。

### 4.5 已参与审批人员同步通知（邮件 BCC）

- 用途：将发给 OC 成员的审批结果同步给所有已参与审批人员。
- 接收人：所有已参与审批人员；迎新活动同样需要发送同步通知。
- 邮件发送：同步邮件以 BCC 方式发送给已参与审批人员，避免公开其他审批人的收件地址；不向已参与审批人员额外发送站内消息。
- 内容规则：直接复用第 4.4 节审批结果通知格式，即默认问候语、无 Reviewer 字段，Comments / Reason 直接显示审核详情 URL。

#### 4.5.1 审批通过同步

| 语言 | 标题 / 邮件主题 | 正文 | 结果值 |
| --- | --- | --- | --- |
| English | Activity Approved | Your activity application has been approved. Please proceed with submitting the activity promotion application. | Approved |
| 繁中 | 活動審批通過 | 您的活動申請已通過審批。請繼續提交活動宣傳申請。 | 已通過 |
| 简中 | 活动审批通过 | 您的活动申请已通过审批。请继续提交活动宣传申请。 | 已通过 |

#### 4.5.2 审批拒绝同步

| 语言 | 标题 / 邮件主题 | 正文 | 结果值 |
| --- | --- | --- | --- |
| English | Activity Application Rejected | Your activity application has been rejected. Please review the comments below for details. If you wish to proceed, please submit a new application. | Rejected |
| 繁中 | 活動申請已被拒 | 您的活動申請已被拒絕，請查看下方的審批意見以瞭解詳情。若要繼續辦理，需另行發起全新申請。 | 已拒絕 |
| 简中 | 活动申请已被拒 | 您的活动申请已被拒绝。请查看下方的审批意见以了解详情。若要继续办理，需另行发起全新申请。 | 已拒绝 |

#### 4.5.3 退回修改同步

| 语言 | 标题 / 邮件主题 | 正文 | 结果值 |
| --- | --- | --- | --- |
| English | Activity Application Returned for Revision | Your activity application has been returned for revision. Please review the comments below, make the necessary amendments, and resubmit via the system. | Returned |
| 繁中 | 活動申請被退回修改 | 您的活動申請已被退回修改。請查看下方的審批意見，修正相關內容後重新提交申請。 | 已退回 |
| 简中 | 活动申请被退回修改 | 您的活动申请已被退回修改。请查看下方的审批意见，修正相关内容后重新提交申请。 | 已退回 |

### 4.6 已移除通知

第 4.6 节原「活动发布成功」通知已按 2026-07-01 修订意见移除，不在样本或真实发送中启用。

---

## 5. 通用规则

### 5.1 变量

| 变量 | 含义 | 示例 |
| --- | --- | --- |
| `{ACTIVITY_NAME}` | 活动名称 | Campus Music Night 2026 |
| `{ORGANISATION_NAME}` | 主办单位名称 | Singing Club |
| `{APPLICANT_NAME}` | 申请人名称 | Alex Chan |
| `{ACTIVITY_DATE}` | 活动日期 | 2026-09-15 19:00 - 2026-09-15 21:30 |
| `{REVIEW_LINK}` | 审核链接 | https://slas.example.edu.hk/activity-approval/review/100 |
| `{RESULT}` | 审核结果 | Approved |
| `{REVIEW_TIME}` | 审核时间 | 2026-06-01 19:45:00 |
| `{COMMENT_URL}` | 审批意见链接 | https://slas.example.edu.hk/#/bpm/my-todo |
| `{REASON_URL}` | 拒绝或退回原因链接 | https://slas.example.edu.hk/#/bpm/my-todo |
| `{OC_ENDORSER_NAME}` | 已认可的 OC 成员姓名 | Chris Wong |

### 5.2 字段标签（三语）

| 字段 | English | 繁中 | 简中 |
| --- | --- | --- | --- |
| 默认问候语 | Dear User, | 您好， | 您好， |
| 带姓名问候语 | Dear `%s`, | `%s` 您好， | `%s` 您好， |
| 活动名称 | Activity Name | 活動名稱 | 活动名称 |
| 主办单位 | Organising Unit | 主辦單位名稱 | 主办单位名称 |
| 申请人 | Applicant | 申請人 | 申请人 |
| 活动指导 | Supervisor(s) | 活動指導 | 活动指导 |
| 活动日期 | Activity Date | 活動日期 | 活动日期 |
| 审核链接 | Review Link | 審核連結 | 审核链接 |
| 审核结果 | Result | 審核結果 | 审核结果 |
| 审核时间 | Review Time | 審核時間 | 审核时间 |
| 审核意见 | Comments | 審核意見 | 审核意见 |
| 原因 | Reason | 原因 | 原因 |
| 通过 | Approved | 已批准 | 已通过 |
| 拒绝 | Rejected | 已拒絕 | 已拒绝 |
| 退回 | Returned | 已退回 | 已退回 |

### 5.3 站内消息展示顺序

1. 通知标题
2. 问候语
3. 正文固定文案
4. 活动信息与审批信息

### 5.4 邮件展示顺序

1. 邮件主题
2. 免回复声明，置中显示
3. 问候语
4. 正文固定文案
5. 活动信息与审批信息
6. 系统页脚

### 5.5 通知样本语言切换

Workflow Notification Samples 页面中的通知语言切换按钮只作用于通知标题与通知内容。切换 English / 繁体中文 / 简体中文样本时，不得联动或改变 SLAS 全站界面语言。

### 5.6 免回复声明与系统页脚

免回复声明：

| 语言 | 文案 |
| --- | --- |
| English | This is a system-generated message from the Student-led Activities System (SLAS). Please do not reply. |
| 繁中 | 本郵件由學生主導活動系統 (SLAS) 自動生成，請勿直接回覆。 |
| 简中 | 本邮件由学生主导活动系统 (SLAS) 自动生成，请勿直接回复。 |

系统页脚（繁中 / 简中照录 docx 原文；English 为对应翻译）：

| 语言 | 页脚 |
| --- | --- |
| English | For enquiries, please email student-led@eduhk.hk.<br>Student-led Activities System<br>This is a system-generated message from The Education University of Hong Kong. This message (including any attachments) may contain confidential, proprietary, privileged and/or private information, intended solely for the use of the individual(s) or entity named above. If you are not the intended recipient, please notify our support team immediately and delete this message and all its attachments. Please note that any disclosure, copying, distribution or other use of this message or any attachment by an unintended recipient is strictly prohibited. |
| 繁中 | 如有查詢，請電郵至 student-led@eduhk.hk。<br>學生主導活動系統<br>本郵件為香港教育大學系統自動生成的訊息。本訊息（包括任何附件）可能包含機密、專利、受特權保護及/或私隱的資訊，僅供上述指定的個人或實體使用。若您並非本訊息的預期接收者，請立即通知我們的支援團隊，並刪除本訊息及其所有附件。特此聲明，非預期接收者對本訊息或任何附件的任何披露、複製、分發或其他使用行為均被嚴格禁止。 |
| 简中 | 如有查询，请电邮至 student-led@eduhk.hk。<br>学生主导活动系统<br>本邮件为香港教育大学系统自动生成的讯息。本讯息（包括任何附件）可能包含机密、专利、受特权保护及/或隐私的信息，仅供上述指定的个人或实体使用。若您并非本讯息的预期接收者，请立即通知我们的支援团队，并删除本讯息及其所有附件。特此声明，非预期接收者对本讯息或任何附件的任何披露、复制、分发或其他使用行为均被严格禁止。 |
