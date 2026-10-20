---
name: monthly-review
description: 对 Beancount-Trans 账本做月度复盘：收入/支出/结余、支出类目结构、环比、大额与异常，输出有数字依据的报告。
whenToUse: 用户要求月度/季度复盘、消费报告、收支总结，或问“这个月钱花哪了”“和上月比怎么样”。
---

# 月度复盘

## 前置

1. 调用 `get_ledger_context`（`mcp__bct__get_ledger_context`），确认基准日期、默认货币、账户/标签目录与 BQL 写法。若同一会话里已有这些信息，可直接复用。
2. 账户路径只来自目录；用户说的类别先映射到实际账户前缀（例如“餐饮”→ `^Expenses:Food`），不要臆造子科目。
3. 时间条件用 `year = YYYY AND month = M`；余额/累计口径加 `date <= 基准日期`。

## 取数

按顺序执行，先汇总后明细：

1. 本期收入与支出：

   ```sql
   SELECT sum(units(position)) WHERE account ~ '^Income' AND year = YYYY AND month = M
   SELECT sum(units(position)) WHERE account ~ '^Expenses' AND year = YYYY AND month = M
   ```

2. 本期支出类目结构：

   ```sql
   SELECT account, sum(units(position)) WHERE account ~ '^Expenses' AND year = YYYY AND month = M GROUP BY account ORDER BY sum(units(position)) DESC
   ```

3. 近 6 个月支出趋势（用于环比与走势）：

   ```sql
   SELECT year, month, sum(units(position)) WHERE account ~ '^Expenses' AND date >= YYYY-MM-01 GROUP BY year, month
   ```

4. 大额支出：

   ```sql
   SELECT date, payee, narration, account, units(position) WHERE account ~ '^Expenses' AND year = YYYY AND month = M ORDER BY units(position) DESC LIMIT 10
   ```

5. 需要时再看收入构成或标签维度：

   ```sql
   SELECT account, sum(units(position)) WHERE account ~ '^Income' AND year = YYYY AND month = M GROUP BY account
   SELECT sum(units(position)) WHERE '完整标签路径' IN tags AND account ~ '^Expenses' AND year = YYYY AND month = M
   ```

## 输出

1. **本期概览**：收入、支出、结余（收入取绝对值；结余 = 收入 − 支出）。
2. **支出结构**：前 8 个类目 + 其他，列金额与占比（占比对已查到的类目总额做除法）。
3. **环比**：与上月总额、以及变化最大的两个类目对比，写出两个数字和差额。
4. **观察**：2–3 条，每条都必须带具体数字或日期；没有数据支撑的判断不要写。
5. **建议**：1–2 条，具体到类目或习惯，不要泛泛而谈。

## 约束

- 所有金额来自 `run_bql` 结果；禁止对明细行心算求和，多账户合计用 `sum` + `GROUP BY`。
- 父账户行只含直接 posting；类目总额用前缀 `account ~ '^Expenses:...'` 的 `sum`。
- 收入在账本中为负属正常，展示取绝对值；不要解读为亏损。
- 结果为“已截断”时改用 `GROUP BY` 聚合重查，禁止对截断样本求和。
- 同一问题最多重试一次；仍无结果就基于已有数据回答并说明缺口。
- 若本月无数据，明确说明，不要拿上月数据冒充本月。
