# 账本面板 for DeepSeek Harness

在 DeepSeek Harness Web 的左侧栏加入「账本」入口，并在主区提供一个账本面板：三个快捷提问（月度复盘、消费洞察、账本概览）点一下就把问题带入新会话，输入框里预填提示词，不会自动发送。面板同时列出账本 MCP 资源，便于在会话里直接引用。

## 安装

```text
plugin_manager install_bundle target="/absolute/path/to/dsh-plugin-panel"
```

安装后左侧栏出现账本图标；也可以安装同仓库的 `dsh-plugin/`（Beancount-Trans 账本 bundle），由它提供 `mcp-bct` 工具与 `beancount` 分析预设。

## 使用

- 点击左侧栏的账本图标打开面板。
- 在任一卡片上点「带入新会话」：新建（或复用一个空白）会话，并把该问题的提示词填进输入框。
- 面板不指定 Agent 预设，因此单独安装也能用；需要账本分析人格时，在会话顶部把预设切到「Beancount-Trans 账本」。
- 提示词中引用的 `ledger://accounts`、`ledger://tags`、`ledger://bql-reference`、`ledger://main.bean` 由 `mcp-bct` 提供；未安装时这些资源不可用。

## 组成

| 文件 | 作用 |
|---|---|
| `package.json` | bundle 清单；`dsh.bundle.patch` 装载补丁，`dsh.client` 声明 Web 半区 |
| `cordis.patch.yml` | 插入 `beancount-trans-panel` 行 |
| `index.js` | Host 半区（空实现，渲染全部在客户端） |
| `client.js` | 注册 `main` 主面板与 `sidebar.panellist` 左侧栏入口 |
| `locale/zh.json`、`locale/en.json` | 插件管理器里的标题与描述 |
| `icon.svg` | 插件图标 |

## 设计约束

- 只使用 `--dsw-alias-*` 主题 token 与 `color-mix`，不引入任何 Harness Client 包，深浅色主题随宿主切换。
- 面板文案经 `ctx.locale` 注册并通过 `locale.bind()` 读取，切换语言后立即更新；侧栏标签用 thunk 保持同步。
- 注册全部放在 `ctx.effect` 内，插件卸载时槽位、字典一并移除。
- 快捷提问使用 `ctx.uiWorkspace.startSession()`，由宿主负责新建会话与导航。

## 验证

安装后可用 `cordis_inspect_query` 的 `Slots.listSubTree` 检查：`sidebar.panellist` 出现 id `beancount-ledger`，`main` 出现同名 key。视觉与交互（点击带入会话）需在浏览器页面确认。
