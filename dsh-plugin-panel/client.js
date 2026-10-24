window.__ModuleLoader__.load({
  id: 'beancount-trans-panel',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Locale namespace owned by this plugin. */
    const NS = 'beancount-panel';
    /** One id addresses both the sidebar row and the main panel. */
    const PANEL_ID = 'beancount-ledger';

    const ZH = {
      'title': '账本',
      'subtitle': 'Beancount-Trans · 只读账本',
      'intro': '把下面的问题带入新会话，回答只基于 MCP 工具返回的真实账本数据。',
      'quick.title': '快捷提问',
      'quick.action': '带入新会话',
      'quick.monthly.title': '月度复盘',
      'quick.monthly.text': '梳理本月收支结构、环比变化最大的分类，并给出下月预算建议。',
      'quick.monthly.prompt': '请对这个月的账本做一次月度复盘：先取本月收入与支出汇总，再列出环比变化最大的三个分类，并给出下月预算建议。涉及金额、占比或排名时先取数，不要凭印象回答。',
      'quick.insight.title': '消费洞察',
      'quick.insight.text': '找出最近 90 天占比最高的分类、增长最快的标签和值得注意的支出。',
      'quick.insight.prompt': '请分析最近 90 天的消费结构：列出占比最高的五个分类、增长最快的三个标签，并指出三笔最值得注意的支出及原因。先取数再回答；收入与负债按绝对值展示并说明口径。',
      'quick.overview.title': '账本概览',
      'quick.overview.text': '概述账户结构、主要货币、标签体系与数据覆盖的时间范围。',
      'quick.overview.prompt': '请先读取 ledger://accounts 与 ledger://tags 资源，概述当前账本的账户结构、主要货币、标签体系以及数据覆盖的时间范围。',
      'res.title': '账本资源',
      'res.accounts': '账户目录',
      'res.tags': '标签目录',
      'res.bql': 'BQL 参考',
      'res.main': '主账本文件',
      'footer': '工具 mcp__bct__* · 令牌 scope ledger:read',
    };

    const EN = {
      'title': 'Ledger',
      'subtitle': 'Beancount-Trans · read-only ledger',
      'intro': 'Send one of these questions into a new session; answers are grounded only in the ledger data returned by the MCP tools.',
      'quick.title': 'Quick questions',
      'quick.action': 'Open in a new session',
      'quick.monthly.title': 'Monthly review',
      'quick.monthly.text': 'Summarize this month’s income and expenses, the categories that moved most, and a budget for next month.',
      'quick.monthly.prompt': 'Run a monthly review on this month’s ledger: summarize income and expenses, list the three categories that changed most month over month, and propose a budget for next month. Query the data first; never guess amounts, shares or rankings.',
      'quick.insight.title': 'Spending insight',
      'quick.insight.text': 'Find the top categories, the fastest-growing tags and the notable transactions of the last 90 days.',
      'quick.insight.prompt': 'Analyze the last 90 days of spending: list the top five categories by share, the three fastest-growing tags, and three notable transactions with reasons. Query the data first and show income and liabilities as absolute values with the convention stated.',
      'quick.overview.title': 'Ledger overview',
      'quick.overview.text': 'Outline the account structure, main currencies, tag system and the covered time range.',
      'quick.overview.prompt': 'Read the ledger://accounts and ledger://tags resources first, then summarize the account structure, main currencies, tag system and the time range the ledger covers.',
      'res.title': 'Ledger resources',
      'res.accounts': 'Account catalog',
      'res.tags': 'Tag catalog',
      'res.bql': 'BQL reference',
      'res.main': 'Main ledger file',
      'footer': 'Tools mcp__bct__* · token scope ledger:read',
    };

    /** The sidebar glyph; the row supplies its size and active state. */
    function Glyph(props) {
      const size = typeof props.size === 'number' && props.size > 0 ? props.size : 18;
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          'aria-hidden': 'true',
          focusable: 'false',
          style: { display: 'block' },
        },
        h('rect', {
          x: 4.75,
          y: 3.75,
          width: 14.5,
          height: 16.5,
          rx: 2.75,
          stroke: 'currentColor',
          strokeWidth: 1.5,
        }),
        h('path', {
          d: 'M9.2 8 12 11.15 14.8 8',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M12 11.15v5.4M9.4 12.9h5.2M9.4 15.1h5.2',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
        }),
      );
    }

    /** Panel styles: theme tokens only, inline so unmounting leaves nothing behind. */
    const S = {
      root: {
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
        background: 'var(--dsw-alias-bg-base)',
        color: 'var(--dsw-alias-label-primary)',
        padding: '40px clamp(20px, 6vw, 72px) 56px',
      },
      inner: {
        width: '100%',
        maxWidth: 880,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
      },
      head: { display: 'flex', alignItems: 'center', gap: 14 },
      mark: {
        width: 44,
        height: 44,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        color: 'var(--dsw-alias-brand-primary)',
        background:
          'color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, var(--dsw-alias-bg-layer-1))',
      },
      title: {
        margin: 0,
        fontSize: 22,
        lineHeight: '28px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      subtitle: {
        margin: '2px 0 0',
        fontSize: 13,
        lineHeight: '18px',
        color: 'var(--dsw-alias-label-secondary)',
      },
      intro: {
        margin: 0,
        maxWidth: 660,
        fontSize: 14,
        lineHeight: '22px',
        color: 'var(--dsw-alias-label-secondary)',
      },
      section: { display: 'flex', flexDirection: 'column', gap: 12 },
      sectionTitle: {
        margin: 0,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.01em',
        color: 'var(--dsw-alias-label-secondary)',
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(232px, 1fr))',
        gap: 12,
      },
      card: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '16px 16px 14px',
        borderRadius: 12,
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-layer-1)',
        transition: 'border-color 120ms ease',
      },
      cardHover: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '16px 16px 14px',
        borderRadius: 12,
        border: '1px solid var(--dsw-alias-brand-primary)',
        background: 'var(--dsw-alias-bg-layer-1)',
        transition: 'border-color 120ms ease',
      },
      cardTitle: { margin: 0, fontSize: 14, lineHeight: '20px', fontWeight: 600 },
      cardText: {
        margin: 0,
        flex: 1,
        fontSize: 13,
        lineHeight: '20px',
        color: 'var(--dsw-alias-label-secondary)',
      },
      button: {
        alignSelf: 'flex-start',
        marginTop: 6,
        padding: '6px 12px',
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-border-l2)',
        background: 'transparent',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: 13,
        lineHeight: '18px',
        cursor: 'pointer',
      },
      buttonHover: {
        alignSelf: 'flex-start',
        marginTop: 6,
        padding: '6px 12px',
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-brand-primary)',
        background:
          'color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, var(--dsw-alias-bg-layer-1))',
        color: 'var(--dsw-alias-brand-primary)',
        font: 'inherit',
        fontSize: 13,
        lineHeight: '18px',
        cursor: 'pointer',
      },
      resource: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: '10px 12px',
        borderRadius: 10,
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-layer-1)',
      },
      resourceUri: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        fontSize: 12,
        lineHeight: '18px',
        color: 'var(--dsw-alias-brand-primary)',
      },
      resourceLabel: {
        fontSize: 12,
        lineHeight: '18px',
        color: 'var(--dsw-alias-label-secondary)',
      },
      footer: {
        paddingTop: 16,
        borderTop: '1px solid var(--dsw-alias-border-l1)',
        fontSize: 12,
        lineHeight: '18px',
        color: 'var(--dsw-alias-label-secondary)',
      },
    };

    /** One quick question: title, one-line summary and a working copy of the prompt. */
    function QuickCard(props) {
      const [hover, setHover] = React.useState(false);
      const [buttonHover, setButtonHover] = React.useState(false);
      return h(
        'article',
        {
          style: hover ? S.cardHover : S.card,
          onMouseEnter: () => setHover(true),
          onMouseLeave: () => setHover(false),
        },
        h('h3', { style: S.cardTitle }, props.title),
        h('p', { style: S.cardText }, props.text),
        h(
          'button',
          {
            type: 'button',
            'aria-label': props.title + ' · ' + props.action,
            style: buttonHover ? S.buttonHover : S.button,
            onMouseEnter: () => setButtonHover(true),
            onMouseLeave: () => setButtonHover(false),
            onClick: props.onOpen,
          },
          props.action,
        ),
      );
    }

    return {
      inject: ['slots', 'locale', 'uiWorkspace'],
      apply(ctx) {
        const slots = ctx.slots;
        const locale = ctx.locale;
        const uiWorkspace = ctx.uiWorkspace;
        const t = locale.bind(NS);
        const subscribeLocale = listener => locale.subscribe(listener);
        const readLocale = () => locale.getLocale();

        function LedgerPanel() {
          React.useSyncExternalStore(subscribeLocale, readLocale);
          const tr = locale.bind(NS);
          const openPrompt = prompt => {
            uiWorkspace.startSession(undefined, { prompt, whenDraftExists: 'keep' });
          };
          const cards = [
            {
              key: 'monthly',
              title: tr('quick.monthly.title'),
              text: tr('quick.monthly.text'),
              prompt: tr('quick.monthly.prompt'),
            },
            {
              key: 'insight',
              title: tr('quick.insight.title'),
              text: tr('quick.insight.text'),
              prompt: tr('quick.insight.prompt'),
            },
            {
              key: 'overview',
              title: tr('quick.overview.title'),
              text: tr('quick.overview.text'),
              prompt: tr('quick.overview.prompt'),
            },
          ];
          const resources = [
            { uri: 'ledger://accounts', label: tr('res.accounts') },
            { uri: 'ledger://tags', label: tr('res.tags') },
            { uri: 'ledger://bql-reference', label: tr('res.bql') },
            { uri: 'ledger://main.bean', label: tr('res.main') },
          ];
          return h(
            'div',
            { style: S.root },
            h(
              'div',
              { style: S.inner },
              h(
                'header',
                { style: S.head },
                h('span', { style: S.mark }, h(Glyph, { size: 22 })),
                h(
                  'div',
                  null,
                  h('h1', { style: S.title }, tr('title')),
                  h('p', { style: S.subtitle }, tr('subtitle')),
                ),
              ),
              h('p', { style: S.intro }, tr('intro')),
              h(
                'section',
                { style: S.section, 'aria-labelledby': 'beancount-panel-quick' },
                h(
                  'h2',
                  { id: 'beancount-panel-quick', style: S.sectionTitle },
                  tr('quick.title'),
                ),
                h(
                  'div',
                  { style: S.grid },
                  cards.map(card =>
                    h(QuickCard, {
                      key: card.key,
                      title: card.title,
                      text: card.text,
                      action: tr('quick.action'),
                      onOpen: () => openPrompt(card.prompt),
                    }),
                  ),
                ),
              ),
              h(
                'section',
                { style: S.section, 'aria-labelledby': 'beancount-panel-resources' },
                h(
                  'h2',
                  { id: 'beancount-panel-resources', style: S.sectionTitle },
                  tr('res.title'),
                ),
                h(
                  'div',
                  { style: S.grid },
                  resources.map(resource =>
                    h(
                      'div',
                      { key: resource.uri, style: S.resource },
                      h('code', { style: S.resourceUri }, resource.uri),
                      h('span', { style: S.resourceLabel }, resource.label),
                    ),
                  ),
                ),
              ),
              h('footer', { style: S.footer }, tr('footer')),
            ),
          );
        }

        ctx.effect(
          () => {
            const disposeZh = locale.register(NS, 'zh', ZH);
            const disposeEn = locale.register(NS, 'en', EN);
            return () => {
              disposeEn();
              disposeZh();
            };
          },
          'beancount-panel: dictionaries',
        );

        ctx.effect(
          () =>
            slots.inject('main', () =>
              slots.register({ name: 'main', key: PANEL_ID }, LedgerPanel),
            ),
          'beancount-panel: main panel',
        );

        ctx.effect(
          () =>
            slots.inject('sidebar.panellist', () =>
              slots.register(
                {
                  name: 'sidebar.panellist',
                  id: PANEL_ID,
                  order: 15,
                  label: () => t('title'),
                },
                Glyph,
              ),
            ),
          'beancount-panel: sidebar entry',
        );
      },
    };
  },
});
