<p align="center">
  <img src="public/logo.png" width="88" alt="Ape-Volo-Admin Logo" />
</p>

<h1 align="center">Ape-Volo-Web-JS</h1>

<p align="center">Ape-Volo-Admin 的 JavaScript 前端版本，基于 Vue 3 与 Element Plus。</p>
<p align="center">集成认证授权、组织管理与常用业务模块，为中后台业务开发提供基础。</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-42b883?style=flat-square" alt="Vue 3.5" />
  <img src="https://img.shields.io/badge/JavaScript-ESM-F7DF1E?style=flat-square" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Element_Plus-2-409EFF?style=flat-square" alt="Element Plus 2" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache--2.0-blue?style=flat-square" alt="Apache License 2.0" /></a>
</p>

## 项目文档

- **系统官网 / 在线文档**：[https://www.apevolo.com](https://www.apevolo.com)
- **仓库开发文档**：[开发规范](docs/development.md)
- **软件著作权**：[查看证书](https://www.apevolo.com/copyright.pdf)

## 在线演示

- **系统预览**：[https://vip.apevolo.com](https://vip.apevolo.com)
- **体验账号**：`apevolo`
- **体验密码**：`123456`

## 项目介绍

Ape-Volo-Admin 是面向管理后台与企业内部业务系统的开源项目系列，覆盖 **C#、Go、Java 三大主流后端语言**，并提供基于 **Vue 3 + Element Plus** 的 **TypeScript 与 JavaScript 双前端版本**。团队可以结合现有技术栈与开发习惯，选择适合自己的版本。

项目内置用户、角色、菜单、部门和岗位管理，集成认证授权、数据权限、文件管理、任务调度、邮件与日志等常用能力。开发者可以复用已有业务模块及 CRUD、表格、表单组件，把精力集中在业务功能开发上。

**本仓库是原项目的 JavaScript 前端版本，仅包含 Web 客户端，不包含后端服务。** 使用普通 JavaScript、ESM 和 Vue `<script setup>`；配套后端及其他版本见[项目系列](#项目系列)。

### 项目特点

- **权限控制**：角色、菜单、按钮权限与数据范围配置。
- **会话认证**：JWT、令牌自动刷新、验证码与锁屏。
- **界面配置**：导航布局、主题切换、多标签页与移动端适配。
- **业务复用**：CRUD、分页、表单与导出组件。

## 功能模块

以下业务功能需要配套后端提供接口支持。

| 模块       | 功能                                                 |
| ---------- | ---------------------------------------------------- |
| 权限与组织 | 用户、角色、菜单、部门、岗位、菜单授权、数据范围配置 |
| 系统管理   | 字典与字典项、系统参数、应用密钥、文件上传与文件记录 |
| 运维管理   | 定时任务配置、启停与执行、服务器监控                 |
| 日志管理   | 操作日志、异常日志、任务执行日志                     |
| 邮件管理   | 邮件账户、邮件模板、发送队列                         |
| 会话管理   | 在线用户查询、导出与强制下线                         |
| 个人中心   | 个人资料、头像、密码、邮箱与界面偏好                 |

## 技术栈

| 层次       | 主要技术                    |
| ---------- | --------------------------- |
| 前端框架   | Vue 3.5、JavaScript、Vite 6 |
| 界面与样式 | Element Plus、UnoCSS、Sass  |
| 状态与请求 | Pinia、Vue Router、Axios    |
| 图表       | ECharts                     |

依赖与脚本维护在 [package.json](package.json)。

## 快速开始

### 1. 环境要求

| 工具    | 项目要求               |
| ------- | ---------------------- |
| Node.js | `^24.0.0` 或 `^26.0.0` |
| pnpm    | 12，项目指定 `12.15.0` |

### 2. 启动前端

先按配套后端仓库的说明启动后端，再在本项目根目录执行：

```bash
pnpm install
pnpm run dev
```

### 3. 访问系统

| 服务     | 默认本地地址          |
| -------- | --------------------- |
| 管理界面 | http://localhost:9001 |
| 后端服务 | http://localhost:9002 |

前端端口与后端代理配置见 [.env.development](.env.development)。修改后端地址或端口时，需同步调整代理并重启前端服务。登录账号以所连接后端的配置为准。

### 4. 构建与检查

```bash
pnpm build    # 生产构建，输出到 dist/
pnpm preview  # 本地预览构建产物
pnpm lint     # 代码规范检查
pnpm test     # 回归测试
```

## 目录结构

```text
ape-volo-web-js/
  src/
    api/                  接口封装与提交数据转换
    views/                业务页面与页面私有组件
      identity/           用户、角色、菜单
      organization/       部门、岗位
      system/job/         作业调度
      log/jobLog/         作业日志
    components/           公共组件与 CRUD
    composables/          表格、表单与导出逻辑
    services/
      http/               请求处理
      session/            登录、令牌刷新与会话管理
      appearance/         主题、布局与界面偏好
      navigation/         导航与标签页逻辑
      feedback/           消息与错误反馈
      storage/            本地存储
      icons/              图标服务
      logging/            客户端诊断与日志上报
    pinia/                全局状态
    router/               路由配置
    directive/            权限等自定义指令
    plugins/              插件与应用能力注册
    assets/               图标等资源
    style/                全局样式与设计变量
    utils/                通用工具
    main.js               应用入口
  public/                 公共静态资源与密码加密公钥
  tests/                  运行时回归测试
  docs/                   开发文档
  .env.development        开发端口与代理配置
  package.json            依赖与开发脚本
  vite.config.js          开发服务与构建配置
```

页面负责业务交互，公共组件和 composable 复用表格、表单逻辑，API 层封装接口，service 层提供请求、会话等公共能力。具体开发约定见 [开发规范](docs/development.md)。

## 项目系列

| 项目                                                                 | 定位                         | 核心技术                                               |
| -------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------ |
| [ape-volo-admin](https://github.com/xianhc/ape-volo-admin)           | 主仓库 · 完整前后端          | .NET 10 + SqlSugar / Vue 3 + TypeScript + Element Plus |
| [ape-volo-admin-go](https://github.com/xianhc/ape-volo-admin-go)     | Go 后端                      | Go + Gin + GORM                                        |
| [ape-volo-admin-java](https://github.com/xianhc/ape-volo-admin-java) | Java 后端                    | Java 25 + Spring Boot 4 + MyBatis-Plus                 |
| **[ape-volo-web-js](https://github.com/xianhc/ape-volo-web-js)**     | **本仓库 · JavaScript 前端** | Vue 3 + JavaScript + Vite + Element Plus               |

## 交流与反馈

[官方网站](https://www.apevolo.com) · [GitHub](https://github.com/xianhc/ape-volo-web-js) · [Gitee](https://gitee.com/xianhc/ape-volo-admin)

QQ 群：`839263566` · 微信：`apevolo`（备注“加群”）

## 版权与授权

**版权所有 © 2022–2026 xianhc。**

本项目采用 [Apache License 2.0](LICENSE)，使用、修改与分发请遵循许可证要求。

Apache License 2.0 允许在遵守许可证条款的前提下使用、修改、商业使用与再分发本项目。

再分发时须提供许可证副本；以源码形式分发衍生作品时，须保留与作品相关的原始版权及署名通知，修改过的文件须显著注明已作修改。完整义务以 [LICENSE](LICENSE) 为准。

商业合作咨询：[apevolo@gmail.com](mailto:apevolo@gmail.com)。
