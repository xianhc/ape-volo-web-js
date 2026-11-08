# 开发规范

## 环境与命令

环境版本和脚本以 [package.json](../package.json) 为准，命令在仓库根目录执行：

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm test
pnpm build
pnpm preview
```

端口与代理见 `.env.development` 和 [vite.config.js](../vite.config.js)，修改后重启服务。`VITE_*` 会进入客户端构建，不能存放密钥。

## 代码组织

| 目录 | 职责 |
| --- | --- |
| `src/views/` | 页面与私有组件 |
| `src/api/` | 接口封装与数据适配 |
| `src/components/` | 公共组件，CRUD 放 `crud/` |
| `src/composables/` | 可复用状态与交互 |
| `src/services/` | 请求、会话、存储、导航和主题等公共能力 |
| `src/pinia/` | 跨页面共享状态 |
| `src/style/` | 全局样式与设计变量 |
| `tests/` | 基础回归测试 |

业务分组在 API 与页面中保持一致：`identity/` 管理用户、角色、菜单，`organization/` 管理部门、岗位，`system/job/` 管理作业，`log/jobLog/` 管理作业日志。

## 编码与组件

- 遵循 [ESLint](../eslint.config.mjs) 和 [Prettier](../.prettierrc)：两空格、单引号、无分号、无尾逗号、LF。
- 使用 ESM 和 `<script setup>`；公共组件使用 PascalCase，composable 使用 `useXxx`，页面沿用相邻命名。
- 保留组件输入、事件、默认值与运行时校验；对象和数组默认值保持独立。
- 页面状态就近维护，共享状态放 Pinia，字段转换放 adapter；监听、定时器和外部实例随作用域清理。
- 样式复用 `src/style/design-tokens.scss` 与 UnoCSS，图标使用 `AppIcon` 或 `createIconifyIcon`；检查深浅主题与窄屏。

## 请求与会话

- 业务请求通过 `src/api/` → `src/utils/request.js`，认证使用 `src/api/authClient.js`；页面不创建请求实例或复制刷新逻辑。
- 模块路径不重复添加 `/api`，数据从 `response.data` 读取；分页使用 `pageIndex`、`pageSize`、`sorting`，删除正文使用 `{ ids }`。
- 主键保留字符串；写入按契约显式挑选字段，不提交审计、树节点和运行状态等展示数据。
- 错误由请求层统一反馈，局部接管时设 `errorFeedback: false` 并提供反馈；不输出密码、令牌或完整敏感请求。
- 会话、令牌与持久化复用 `services/session/`、`services/storage/`；保留刷新合并、单次重放和跨账号响应隔离。
- 密码操作复用 `rsaEncrypt.js`，每次操作无缓存读取公钥，加载失败终止提交。

## 页面与交互

- 列表和表单优先复用 `useCrud`、`useTableController`、`useEntityEditor`，导出复用 `useExportAction`。
- 列表传递 `AbortSignal`，新查询或卸载取消旧请求，过期响应不能覆盖当前状态；失败与空数据分别展示。
- 编辑使用独立草稿，取消不污染源数据；保存前校验并防止重复提交，操作失败释放忙碌状态，状态切换失败恢复原值。
- 保留 `defineOptions({ name })` 与动态路由的对应关系；权限使用 `v-has-perm`、`v-has-role`，界面显示不能替代接口授权。
- 内嵌和外链仅接受完整 HTTP/HTTPS 地址，保留 iframe 沙箱与 `no-referrer`。

## 检查

交付执行 `pnpm lint`、`pnpm test`、`pnpm build`，具体边界见 [AGENTS.md](../AGENTS.md)。测试关注行为和已知回归；页面交互检查成功、取消、失败及权限场景，会话检查登录、刷新、退出与跨标签页切换。
