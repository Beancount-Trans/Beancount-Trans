# Beancount-Trans for DeepSeek Harness

把 [Beancount-Trans](https://github.com/Beancount-Trans/Beancount-Trans) 的只读账本 MCP 服务接入 DeepSeek Harness，并提供一个只做账本分析的 Agent 预设。

## 安装

1. 在 Beancount-Trans 平台创建访问令牌（`设置 → 访问令牌`，scope `ledger:read`），复制明文令牌。
2. 启动 Harness 前设置环境变量：

   ```bash
   export BCT_MCP_TOKEN='bct_...'
   dsh web
   ```

3. 安装本目录：

   ```text
   plugin_manager install_bundle target="/absolute/path/to/dsh-plugin"
   ```

   或发布到 npm，由插件市场索引收录后从 Discover 安装。

自托管用户不要直接改本目录里的 `cordis.patch.yml`（升级会被覆盖），而是在 profile patch 里用同一 `id: mcp-bct` 的覆盖项把 `url` 指向自己的实例，例如 `http://127.0.0.1:8000/mcp`。

## 使用

- 新建会话时选择 **Beancount-Trans 账本** 预设，即可使用账本分析技能；宿主层的 `mcp__bct__*` 工具在所有会话都可用。
- 技能：`ledger-overview`（账本概览）、`monthly-review`（月度复盘）、`insight-review`（洞察复盘）。
- 资源：`ledger://accounts`、`ledger://tags`、`ledger://bql-reference`、`ledger://main.bean`。

## 安全

- 令牌只读（`ledger:read`），不会写入账本。
- 不要把令牌写进 `cordis.patch.yml` 或提交到仓库；本目录只通过环境变量读取。
- 需要覆盖本机连接配置时，在 profile patch 里用同一 `id: mcp-bct` 的覆盖项（不要新增 `insert`，否则会出现重复的 `serverName`）。

## 组成

| 行 | 作用 |
|---|---|
| `mcp-bct` | `@deepseek-ai/dsh-mcp-client`，连接 `/mcp` |
| `preset-beancount` | `@deepseek-ai/dsh-agent-preset`，挂载技能、文件、交付与提问工具 |

技能只写工作流与判断规则；BQL 语法、账户目录和标签目录始终由 MCP 资源提供，避免两处漂移。

## 发布

`package.json` 目前是 `private: true` 且使用未加 scope 的名字，便于本地安装。发布到 npm 前请改成你拥有的 scope（如 `@dhr2333/beancount-trans-dsh`）并移除 `private`。
