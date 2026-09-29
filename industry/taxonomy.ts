// 医药信号分类与公司词典。公开 key 上线后保持稳定。
export const CATEGORIES = [
  {
    "key": "clinical",
    "label": "临床数据",
    "section": "临床数据",
    "guide": "临床试验结果、终点、疗效安全性、试验暂停或终止；区分分期、适应症和数据截止日"
  },
  {
    "key": "regulatory",
    "label": "监管审批",
    "section": "监管审批",
    "guide": "药品申报、受理、批准、CRL、标签变更、召回和监管安全警告"
  },
  {
    "key": "deals",
    "label": "交易合作",
    "section": "交易合作",
    "guide": "并购、授权、合作、资产出售；区分首付款、里程碑、权益和交易阶段"
  },
  {
    "key": "earnings",
    "label": "财报经营",
    "section": "财报经营",
    "guide": "财报、指引、产品收入、产能、供货、专利和影响经营的诉讼"
  },
  {
    "key": "policy",
    "label": "政策支付",
    "section": "政策支付",
    "guide": "定价、医保、支付覆盖、集采及医药法规的正式变化"
  },
  {
    "key": "industry",
    "label": "管理层与公司事项",
    "section": "管理层与公司事项",
    "guide": "高管任免、公司治理、管理层披露的具体业务事实，排除纯观点"
  }
] as const;
export const ITEM_TYPES = [
  "clinical_data",
  "regulatory_event",
  "deal_event",
  "financial_results",
  "policy_event",
  "industry_event",
  "opinion_analysis"
] as const;
export const CATEGORY_TAGS = [
  "临床数据",
  "监管审批",
  "交易合作",
  "财报经营",
  "政策支付",
  "管理层与公司事项",
  "观点评论",
  "其他"
] as const;
export const TOPIC_TAGS = [
  "肿瘤",
  "心血管",
  "代谢/肥胖",
  "免疫/炎症",
  "神经科学",
  "罕见病",
  "疫苗",
  "ADC",
  "GLP-1",
  "细胞/基因治疗",
  "III期",
  "安全性",
  "专利",
  "供应/产能"
] as const;
export const ENTITY_TAGS = [
  "AbbVie",
  "Eli Lilly",
  "GSK",
  "Merck",
  "Roche",
  "Novartis",
  "AstraZeneca",
  "Sanofi",
  "Bristol Myers Squibb",
  "Pfizer",
  "Johnson & Johnson"
] as const;
export const TAG_SYNONYMS: Readonly<Record<string,string>> = {
  "临床": "临床数据",
  "审批": "监管审批",
  "并购": "交易合作",
  "授权": "交易合作",
  "财报": "财报经营",
  "政策": "政策支付",
  "人事": "管理层与公司事项"
};
export const CATEGORY_BY_ITEM_TYPE: Readonly<Record<string,string>> = {
  "clinical_data": "临床数据",
  "regulatory_event": "监管审批",
  "deal_event": "交易合作",
  "financial_results": "财报经营",
  "policy_event": "政策支付",
  "industry_event": "管理层与公司事项",
  "opinion_analysis": "观点评论"
};
export const ENTITIES: Record<string, {name:string; displayTag:string|null; aliases:string[]}> = {
  "abbvie": {
    "name": "AbbVie 艾伯维",
    "displayTag": "AbbVie",
    "aliases": [
      "AbbVie",
      "艾伯维",
      "ABBV"
    ]
  },
  "lilly": {
    "name": "Eli Lilly 礼来",
    "displayTag": "Eli Lilly",
    "aliases": [
      "Eli Lilly",
      "礼来",
      "LLY"
    ]
  },
  "gsk": {
    "name": "GSK 葛兰素史克",
    "displayTag": "GSK",
    "aliases": [
      "GSK",
      "葛兰素史克",
      "GSK"
    ]
  },
  "merck": {
    "name": "Merck 默沙东",
    "displayTag": "Merck",
    "aliases": [
      "Merck",
      "默沙东",
      "MRK",
      "Merck & Co.",
      "MSD",
      "默克（美国）"
    ]
  },
  "roche": {
    "name": "Roche 罗氏",
    "displayTag": "Roche",
    "aliases": [
      "Roche",
      "罗氏",
      "RHHBY"
    ]
  },
  "novartis": {
    "name": "Novartis 诺华",
    "displayTag": "Novartis",
    "aliases": [
      "Novartis",
      "诺华",
      "NVS"
    ]
  },
  "astrazeneca": {
    "name": "AstraZeneca 阿斯利康",
    "displayTag": "AstraZeneca",
    "aliases": [
      "AstraZeneca",
      "阿斯利康",
      "AZN"
    ]
  },
  "sanofi": {
    "name": "Sanofi 赛诺菲",
    "displayTag": "Sanofi",
    "aliases": [
      "Sanofi",
      "赛诺菲",
      "SNY"
    ]
  },
  "bms": {
    "name": "Bristol Myers Squibb 百时美施贵宝",
    "displayTag": "Bristol Myers Squibb",
    "aliases": [
      "Bristol Myers Squibb",
      "百时美施贵宝",
      "BMY",
      "Bristol-Myers Squibb",
      "BMS"
    ]
  },
  "pfizer": {
    "name": "Pfizer 辉瑞",
    "displayTag": "Pfizer",
    "aliases": [
      "Pfizer",
      "辉瑞",
      "PFE"
    ]
  },
  "jnj": {
    "name": "Johnson & Johnson 强生",
    "displayTag": "Johnson & Johnson",
    "aliases": [
      "Johnson & Johnson",
      "强生",
      "JNJ",
      "J&J"
    ]
  }
};
export const IDENTITY_LEXICON: ReadonlyArray<{id:string; name:string; patterns:RegExp[]}> = [
  {id:"abbvie",name:"AbbVie",patterns:[new RegExp("\\bAbbVie\\b|\u827e\u4f2f\u7ef4|\\bABBV\\b","i")]},
  {id:"lilly",name:"Eli Lilly",patterns:[new RegExp("\\bEli\\ Lilly\\b|\u793c\u6765|\\bLLY\\b","i")]},
  {id:"gsk",name:"GSK",patterns:[new RegExp("\\bGSK\\b|\u845b\u5170\u7d20\u53f2\u514b|\\bGSK\\b","i")]},
  {id:"merck",name:"Merck",patterns:[new RegExp("\\bMerck\\b|\u9ed8\u6c99\u4e1c|\\bMRK\\b|\\bMerck\\ \\&\\ Co\\.\\b|\\bMSD\\b|\u9ed8\u514b\uff08\u7f8e\u56fd\uff09","i")]},
  {id:"roche",name:"Roche",patterns:[new RegExp("\\bRoche\\b|\u7f57\u6c0f|\\bRHHBY\\b","i")]},
  {id:"novartis",name:"Novartis",patterns:[new RegExp("\\bNovartis\\b|\u8bfa\u534e|\\bNVS\\b","i")]},
  {id:"astrazeneca",name:"AstraZeneca",patterns:[new RegExp("\\bAstraZeneca\\b|\u963f\u65af\u5229\u5eb7|\\bAZN\\b","i")]},
  {id:"sanofi",name:"Sanofi",patterns:[new RegExp("\\bSanofi\\b|\u8d5b\u8bfa\u83f2|\\bSNY\\b","i")]},
  {id:"bms",name:"Bristol Myers Squibb",patterns:[new RegExp("\\bBristol\\ Myers\\ Squibb\\b|\u767e\u65f6\u7f8e\u65bd\u8d35\u5b9d|\\bBMY\\b|\\bBristol\\-Myers\\ Squibb\\b|\\bBMS\\b","i")]},
  {id:"pfizer",name:"Pfizer",patterns:[new RegExp("\\bPfizer\\b|\u8f89\u745e|\\bPFE\\b","i")]},
  {id:"jnj",name:"Johnson & Johnson",patterns:[new RegExp("\\bJohnson\\ \\&\\ Johnson\\b|\u5f3a\u751f|\\bJNJ\\b|\\bJ\\&J\\b","i")]},
];
export const PUBLISHER_DOMAINS: ReadonlyArray<{entityId:string; domains:readonly string[]}> = [
  {
    "entityId": "abbvie",
    "domains": [
      "news.abbvie.com"
    ]
  },
  {
    "entityId": "lilly",
    "domains": [
      "lilly.com",
      "lilly.mediaroom.com"
    ]
  },
  {
    "entityId": "gsk",
    "domains": [
      "gsk.com"
    ]
  },
  {
    "entityId": "merck",
    "domains": [
      "merck.com"
    ]
  },
  {
    "entityId": "roche",
    "domains": [
      "roche.com"
    ]
  },
  {
    "entityId": "novartis",
    "domains": [
      "novartis.com"
    ]
  },
  {
    "entityId": "astrazeneca",
    "domains": [
      "astrazeneca.com"
    ]
  },
  {
    "entityId": "sanofi",
    "domains": [
      "sanofi.com"
    ]
  },
  {
    "entityId": "bms",
    "domains": [
      "bms.com"
    ]
  },
  {
    "entityId": "pfizer",
    "domains": [
      "pfizer.com"
    ]
  },
  {
    "entityId": "jnj",
    "domains": [
      "jnj.com"
    ]
  }
];
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{entityId:string; pattern:RegExp}> = [];
