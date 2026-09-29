# 医药信号

基于 [AIHOT](https://github.com/KKKKhazix/AIHOT) 的医药行业热点站。首批追踪 11 家跨国药企、12 个逻辑官方源，按临床数据、监管审批、交易合作、财报经营、政策支付及管理层与公司事项组织消息。

优先保留有研究价值的新事实，正面与负面披露同等处理。过滤纯主观评论、流量营销、补剂及无资质减肥产品推广、泛健康内容。公司前瞻表述保持原始归属，不写成已确认事实，不生成目标价或涨跌预测。

## 当前状态

10 个逻辑源已验证可解析；阿斯利康采用官方媒体首页最近 5 条，BMS、辉瑞仍有自动抓取限制。完整清单、证据及尚未满足的验收条件见 [MNC 接入记录](docs/mnc-sources.md)。罗氏采用其官方 RSS；诺华 ad hoc 单独监测。本地已完成 69 条新闻的模型处理：59 条生成中文内容、10 条过滤，其中 46 条进入精选。尚未生产部署，实时推送未启用。

## 本地运行

Node.js 24.11+、PostgreSQL 16+。安装依赖、配置本地 `.env` 后：

```sh
npm ci
npm run db:migrate
node --env-file=.env scripts/seed.ts
npm run build -w @aihot/web
npm run dev:api
npm run start -w @aihot/web
```

开发时保持 `COLLECT_ENABLED=false`、`MODEL_CALLS_ENABLED=false` 和全部外部推送开关关闭。采集源可用性单独用 `node scripts/probe-mnc.ts --live` 检查，不消耗模型额度。生产启动 worker 前需填写模型配置、部署地址并复核信源。Docker 部署沿用 [部署说明](docs/deploy.md)。

## 筛选与校准

标准在 `industry/prompts/`。沿用两次评分与原门槛 T1=60、T1_5=65、T2=76，尚未用医药人工标注集校准；示例文件不是已验证的模型准确率证据。请积累 100–200 条人工标注后按 [校准说明](docs/selection.md) 评测。

站名和六类分类已确认；`industry/pages/` 的条款、隐私说明仍是上线前待确认草稿。`invest wallstreet` 账号标识与服务接入待核实。

代码保留上游 MIT 许可证与 NOTICE；医药信号使用独立标志及医药报头。

## 有限批量处理

先根据凭据文件核对 `LLM_BASE_URL` 和该网关支持的 `LLM_MODEL`；兼容接口的密钥不一定属于模型厂商官方域名。经授权后可执行 `MODEL_CALLS_ENABLED=true node --env-file=.env scripts/process-preview.ts --live`，通过 worker 队列处理已有新闻，不注册定时采集或推送任务。保留请求回执与预算，遇到鉴权拒绝停止，最长运行 30 分钟；失败项在后台检查原因后重试。此操作消耗模型额度，单元测试不运行它。
