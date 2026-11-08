# 仓库协作约定

本文件适用于整个仓库，开发细则见 [docs/development.md](docs/development.md)。

## 修改边界

- 先检查已有改动，只处理当前任务，不覆盖未提交内容，不做无关重构。
- 以代码、配置和已确认的接口契约为准，不猜测接口或运行结果。
- 使用 JavaScript、ESM 和 Vue `<script setup>`，优先复用现有组件、composable、adapter 和 service。
- 保留组件 props、emits、model 默认值及运行时校验，保留动态路由组件名和权限标识。
- 用户、角色、菜单归 `identity/`，部门、岗位归 `organization/`，作业调度归 `system/job/`。
- 路径大小写必须一致；改名时同时核对磁盘、Git 索引和引用。
- 仅使用 pnpm；依赖变更同步锁文件，并验证 `pnpm install --frozen-lockfile`。
- 不提交凭证、私钥或真实个人数据；不自行提交、推送、发布或操作生产数据。
- 接口、配置或目录职责变化时，同步更新相关文档。

## 验证交付

- 按风险先做相关验证；交付前以有效证据覆盖 `pnpm lint`、`pnpm test`、`pnpm build`，可复用仍有效的结果。
- 会话与权限改动需浏览器验收；列表与表单检查请求取消、过期响应和草稿隔离。
- 行为变更补充定向回归，不为文档或机械改动添加无关测试。
- 说明实际验证及未验证范围，区分 `PASS`、`FAIL`、`BLOCKED`、`NOT RUN`；未连接配套服务时不声称登录、权限或写入已验收。
