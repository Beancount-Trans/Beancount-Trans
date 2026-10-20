---
name: insight-review
description: 对 Beancount-Trans 账本做洞察复盘：先跨期对比发现线索，再沿 payee、标签或 link 追溯，输出少量但有数据故事的消费洞察。
whenToUse: 用户要求“分析一下消费习惯”“有什么发现/趋势/亮点”“帮我看看账本”，或需要一份探索性而非罗列式的分析。
---

# 洞察复盘

目标不是把科目表念一遍，而是找出 2–3 条**有数字、可追溯、值得说**的线索。

## 前置

1. 调用 `get_ledger_context`（`mcp__bct__get_ledger_context`），拿到基准日期、账户/标签目录与 BQL 规则。
2. 需要更完整的语法时读 `ledger://bql-reference` 资源；账户路径以 `ledger://accounts` 为准。
3. 时间范围按用户说法换算：本月/上月用 `year` + `month`，最近 N 个月用 `date >=`。

## 工作方式

1. **跨期对比**（先看趋势，不急着下结论）：

   ```sql
   SELECT year, month, sum(units(position)) WHERE account ~ '^Expenses' AND date >= YYYY-MM-01 GROUP BY year, month
   ```

2. **定位候选线索**（至少覆盖两类维度）：

   - 类目跨月变化：

     ```sql
     SELECT year, month, account, sum(units(position)) WHERE account ~ '^Expenses' AND date >= YYYY-MM-01 GROUP BY year, month, account
     ```

   - 商家（payee）集中度：

     ```sql
     SELECT payee, sum(units(position)) WHERE account ~ '^Expenses' AND date >= YYYY-MM-01 GROUP BY payee ORDER BY sum(units(position)) DESC LIMIT 15
     ```

   - 标签异常或集中：

     ```sql
     SELECT sum(units(position)) WHERE '完整标签路径' IN tags AND account ~ '^Expenses' AND year = YYYY AND month = M
     ```

3. **追溯 1–2 条线索**：对候选线索做二次查询，用 `payee ~`、`narration ~`、`'link-id' IN links` 或具体账户前缀定位到交易行。每条线索最多追 2 次，避免无限展开。
4. **收敛**：保留 2–3 条最有信息量的发现；其余放进一句“其他”即可。

## 输出

- 开头一句话给出本期最值得注意的结论（带数字）。
- 每条洞察写清：现象（数字/时间）、可能原因（有依据的推测要标明是推测）、一条可执行建议。
- 需要举例交易时写日期、payee/narration、金额，均取自查询结果。
- 不要把完整类目表当洞察；不要为了凑数编造趋势。

## 约束

- 所有数字来自 `run_bql`；禁止对明细心算求和。
- 全程控制在约 12 次查询以内；同一 BQL 不要原样重跑，用户要求刷新时除外。
- `tags ~` 和 `links ~` 不支持，标签/链接必须用 `'值' IN tags` / `'值' IN links`。
- 金额过滤用 `number > N`（支出）或 `number < -N`（收入绝对值），不要用 `units(position) > N`。
- 结果为“已截断”时改用 `GROUP BY` 聚合重查。
- 数据不足时直接说明“样本太少，看不出趋势”，不要硬编故事。
