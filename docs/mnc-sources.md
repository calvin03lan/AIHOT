# MNC 官方源验收记录

探测日期：2026-09-29，当前机器网络。以下为实测，不能视作其他部署网络的保证。

## 第 0 步：原清单 GET 探测

| 公司入口 | HTTP | 字节数 | 拦截 | RSS 线索 |
|---|---:|---:|---|---|
| https://news.abbvie.com/index.php?s=2429&pagetemplate=rss | 200 | 8141 | 否 | 端点本身为 RSS |
| https://lilly.mediaroom.com/index.php?s=9042&pagetemplate=rss | 200 | 6272 | 否 | 端点本身为 RSS |
| https://www.gsk.com/en-gb/media/rss/ | 200 | 1124406 | 否 | 端点本身为 RSS |
| https://www.merck.com/media/news/ | 200 | 115896 | 否 | 无有效新闻 RSS 链接 |
| https://www.roche.com/media | 200 | 401070 | 否 | 无有效新闻 RSS 链接 |
| https://www.novartis.com/news | 200 | 287054 | 否 | 无有效新闻 RSS 链接 |
| https://www.astrazeneca.com/media-centre/press-releases.html | 200 | 165398 | 否 | 无有效新闻 RSS 链接 |
| https://www.sanofi.com/en/media-room | 200 | 203031 | 否 | 无有效新闻 RSS 链接 |
| https://www.bms.com/media/press-releases.html | 200 | 76976 | 否 | 无有效新闻 RSS 链接 |
| https://www.pfizer.com/newsroom/press-releases | 403 | 5665 | 是 | 无有效新闻 RSS 链接 |
| https://www.jnj.com/media-center | 200 | 556 | 是 | 无有效新闻 RSS 链接 |

诺华新闻稿与 ad hoc 共用 `/news` 响应，解析时分别限定两个 tab；所以 12 个逻辑端点对应 11 次原始 GET。

## 实际采用入口及解析结果

