---
name: ledger-overview
description: 快速查看 Beancount-Trans 账本现状：资产/负债余额、本月收支与结余、支出 TOP 类目和最近大额交易。
whenToUse: 用户问“我的账本怎么样”“现在有多少钱”“本月花了多少”，或需要一份简短的账本快照。
---

# 账本概览

## 前置

1. 调用 `get_ledger_context`（工具名 `mcp__bct__get_ledger_context`），拿到基准日期、默认货币、账户/标签目录与 BQL 规则。同一会话里已调用过可复用。
2. 账户路径只能来自目录；用户说“餐饮”“交通”时映射到目录中的实际路径。
3. 余额、累计收支等无时间范围的口径必须加上界 `date <= 基准日期`，排除未来预记账条目。

## 取数

按顺序执行，全部用 `run_bql`：

1. 资产余额（按账户）：

   ```sql
   SELECT account, sum(units(position)) WHERE account ~ '^Assets' AND date <= YYYY-MM-DD GROUP BY account
   ```

2. 负债欠款（按账户）：

   ```sql
   SELECT account, sum(units(position)) WHERE account ~ '^Liabilities' AND date <= YYYY-MM-DD GROUP BY account
   ```

3. 本月收入、支出：

   ```sql
   SELECT sum(units(position)) WHERE account ~ '^Income' AND year = YYYY AND month = M
   SELECT sum(units(position)) WHERE account ~ '^Expenses' AND year = YYYY AND month = M
   ```

   收入结果通常为负，展示时取绝对值；结余 = 收入绝对值 − 支出，两个聚合结果可以直接相减。

4. 本月支出 TOP 类目：

   ```sql
   SELECT account, sum(units(position)) WHERE account ~ '^Expenses' AND year = YYYY AND month = M GROUP BY account ORDER BY sum(units(position)) DESC
   ```

5. 最近大额支出：

   ```sql
   SELECT date, payee, narration, account, units(position) WHERE account ~ '^Expenses' AND year = YYYY AND month = M ORDER BY units(position) DESC LIMIT 8
   ```

## 输出

- 一张概览表：总资产、总负债、本月收入、本月支出、结余。
- 一张支出类目表：类目、金额、占比（占比只对已查到的类目总额做除法）。
- 最多 3 条最近大额交易。
- 结尾用一句话指出最值得注意的一项，不要展开成长篇分析。

## 约束

- 金额全部来自查询结果；禁止对明细行心算汇总。
- 父账户行只含直接 posting；类目总额用前缀 `account ~ '^Expenses:...'` 的 `sum`。
- 结果为“已截断”时改用 `GROUP BY` 聚合重查，不要对截断样本求和。
- 查询失败或空结果时最多换一次更宽的账户前缀；余额为 0 时直接说 0，不要反复换语法。