| 信源 | 总条数 | 近 30 天 | 最新原始时间 | 状态 |
|---|---:|---:|---|---|
| [mnc-abbvie](https://news.abbvie.com/index.php?s=2429&pagetemplate=rss) | 10 | 10 | Mon, 28 Sep 2026 08:00:00 -0400 | 可解析 |
| [mnc-lilly](https://lilly.mediaroom.com/index.php?s=9042&pagetemplate=rss) | 10 | 10 | Mon, 28 Sep 2026 06:45:00 -0400 | 可解析 |
| [mnc-gsk](https://www.gsk.com/en-gb/media/rss/) | 1640 | 5 | Tue, 15 Sep 2026 14:21:27 GMT | 可解析 |
| [mnc-merck](https://www.merck.com/media/news/) | 10 | 10 | September 28, 2026 | 可解析 |
| [mnc-roche](https://www.roche.com/med_news_xml.xml) | 10 | 9 | Wed, 23 Sep 2026 05:15:00 GMT | 可解析 |
| [mnc-novartis](https://www.novartis.com/news) | 12 | 4 | 2026-09-18T16:51:53Z | 可解析 |
| [mnc-novartis-adhoc](https://www.novartis.com/news) | 12 | 3 | 2026-09-08T07:00:00Z | 可解析 |
| [mnc-astrazeneca](https://www.astrazeneca.com/media-centre/press-releases.html) | 0 | 0 | — | Error: no items matched (html) |
| [mnc-sanofi](https://www.sanofi.com/en/media-room/press-releases) | 20 | 2 | 2026-09-22 | 可解析 |
| [mnc-bms](https://news.bms.com/news/default.aspx) | 0 | 0 | — | Error: HTTP 403 / blocked |
| [mnc-pfizer](https://www.pfizer.com/newsroom/press-releases) | 0 | 0 | — | Error: HTTP 403 / blocked |
| [mnc-jnj](https://www.jnj.com/rss-feed/all) | 25 | 14 | Fri, 25 Sep 2026 11:41:08 GMT | 可解析 |

9 个逻辑源已解析到至少 5 条；部分公司近 30 天实际发稿少于 5 条，不能补造“近期条目”。RSS 或网页首屏不一定覆盖完整 30 天，当前仅对返回条目执行 30 天窗口过滤，不宣称完整历史回补。

- 罗氏：官网 [投资者订阅页](https://www.roche.com/investors/subscribe) 明确提供 `https://www.roche.com/med_news_xml.xml`。优先使用该官方 RSS，保留一手属性。首条为 [2026-09-23 sefaxersen 中期数据](https://www.roche.com/media/releases/med-cor-2026-09-23b)。RHHBY 为美国 OTC ADR，不能统称美股交易所上市。
- 诺华 ad hoc：只解析 `#tab-ad-hoc-releases .each-item`；已提取 [2026-09-08 HARBOR 更新](https://www.novartis.com/news/media-releases/novartis-provides-update-delpacibart-etedesiran-del-desiran-phase-iii-harbor-study-treatment-myotonic-dystrophy-type-1-dm1)，保留原文日期和临床失败事实。没有使用返回 404 的独立 ad hoc 路径。
- 强生：官网 [RSS 说明](https://www.jnj.com/rss) 提供 `/rss-feed/all`；RSS 首条与浏览器媒体页的 2026-09-25 TREMFYA 条目相符。普通 GET 媒体页受限不代表 RSS 不可用。
- 赛诺菲：媒体首页仅有少量卡片，采用实际链接的 `/en/media-room/press-releases`。标题取卡片 `title` 属性，避免误收“Read the Press Release”。路径只用于取得日期，未伪造具体发布时间；原始日期与 UTC 存储值分开保存。
- 默沙东：解析 `.d8-result-item`，标题和日期来自同一卡片；美国 Merck 与德国 Merck KGaA 分开理解。
- **阿斯利康未通过自动采集验收**：静态页没有条目，公开 `filternew.data.json` 请求返回 403。保留源配置，空解析将计失败和告警。
- **BMS 未通过自动采集验收**：主页 iframe 实际指向 `news.bms.com`，浏览器 `/news/default.aspx` 可见多条新闻，但程序 GET 返回 403。旧 RSS 地址返回 HTML，未采用。
- **辉瑞未通过自动采集验收**：浏览器可见 2026-09-28 ESMO 条目，但程序 GET 和 `/newsfeed` 均受限。未把浏览器可见当作自动采集可用。
- 不破解验证码、不绕过反爬。SEC 兜底尚未启用：需要真实机构/邮箱 User-Agent，且 8-K 不能替代全部官方新闻。通讯社专属 feed 未核实，不混入一手清单。

## 运行与边界

- PostgreSQL `articles.raw.mnc` 保存标准记录，包含公司、代码、来源类型、新闻类型、原始时间、UTC 时间、抓取时间、摘要与 SHA-1 去重键；框架继续按规范 URL 唯一性去重及保留修订，不覆盖历史记录。
- 日期只有年月日时不声称知道具体发布时刻或时区；ISO UTC 是用于排序的日级值。
- 正常源 60 分钟，罗氏及诺华 ad hoc 15 分钟。`fixedIntervalMinutes` 防止每日自适应调频放慢；同域名采集请求至少间隔 2 秒（单 worker 进程）。首次 30 天窗口条目按历史回灌，不触发推送。
- `fetch_runs` 记录新增数量、成功/失败与 HTTP 状态；失败指数退避，上限 6 小时；连续两次失败生成运维告警。告警日志与后台可查，外部送达仍需配置并开启通知渠道。
- `node scripts/probe-mnc.ts --live` 显式重跑网络探测，写入 `.data/mnc-live.json`；不调用模型。
- `node --env-file=.env scripts/export-mnc.ts > mnc-export.jsonl` 导出已存储的标准记录。数据库是主存储；导出不推进采集游标。
- 真实 9 个可抓源已在独立预览库连续运行两轮：首次合计新增 64 条，第二轮新增全部为 0。错误选择器连续两次告警、恢复解除告警、固定频率与时区保留由 `tests/mnc.test.ts` 用本地桩验证；真实网络逐源解析结果见上表。

## 尚未满足的验收项

3 个受限源的持续自动抓取、完整 30 天分页回补、所有公司最新条目逐一人工对照尚未全部完成。不能宣称 12/12 接入成功或已开始全天候监控。生产启用前，在部署网络重新检查这些项目；未验收源保持后台显式失败状态。

## 后续媒体接入

`invest wallstreet` 仅记录在 `industry/sources-pending.json`。需要核对真实公众号 ghid/wxid、文章样本及公众号服务凭据。未接入其他未经用户指定的媒体。所有媒体只提取可核查新闻事实、明确业务披露和政策变化；不收评级、目标价与主观研判。

## 本轮工程验证

- 全新 `pharma_final_test` 数据库：130 项测试通过。
- 前端 11 项测试通过；生产构建及类型检查通过。
- 本地首页、全部动态、日报、关于页已检查；完整 smoke 的页面、RSS、API、MCP 均通过。
- 本地预览 http://localhost:4310；采集原文已入库，模型处理和外部推送关闭，因此公开内容页暂为空。未使用研究目录中的 API 密钥，未执行付费模型调用。
