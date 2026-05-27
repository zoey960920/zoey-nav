const BOARD_META = {
  allTime: {
    label: "长期热度",
    desc: "适合看长期被重复安装、已经被大量用户验证过的基础能力。"
  },
  trending: {
    label: "24 小时趋势",
    desc: "适合看最近一天内加速被采用的新热点。"
  },
  hot: {
    label: "即时升温",
    desc: "适合看此刻升温最快、值得立即观察的技能。"
  }
};

const VIEW_LAYERS = [
  {
    id: "business",
    label: "业务层",
    shortLabel: "业务优先",
    note: "默认只看运营、内容、设计、管理者等能直接进入日常工作的 skills。"
  },
  {
    id: "professional",
    label: "专业层",
    shortLabel: "专业模式",
    note: "再看开发、平台、安全、数据等更专业、更环境依赖的 skills。"
  }
];

const PERSONAS = [
  { id: "all", label: "全部人群", layer: "all" },
  { id: "运营", label: "运营", layer: "business" },
  { id: "内容", label: "内容", layer: "business" },
  { id: "设计", label: "设计", layer: "business" },
  { id: "销售", label: "销售", layer: "business" },
  { id: "HR", label: "HR", layer: "business" },
  { id: "管理者", label: "管理者", layer: "business" },
  { id: "产品", label: "产品", layer: "business" },
  { id: "营销", label: "营销", layer: "business" },
  { id: "开发", label: "开发", layer: "professional" },
  { id: "平台", label: "平台", layer: "professional" },
  { id: "安全", label: "安全", layer: "professional" },
  { id: "数据", label: "数据", layer: "professional" },
  { id: "研究", label: "研究", layer: "professional" }
];

const SCENARIOS = [
  {
    id: "all",
    label: "全部场景",
    layer: "all",
    patterns: []
  },
  {
    id: "找技能与搭工作流",
    label: "找技能与搭工作流",
    layer: "business",
    patterns: [/找技能/, /能力选型/, /工作流/, /skill/i, /agent 工作流/i]
  },
  {
    id: "网页与视觉设计",
    label: "网页与视觉设计",
    layer: "business",
    patterns: [/网页与视觉设计/, /前端落地/, /界面规范/, /可访问性检查/, /多端适配/, /响应式设计/, /界面细节打磨/, /视觉/, /品牌/]
  },
  {
    id: "汇报与文档整理",
    label: "汇报与文档整理",
    layer: "business",
    patterns: [/PPT/, /PDF/, /DOCX/, /汇报/, /文档/, /正式文稿/, /会议纪要/, /资料提炼/, /文稿输出/, /方案整理/]
  },
  {
    id: "表格与资料输出",
    label: "表格与资料输出",
    layer: "business",
    patterns: [/Excel/, /表格/, /资料输出/, /结构化整理/, /数据整理与分析/, /字段整理/]
  },
  {
    id: "图片与视频生成",
    label: "图片与视频生成",
    layer: "business",
    patterns: [/图片生成/, /视觉素材制作/, /视频生成/, /视频脚本到成片/, /配音/, /语音输出/, /动画/, /音乐生成/]
  },
  {
    id: "社媒素材制作",
    label: "社媒素材制作",
    layer: "business",
    patterns: [/社媒/, /X 账号运营/, /素材制作/, /传播物料/, /短视频/, /海报/]
  },
  {
    id: "内容营销",
    label: "内容营销",
    layer: "business",
    patterns: [/文案/, /内容策略/, /营销/, /SEO/, /搜索流量/, /传播/, /分享传播/, /转化/]
  },
  {
    id: "研究与文档提炼",
    label: "研究与文档提炼",
    layer: "business",
    patterns: [/研究/, /提炼/, /脑暴/, /需求澄清/, /方案设计/, /执行规划/, /总结/, /批判/]
  },
  {
    id: "网页采集与自动化",
    label: "网页采集与自动化",
    layer: "business",
    patterns: [/网页采集/, /浏览器自动执行/, /自动化/, /采集/, /browser/i]
  },
  {
    id: "数据查询与结构化整理",
    label: "数据查询与结构化整理",
    layer: "business",
    patterns: [/数据查询/, /结构化整理/, /埋点/, /tracking/i, /analytics/i, /数据整理/]
  },
  {
    id: "前端工程与组件",
    label: "前端工程与组件",
    layer: "professional",
    patterns: [/前端工程/, /React/, /组件/, /shadcn/i, /Canvas/, /WebGL/, /Remotion/, /性能优化/, /包体/]
  },
  {
    id: "测试评审与调试",
    label: "测试评审与调试",
    layer: "professional",
    patterns: [/测试/, /评审/, /调试/, /质量检查/, /代码架构诊断/, /可测试性/, /review/i]
  },
  {
    id: "数据与数据库",
    label: "数据与数据库",
    layer: "professional",
    patterns: [/数据库/, /Postgres/, /SQL/, /KQL/, /查询分析/, /数据迁移/, /schema/i]
  },
  {
    id: "平台部署与集成",
    label: "平台部署与集成",
    layer: "professional",
    patterns: [/部署/, /平台/, /SDK/, /认证/, /权限/, /资源/, /集成/, /Vercel/, /Convex/, /Supabase/, /Claude API/i]
  },
  {
    id: "Agent 与工具开发",
    label: "Agent 与工具开发",
    layer: "professional",
    patterns: [/MCP 服务开发/, /Skill 编写/, /外部工具接入/, /CLI/, /agent 工具/i]
  }
];

const BUSINESS_ROLE_SET = new Set(["运营", "内容", "设计", "销售", "HR", "管理者", "产品", "营销"]);
const PROFESSIONAL_ROLE_SET = new Set(["开发", "平台", "安全", "数据", "研究"]);

const DISPLAY_NAME_MAP = {
  "find-skills": "找技能",
  "skill-creator": "创建 Skill",
  "frontend-design": "前端设计实现",
  "web-design-guidelines": "网页设计规范",
  "agent-browser": "浏览器代理",
  "browser-use": "浏览器操作",
  "copywriting": "文案写作",
  "content-strategy": "内容策略",
  "pptx": "PPT 输出",
  "pdf": "PDF 输出",
  "docx": "DOCX 输出",
  "xlsx": "Excel 输出",
  "writing-plans": "写执行计划",
  "planning-with-files": "结合文件做规划",
  "systematic-debugging": "系统化调试",
  "test-driven-development": "测试驱动开发",
  "vercel-react-best-practices": "Vercel React 最佳实践",
  "remotion-best-practices": "Remotion 最佳实践",
  "xget": "Xget 加速配置",
  "xdrop": "Xdrop 文件传输",
  "graft": "Graft API 代理",
  "emil-design-eng": "Emil 设计工程",
  "coingecko": "CoinGecko 行情",
  "hyperliquid": "Hyperliquid 交易",
  "wallet": "多链钱包",
  "wallet-policy": "钱包安全策略",
  "skillmarketplace": "Skill 市场",
  "coinglass": "Coinglass 衍生品",
  "charting": "金融图表生成",
  "byted-web-search": "Byted 网页搜索",
  "building-native-ui": "原生 UI 构建",
  "tmux": "Tmux 终端会话",
  "fullstack-dev": "全栈开发",
  "figma-implement-design": "Figma 设计实现",
  "antd": "Ant Design",
  "tailwind-design-system": "Tailwind 设计系统",
  "create-readme": "README 生成",
  "firebase-local-env-setup": "Firebase 本地环境配置",
  "java-coding-standards": "Java 编码规范",
  "developing-genkit-js": "Genkit JS 开发",
  "firebase-firestore-enterprise-native-mode": "Firestore 企业原生模式",
  "insforge-cli": "InsForge CLI",
  "playwright-generate-test": "Playwright 测试生成",
  "theme-factory": "主题工厂",
  "china-stock-analysis": "A 股分析",
  "native-data-fetching": "原生数据获取",
  "expo-tailwind-setup": "Expo Tailwind 配置",
  "expo-api-routes": "Expo API 路由",
  "expo-cicd-workflows": "Expo CI/CD 工作流",
  "python-project-structure": "Python 项目结构",
  "async-python-patterns": "Async Python 模式",
  "java-docs": "Java 文档",
  "link-reader": "链接读取",
  "figma-use": "Figma 使用",
  "figma-code-connect-components": "Figma Code Connect 组件",
  "building-components": "组件构建",
  "opencli": "OpenCLI 登录态操作",
  "ctf-pwn": "CTF 二进制利用",
  "solve-challenge": "CTF 解题编排",
  "ctf-web": "CTF Web 攻防",
  "ctf-reverse": "CTF 逆向分析",
  "ctf-malware": "CTF 恶意样本分析",
  "ctf-forensics": "CTF 取证分析",
  "ctf-misc": "CTF 综合题型",
  "ctf-osint": "CTF OSINT",
  "ctf-crypto": "CTF 密码学",
  "skill-development": "Skill 开发",
  "agentation-self-driving": "Agentation 自驱评审",
  "self-improvement": "自我改进",
  "sentry-cli": "Sentry CLI",
  "gh-cli": "GitHub CLI",
  "n8n-workflow-patterns": "n8n 工作流模式",
  "data-visualization": "数据可视化",
  "okx-cex-trade": "OKX 交易执行",
  "okx-cex-earn": "OKX Earn 理财",
  "pua-en": "困难对话英文表达",
  "figma-create-design-system-rules": "Figma 设计系统规则",
  "template-skill": "Skill 模板",
  "tavily-crawl": "Tavily 抓取",
  "word-document-processor": "Word 文档处理",
  "minimax-xlsx": "MiniMax Excel",
  "tdd-workflow": "TDD 工作流",
  "pptx-generator": "PPTX 生成",
  "claude-to-deerflow": "Claude 对接 DeerFlow"
};

const TOKEN_ZH_MAP = {
  azure: "Azure",
  design: "设计",
  frontend: "前端",
  web: "网页",
  guidelines: "规范",
  skill: "Skill",
  skills: "Skills",
  creator: "创建",
  browser: "浏览器",
  agent: "代理",
  copywriting: "文案",
  content: "内容",
  strategy: "策略",
  pptx: "PPT",
  pdf: "PDF",
  docx: "DOCX",
  xlsx: "Excel",
  image: "图片",
  video: "视频",
  automation: "自动化",
  prompt: "提示词",
  writing: "写作",
  plans: "计划",
  planning: "规划",
  debugging: "调试",
  testing: "测试",
  review: "评审",
  deploy: "部署",
  storage: "存储",
  diagnostics: "诊断",
  compliance: "合规",
  rbac: "权限",
  resource: "资源",
  visualizer: "可视化",
  prepare: "准备",
  gateway: "网关",
  kusto: "Kusto",
  validate: "校验",
  lookup: "查询",
  foundry: "Foundry",
  messaging: "消息",
  auth: "认证",
  postgres: "Postgres",
  audit: "审计",
  seo: "SEO",
  marketing: "营销",
  social: "社媒",
  remotion: "Remotion",
  shadcn: "shadcn",
  react: "React",
  next: "Next.js",
  best: "最佳",
  practices: "实践"
};

const FALLBACK_THEMES = [
  {
    match: /(find-skills|skill-creator|writing-skills|enhance-prompt|using-superpowers|subagent)/,
    roles: ["运营", "内容", "管理者", "开发"],
    scenarios: ["找技能与搭工作流", "效率增强"],
    difficulty: "低",
    beginnerFriendly: true,
    summary: "适合先帮你找到更合适的 skills、提示词和工作流，再决定下一步该装什么、试什么。",
    firstPrompt: "我是运营，最近常做资料整理和内容输出，请先按上手难度和适用场景给我推荐 5 个合适的 skills。",
    expectedOutput: "推荐清单、适用场景、安装或试用顺序",
    requirements: ["先说清你的角色和最近要做的任务"],
    riskNotes: ["如果场景太泛，推荐结果会偏散"],
    comboSuggestions: ["先用它做选型，再搭配具体执行类 skill 落地"],
    useCases: ["筛出适合岗位的 skill 清单", "帮团队做技能工具箱", "比较多个候选 skill 的使用门槛"]
  },
  {
    match: /(frontend-design|web-design|ui-ux|canvas-design|stitch-design|shadcn|react:components|brand-guidelines)/,
    roles: ["设计", "产品", "开发", "运营"],
    scenarios: ["网页与视觉设计", "页面改版"],
    difficulty: "中",
    beginnerFriendly: true,
    summary: "适合把页面、海报、界面或品牌需求，整理成更清晰的视觉方向和实现方案。",
    firstPrompt: "我要做一个面向中文用户的活动页，请先给我页面结构、视觉方向和 3 条设计原则，再说明哪些信息必须优先展示。",
    expectedOutput: "页面结构、视觉方向、组件建议、文案重点",
    requirements: ["提供受众、目标动作和参考风格会更准"],
    riskNotes: ["如果缺少品牌约束，输出可能偏概念稿"],
    comboSuggestions: ["先用研究类 skill 明确内容，再用设计类 skill 做呈现"],
    useCases: ["做活动页或落地页方向稿", "梳理信息层级和视觉重点", "把模糊想法转成可执行设计 brief"]
  },
  {
    match: /(pptx|pdf|docx|xlsx|typeset|doc-coauthoring)/,
    roles: ["运营", "内容", "管理者", "销售", "HR"],
    scenarios: ["汇报与文档整理", "表格与资料输出"],
    difficulty: "低",
    beginnerFriendly: true,
    summary: "适合把零散内容整理成 PPT、PDF、文档或表格等更适合交付的结构化输出。",
    firstPrompt: "我有一份会议纪要和一份方案草稿，请帮我整理成一页汇报结构，分成背景、问题、方案和下一步四块。",
    expectedOutput: "文档结构、页级提纲、表格列设计或导出建议",
    requirements: ["需要原始资料或至少有一版内容草稿"],
    riskNotes: ["如果源材料很散，先做提炼再出文档效果更好"],
    comboSuggestions: ["先用提炼类 skill 处理材料，再用文档输出类 skill 定稿"],
    useCases: ["做周报/月报", "整理交付文档", "把口头信息转成结构化材料"]
  },
  {
    match: /(image|video|music|tts|remotion|animate|algorithmic-art|nano-banana|qwen-image|p-image|p-video|elevenlabs)/,
    roles: ["内容", "设计", "运营", "营销"],
    scenarios: ["图片与视频生成", "社媒素材制作"],
    difficulty: "低",
    beginnerFriendly: true,
    summary: "适合快速生成图片、视频、语音或动画素材，缩短内容制作周期。",
    firstPrompt: "围绕新品发布这个主题，给我 3 个短视频创意方向，分别偏品牌感、转化感和信息感，并写出镜头脚本。",
    expectedOutput: "创意方向、脚本、画面提示、素材清单",
    requirements: ["给出主题、目标平台和风格偏好"],
    riskNotes: ["生成效果很依赖风格约束和素材说明"],
    comboSuggestions: ["先用内容策略类 skill 定脚本，再用多媒体类 skill 生成素材"],
    useCases: ["做海报和 KV 方向", "出短视频脚本", "批量制作社媒素材"]
  },
  {
    match: /(agent-browser|browser-use|twitter-automation|automation|agent-tools|tavily-search)/,
    roles: ["运营", "销售", "研究", "开发"],
    scenarios: ["网页采集与自动化", "重复任务代办"],
    difficulty: "中",
    beginnerFriendly: false,
    summary: "适合把网页访问、信息采集和重复操作变成可复用的自动化流程。",
    firstPrompt: "我想自动打开目标网站、采集页面里的核心字段并整理成表，请帮我把流程拆成可执行步骤，并标出哪些动作适合自动化。",
    expectedOutput: "自动化流程、输入要求、可执行步骤、异常处理提醒",
    requirements: ["最好提供目标网址、字段定义和操作流程"],
    riskNotes: ["涉及登录、风控或页面变动时，自动化稳定性会下降"],
    comboSuggestions: ["和数据整理或研究类 skill 搭配使用更完整"],
    useCases: ["采集网页信息", "自动完成重复页面操作", "搭简单的浏览器任务链"]
  },
  {
    match: /(copywriting|marketing|seo|social-content|pricing|product-marketing|internal-comms|content-strategy)/,
    roles: ["运营", "内容", "销售", "管理者"],
    scenarios: ["内容营销", "增长实验"],
    difficulty: "低",
    beginnerFriendly: true,
    summary: "适合围绕品牌、营销、社媒和增长目标，产出更完整的内容方案和传播素材。",
    firstPrompt: "请围绕这个产品卖点，给我一版面向中文用户的内容方案，包含标题方向、核心卖点、社媒切片和行动号召。",
    expectedOutput: "内容框架、标题、卖点拆解、传播建议",
    requirements: ["需要明确产品、受众和目标动作"],
    riskNotes: ["如果没有真实卖点和用户信息，内容会偏空"],
    comboSuggestions: ["和视觉设计或多媒体生成类 skill 搭配，能直接做完整传播物料"],
    useCases: ["做活动传播方案", "写官网卖点和社媒内容", "规划增长实验素材"]
  },
  {
    match: /(clarify|distill|extract|brainstorming|planning|writing-plans|onboard|normalize|simple|quieter|polish|delight|bolder|overdrive)/,
    roles: ["运营", "内容", "产品", "管理者", "HR"],
    scenarios: ["研究与文档提炼", "方案整理"],
    difficulty: "低",
    beginnerFriendly: true,
    summary: "适合把需求、资料、会议纪要或研究内容提炼成更好理解、更适合执行的结论。",
    firstPrompt: "我有一份需求说明和几段会议结论，请先帮我提炼重点，再整理成可执行的下一步清单。",
    expectedOutput: "重点摘要、结构化结论、执行清单",
    requirements: ["需要提供原始内容或至少给出背景"],
    riskNotes: ["如果输入本身冲突，需要人工补判断"],
    comboSuggestions: ["先用这类 skill 做提炼，再交给文档或设计类 skill 输出成品"],
    useCases: ["提炼会议纪要", "整理需求文档", "把研究资料转成可执行结论"]
  },
  {
    match: /(audit|review|testing|debug|verification|benchmark|harden|diagnostics|compliance|systematic-debugging|webapp-testing)/,
    roles: ["开发", "产品", "设计", "管理者"],
    scenarios: ["质量检查与诊断", "上线前验收"],
    difficulty: "中",
    beginnerFriendly: false,
    summary: "适合在上线、交付或评审前，按清单方式找问题、做审查和补漏洞。",
    firstPrompt: "请按可用性、准确性和风险三个维度检查这套方案，先列问题，再给修复优先级和最小验证步骤。",
    expectedOutput: "问题清单、优先级、修复建议、验证路径",
    requirements: ["需要有页面、方案、代码或文档作为检查对象"],
    riskNotes: ["更适合做诊断，不等于自动完成修复"],
    comboSuggestions: ["和实现类 skill 串联使用，形成修改闭环"],
    useCases: ["页面验收", "方案审查", "上线前质量排查"]
  },
  {
    match: /(postgres|database|kusto|lookup|storage|resource-lookup)/,
    roles: ["数据", "开发", "运营"],
    scenarios: ["数据查询与结构化整理", "数据库与表格"],
    difficulty: "中",
    beginnerFriendly: false,
    summary: "适合处理数据查询、表格整理、数据库结构和信息提取等偏结构化工作。",
    firstPrompt: "我有一份表格和一张数据表，请帮我判断字段结构是否合理，并输出适合后续分析的整理方案。",
    expectedOutput: "字段建议、查询方向、整理方案、风险提示",
    requirements: ["最好提供字段、样例数据或表结构"],
    riskNotes: ["如果没有数据上下文，建议只能停留在结构层"],
    comboSuggestions: ["和研究提炼类 skill 搭配，可把数据结果转成汇报材料"],
    useCases: ["梳理数据表结构", "做字段整理", "把原始数据转成可分析资料"]
  },
  {
    match: /(azure|cloud|deploy|sdk|resource|rbac|compute|messaging|observability|aigateway|entra|vercel-cli|supabase|convex|better-auth|mcp-builder|claude-api)/,
    roles: ["开发", "平台", "管理者"],
    scenarios: ["云部署与平台集成", "账号权限与资源管理"],
    difficulty: "高",
    beginnerFriendly: false,
    summary: "适合处理云部署、资源管理、权限配置和平台接入等偏工程基础设施问题。",
    firstPrompt: "请检查当前云资源或部署链路的风险点，按风险、成本和修复顺序给我一份中文清单。",
    expectedOutput: "排查清单、风险优先级、配置建议、修复顺序",
    requirements: ["需要资源信息、部署背景或配置上下文"],
    riskNotes: ["对环境信息依赖高，更适合技术同事主导"],
    comboSuggestions: ["可先用研究类 skill 整理背景，再交给云平台类 skill 做诊断"],
    useCases: ["检查部署配置", "梳理权限和资源关系", "评估云成本与风险"]
  },
  {
    match: /(react|next|frontend|composition|webapp|convex-create-component)/,
    roles: ["开发", "产品", "设计"],
    scenarios: ["前端开发", "组件搭建"],
    difficulty: "中",
    beginnerFriendly: false,
    summary: "适合把前端需求拆成组件、状态、实现步骤和工程约束。",
    firstPrompt: "请根据这个页面需求，输出组件结构、状态拆分、关键交互和实现注意事项，优先考虑中文用户体验。",
    expectedOutput: "组件方案、实现注意点、技术约束、交互建议",
    requirements: ["最好给需求、技术栈和限制条件"],
    riskNotes: ["更偏实现方法，不直接替代完整设计稿"],
    comboSuggestions: ["和视觉设计类 skill 搭配，能形成从设计到实现的完整链路"],
    useCases: ["拆页面组件", "规划前端实现路径", "梳理状态和交互逻辑"]
  }
];

const DEFAULT_THEME = {
  roles: ["运营", "内容", "管理者"],
  scenarios: ["通用效率提升"],
  difficulty: "低",
  beginnerFriendly: true,
  summary: "适合作为通用效率增强 skill，先用于探索这个方向是否值得纳入工作流。",
  firstPrompt: "请先告诉我这个 skill 更适合哪些人、哪些场景，以及第一次怎么开始用。",
  expectedOutput: "适用范围、使用建议、试用顺序",
  requirements: ["先明确你要解决的任务"],
  riskNotes: ["如果任务描述过泛，解读会偏宽"],
  comboSuggestions: ["先收藏观察，再决定是否纳入固定工作流"],
  useCases: ["探索新工作流", "补充通用能力", "做轻量试用"]
};

const STATE = {
  layer: "business",
  board: "allTime",
  sort: "recommended",
  query: "",
  persona: "all",
  scenario: "all",
  mobileFiltersOpen: false,
  current: null,
  history: null,
  copyFeedbackTimer: null
};

const MOBILE_BREAKPOINT = 760;

const SORT_LABELS = {
  recommended: "推荐优先",
  rank: "榜单排名",
  heat: "综合热度",
  momentum: "近期升温",
  beginner: "新手友好",
  name: "名称"
};

const DEFAULT_HIDDEN_SKILLS = new Set([
  "better-auth-best-practices",
  "convex-migration-helper",
  "convex-setup-auth",
  "deploy-to-vercel",
  "mcp-builder"
]);

const PROVIDER_LOCKED_PATTERN = /\bazure\b|entra|app[\s-]?insights|kusto|foundry|copilot sdk/i;

const LOW_RELEVANCE_SCENARIOS = [
  /Agent 平台部署/,
  /Copilot SDK 上云/,
  /AI Gateway 配置/,
  /Azure API Management 治理/,
  /云资源规划/,
  /部署前校验与准备/,
  /权限配置与授权/,
  /认证系统搭建/,
  /访问控制设计/,
  /Convex 数据迁移/,
  /Convex 认证配置/,
  /Vercel 部署/,
  /预览环境发布/,
  /MCP 服务开发/
];

function classifyBusinessVisibility(item) {
  const text = [
    item.key,
    item.skill,
    item.nameZh,
    item.nameEn,
    item.name,
    item.owner,
    item.repo,
    item.vendor,
    ...(item.fitScenarios || item.scenarios || []),
    ...(item.fitRoles || item.audience || [])
  ].join(" ");

  if (DEFAULT_HIDDEN_SKILLS.has(item.skill)) {
    return {
      defaultHidden: true,
      hiddenReason: "当前偏平台部署或认证治理，对业务团队默认价值较低"
    };
  }

  if (PROVIDER_LOCKED_PATTERN.test(text)) {
    return {
      defaultHidden: true,
      hiddenReason: "当前偏 Azure / Entra 专属能力，你们主用阿里云时默认不展示"
    };
  }

  if ((item.fitScenarios || item.scenarios || []).some((scenario) => LOW_RELEVANCE_SCENARIOS.some((pattern) => pattern.test(scenario)))) {
    return {
      defaultHidden: true,
      hiddenReason: "当前偏平台部署、权限治理或环境绑定场景，对主营业务默认先沉底"
    };
  }

  return {
    defaultHidden: false,
    hiddenReason: ""
  };
}

function getLayerMeta(layerId) {
  return VIEW_LAYERS.find((item) => item.id === layerId) || VIEW_LAYERS[0];
}

function getActivePersonas() {
  return PERSONAS.filter((item) => item.layer === "all" || item.layer === STATE.layer);
}

function getActiveScenarios() {
  return SCENARIOS.filter((item) => item.layer === "all" || item.layer === STATE.layer);
}

function ensureScopedSelections() {
  if (!getActivePersonas().some((item) => item.id === STATE.persona)) STATE.persona = "all";
  if (!getActiveScenarios().some((item) => item.id === STATE.scenario)) STATE.scenario = "all";
}

function countPatternHits(values, patterns) {
  return patterns.reduce((count, pattern) => count + Number(values.some((value) => pattern.test(value))), 0);
}

function classifyAudienceLayer({ fitRoles, fitScenarios, difficulty, beginnerFriendly }) {
  const roles = fitRoles || [];
  const scenarios = fitScenarios || [];
  const businessRoleHits = roles.filter((role) => BUSINESS_ROLE_SET.has(role)).length;
  const professionalRoleHits = roles.filter((role) => PROFESSIONAL_ROLE_SET.has(role)).length;
  const businessScenarioHits = countPatternHits(
    scenarios,
    SCENARIOS.filter((item) => item.layer === "business").flatMap((item) => item.patterns || [])
  );
  const professionalScenarioHits = countPatternHits(
    scenarios,
    SCENARIOS.filter((item) => item.layer === "professional").flatMap((item) => item.patterns || [])
  );

  if (businessRoleHits && !professionalRoleHits && professionalScenarioHits === 0) return "business";
  if (professionalRoleHits && !businessRoleHits && businessScenarioHits === 0) return "professional";

  const businessScore = businessRoleHits * 2 + businessScenarioHits + Number(beginnerFriendly) + Number(difficulty === "低");
  const professionalScore = professionalRoleHits * 2 + professionalScenarioHits + Number(difficulty === "高") * 2;

  if (professionalScore >= businessScore + 2) return "professional";
  if (businessScore >= professionalScore + 2) return "business";
  return "hybrid";
}

function matchesLayerScope(item) {
  if (item.defaultHidden) return false;
  if (STATE.layer === "business") return item.audienceLayer !== "professional";
  return item.audienceLayer !== "business";
}

function matchesScenarioSelection(item, scenarioId) {
  if (scenarioId === "all") return true;
  const option = SCENARIOS.find((entry) => entry.id === scenarioId);
  if (!option) return true;
  const scenarios = item.fitScenarios || [];
  if (scenarios.includes(scenarioId)) return true;
  return (option.patterns || []).some((pattern) => scenarios.some((value) => pattern.test(value)));
}

function readUrlState() {
  const url = new URL(window.location.href);
  const layer = url.searchParams.get("layer");
  const board = url.searchParams.get("board");
  const sort = url.searchParams.get("sort");
  const query = url.searchParams.get("q");
  const persona = url.searchParams.get("persona");
  const scenario = url.searchParams.get("scenario");

  if (layer && VIEW_LAYERS.some((item) => item.id === layer)) STATE.layer = layer;
  if (board && BOARD_META[board]) STATE.board = board;
  if (sort && SORT_LABELS[sort]) STATE.sort = sort;
  if (typeof query === "string") STATE.query = query;
  if (persona && PERSONAS.some((item) => item.id === persona)) STATE.persona = persona;
  if (scenario && SCENARIOS.some((item) => item.id === scenario)) STATE.scenario = scenario;
}

function syncUrlState() {
  const url = new URL(window.location.href);
  const defaults = {
    layer: "business",
    board: "allTime",
    sort: "recommended",
    q: "",
    persona: "all",
    scenario: "all"
  };

  if (STATE.layer !== defaults.layer) url.searchParams.set("layer", STATE.layer);
  else url.searchParams.delete("layer");

  if (STATE.board !== defaults.board) url.searchParams.set("board", STATE.board);
  else url.searchParams.delete("board");

  if (STATE.sort !== defaults.sort) url.searchParams.set("sort", STATE.sort);
  else url.searchParams.delete("sort");

  if (STATE.query.trim()) url.searchParams.set("q", STATE.query.trim());
  else url.searchParams.delete("q");

  if (STATE.persona !== defaults.persona) url.searchParams.set("persona", STATE.persona);
  else url.searchParams.delete("persona");

  if (STATE.scenario !== defaults.scenario) url.searchParams.set("scenario", STATE.scenario);
  else url.searchParams.delete("scenario");

  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) window.history.replaceState(null, "", next);
}

function fmtDate(ts) {
  if (!ts) return "-";
  return new Date(ts).toLocaleString("zh-CN", { hour12: false });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function unique(items) {
  return Array.from(new Set((items || []).filter(Boolean)));
}

function pickTheme(item) {
  const text = [
    item.skill,
    item.name,
    item.owner,
    item.repo,
    item.uses,
    item.vendor,
    item.detailUrl
  ].join(" ").toLowerCase();
  return FALLBACK_THEMES.find((rule) => rule.match.test(text)) || DEFAULT_THEME;
}

function buildNameZh(item) {
  const slug = item.skill || item.name || "";
  if (DISPLAY_NAME_MAP[slug]) return DISPLAY_NAME_MAP[slug];
  const tokens = slug.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  if (!tokens.length) return item.name || slug;
  return tokens.map((token) => TOKEN_ZH_MAP[token] || token.replace(/^\w/, (m) => m.toUpperCase())).join(" ");
}

function confidenceSource(item) {
  if (item.confidenceSource) return item.confidenceSource;
  const uses = item.uses || "";
  if (!uses || /暂无官方描述/.test(uses) || /^Title: /i.test(uses)) return "基于名称与榜单推断";
  return "官方页面摘要";
}

function fallbackBadges(item, theme) {
  const badges = [];
  if (theme.beginnerFriendly) badges.push("新手友好");
  if (item.ranks?.hot && item.ranks.hot <= 15) badges.push("上升快");
  if (item.ranks?.allTime && item.ranks.allTime <= 15) badges.push("长期强势");
  if ((item.ranks?.allTime && item.ranks?.trending && item.ranks?.hot) || item.heat?.totalHeat > 40) badges.push("三榜同现");
  if ((item.difficulty || theme.difficulty) === "高") badges.push("专业向");
  return unique(badges).slice(0, 3);
}

function normalizeSkill(item) {
  const historyItem = STATE.history?.registry?.[item.key];
  const source = historyItem ? { ...historyItem, ...item } : item;
  const theme = pickTheme(source);
  const visibility = classifyBusinessVisibility(source);
  const fitRoles = unique(source.fitRoles || source.audience || []);
  const fitScenarios = unique(source.fitScenarios || source.scenarios || []);
  const difficulty = source.difficulty || theme.difficulty;
  const beginnerFriendly = typeof source.beginnerFriendly === "boolean" ? source.beginnerFriendly : theme.beginnerFriendly;
  const audienceLayer = source.audienceLayer || classifyAudienceLayer({ fitRoles, fitScenarios, difficulty, beginnerFriendly });
  const status = source.verificationStatus || "部分核验";

  return {
    ...source,
    nameZh: source.nameZh || buildNameZh(source),
    nameEn: source.nameEn || source.name || source.skill,
    officialSummary: source.officialSummary || source.uses || "",
    fitRoles,
    fitScenarios,
    audience: fitRoles,
    scenarios: fitScenarios,
    difficulty,
    beginnerFriendly,
    summaryZh: source.summaryZh || theme.summary,
    detailSummaryZh: source.detailSummaryZh || source.summaryZh || theme.summary,
    firstPrompt: source.firstPrompt || theme.firstPrompt,
    expectedOutput: source.expectedOutput || theme.expectedOutput,
    requirements: source.requirements || theme.requirements,
    riskNotes: source.riskNotes || theme.riskNotes,
    comboSuggestions: source.comboSuggestions || theme.comboSuggestions,
    useCases: source.useCases || theme.useCases,
    confidenceSource: confidenceSource(source),
    verificationStatus: status,
    whyNow: source.whyNow || buildFallbackWhy(source, theme),
    badges: source.badges?.length ? source.badges : fallbackBadges(source, theme),
    audienceLayer,
    defaultHidden: typeof source.defaultHidden === "boolean" ? source.defaultHidden : visibility.defaultHidden,
    hiddenReason: source.hiddenReason || visibility.hiddenReason
  };
}

function buildFallbackWhy(item, theme) {
  if (item.status === "dropped") return "它曾进入前 100，但目前已经掉榜，更适合放进观察名单。";
  if (item.ranks?.hot && item.ranks.hot <= 5) return `对「${theme.scenarios[0]}」场景来说，它现在处于明显升温阶段。`;
  if (item.ranks?.trending && item.ranks.trending <= 10) return `对「${theme.scenarios[0]}」场景来说，它最近正在被快速采用。`;
  if (item.ranks?.allTime && item.ranks.allTime <= 10) return `它在长期热度榜靠前，说明已经被大量用户验证过。`;
  return `它更适合在「${theme.scenarios[0]}」这类任务中先收藏、再小范围试用。`;
}

function getBoardSkills() {
  const boardData = STATE.current?.boards?.[STATE.board];
  if (!boardData) return [];
  return boardData.skills.map(normalizeSkill);
}

function getDroppedSkills() {
  return (STATE.history?.droppedSkills || []).map(normalizeSkill);
}

function getCatalogMap() {
  const map = new Map();
  Object.values(STATE.current?.boards || {}).forEach((board) => {
    board.skills.forEach((skill) => {
      const normalized = normalizeSkill(skill);
      map.set(normalized.key, normalized);
    });
  });
  (STATE.history?.droppedSkills || []).forEach((skill) => {
    const normalized = normalizeSkill(skill);
    if (!map.has(normalized.key)) map.set(normalized.key, normalized);
  });
  return map;
}

function getMomentumScore(item) {
  let score = 0;
  if (item.ranks?.hot) score += 120 - item.ranks.hot;
  if (item.ranks?.trending) score += 120 - item.ranks.trending;
  score += Math.min(60, item.heat?.hotDeltaValue || 0);
  return score;
}

function recommendationScore(item) {
  let score = item.heat?.totalHeat || 0;
  const rank = item.ranks?.[STATE.board] || 120;
  score += Math.max(0, 110 - rank);
  score += getMomentumScore(item) * 0.35;
  if (item.beginnerFriendly) score += 12;
  if (STATE.layer === "business") {
    if (item.audienceLayer === "business") score += 22;
    else if (item.audienceLayer === "hybrid") score += 10;
    else score -= 36;
    if (item.difficulty === "高") score -= 18;
  } else {
    if (item.audienceLayer === "professional") score += 22;
    else if (item.audienceLayer === "hybrid") score += 8;
    else score -= 24;
    if (item.difficulty === "高") score += 8;
  }

  if (STATE.persona !== "all") {
    score += item.fitRoles.includes(STATE.persona) ? 32 : -14;
  }
  if (STATE.scenario !== "all") {
    score += matchesScenarioSelection(item, STATE.scenario) ? 36 : -12;
  }
  return score;
}

function sortSkills(list) {
  const result = list.slice();
  if (STATE.sort === "rank") {
    result.sort((a, b) => (a.ranks?.[STATE.board] || 999) - (b.ranks?.[STATE.board] || 999));
    return result;
  }
  if (STATE.sort === "heat") {
    result.sort((a, b) => (b.heat?.totalHeat || 0) - (a.heat?.totalHeat || 0));
    return result;
  }
  if (STATE.sort === "momentum") {
    result.sort((a, b) => getMomentumScore(b) - getMomentumScore(a));
    return result;
  }
  if (STATE.sort === "beginner") {
    result.sort((a, b) => Number(b.beginnerFriendly) - Number(a.beginnerFriendly) || recommendationScore(b) - recommendationScore(a));
    return result;
  }
  if (STATE.sort === "name") {
    result.sort((a, b) => a.nameZh.localeCompare(b.nameZh, "zh-CN"));
    return result;
  }
  result.sort((a, b) => recommendationScore(b) - recommendationScore(a));
  return result;
}

function matchesFilters(item) {
  const query = STATE.query.trim().toLowerCase();
  const text = [
    item.nameZh,
    item.nameEn,
    item.vendor,
    item.summaryZh,
    item.detailSummaryZh,
    item.uses,
    ...(item.fitRoles || []),
    ...(item.fitScenarios || []),
    ...(item.badges || [])
  ].join(" ").toLowerCase();

  const strictFilterMode = STATE.persona !== "all" || STATE.scenario !== "all";
  if (strictFilterMode && item.verificationStatus !== "已核验") return false;
  if (STATE.persona !== "all" && !item.fitRoles.includes(STATE.persona)) return false;
  if (STATE.scenario !== "all" && !matchesScenarioSelection(item, STATE.scenario)) return false;
  if (query && !text.includes(query)) return false;
  return true;
}

function isPublishReadySkill(item) {
  return item.verificationStatus !== "待核验" && item.themeId !== "general";
}

function getLayerBoardSkills(boardSkills = getBoardSkills()) {
  return boardSkills.filter(isPublishReadySkill).filter(matchesLayerScope);
}

function getVisibleSkills(boardSkills = getBoardSkills()) {
  return sortSkills(getLayerBoardSkills(boardSkills).filter(matchesFilters));
}

function getVisibleDroppedSkills(droppedSkills = getDroppedSkills()) {
  const list = droppedSkills
    .filter(isPublishReadySkill)
    .filter(matchesLayerScope)
    .filter(matchesFilters);
  list.sort((a, b) => (b.lastSeenAt || 0) - (a.lastSeenAt || 0));
  return list;
}

function topEntriesFromMap(mapObj, limit = 5) {
  return Object.entries(mapObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function renderPersonaRail() {
  const rail = document.getElementById("personaRail");
  rail.innerHTML = getActivePersonas().map((persona) => `
    <button
      class="chip ${STATE.persona === persona.id ? "active" : ""}"
      type="button"
      data-kind="persona"
      data-id="${escapeHtml(persona.id)}"
    >${escapeHtml(persona.label)}</button>
  `).join("");
}

function renderScenarioRail() {
  const rail = document.getElementById("scenarioRail");
  rail.innerHTML = getActiveScenarios().map((scenario) => `
    <button
      class="chip ${STATE.scenario === scenario.id ? "active" : ""}"
      type="button"
      data-kind="scenario"
      data-id="${escapeHtml(scenario.id)}"
    >${escapeHtml(scenario.label)}</button>
  `).join("");
}

function renderLayerRail() {
  const layerMeta = getLayerMeta(STATE.layer);
  const rail = document.getElementById("layerRail");
  const caption = document.getElementById("layerCaption");
  if (caption) caption.textContent = layerMeta.note;
  if (!rail) return;
  rail.innerHTML = VIEW_LAYERS.map((layer) => `
    <button
      class="layer-tab ${STATE.layer === layer.id ? "active" : ""}"
      type="button"
      role="tab"
      aria-selected="${STATE.layer === layer.id ? "true" : "false"}"
      tabindex="${STATE.layer === layer.id ? "0" : "-1"}"
      data-kind="layer"
      data-id="${escapeHtml(layer.id)}"
    >
      <strong>${escapeHtml(layer.shortLabel)}</strong>
      <span>${escapeHtml(layer.label)}</span>
    </button>
  `).join("");
}

function renderTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    const active = tab.dataset.board === STATE.board;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
    tab.tabIndex = active ? 0 : -1;
  });
}

function syncControls() {
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  if (searchInput && searchInput.value !== STATE.query) searchInput.value = STATE.query;
  if (sortSelect && sortSelect.value !== STATE.sort) sortSelect.value = STATE.sort;
}

function isMobileViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
}

function syncMobileFilterState() {
  const deck = document.getElementById("commandDeck");
  const backdrop = document.getElementById("mobileFilterBackdrop");
  const trigger = document.getElementById("mobileFilterOpen");
  const active = isMobileViewport() && STATE.mobileFiltersOpen;

  if (deck) deck.classList.toggle("mobile-open", active);
  if (backdrop) backdrop.hidden = !active;
  if (trigger) trigger.setAttribute("aria-expanded", active ? "true" : "false");
  document.body.classList.toggle("filters-open", active);
}

function closeMobileFilters() {
  STATE.mobileFiltersOpen = false;
  syncMobileFilterState();
}

function openMobileFilters() {
  if (!isMobileViewport()) return;
  STATE.mobileFiltersOpen = true;
  closeDetail();
  syncMobileFilterState();
}

function collapseMobileFiltersAfterAction() {
  if (isMobileViewport()) closeMobileFilters();
}

function syncResponsiveState() {
  if (!isMobileViewport()) STATE.mobileFiltersOpen = false;
  syncMobileFilterState();
}

function renderBriefs() {
  const briefNode = document.getElementById("briefList");
  if (!briefNode) return;
  const uniqueCurrent = Array.from(getCatalogMap().values()).filter((item) => item.status !== "dropped");
  const topNewbie = uniqueCurrent
    .filter((item) => item.beginnerFriendly)
    .sort((a, b) => recommendationScore(b) - recommendationScore(a))[0];
  const topMomentum = uniqueCurrent
    .slice()
    .sort((a, b) => getMomentumScore(b) - getMomentumScore(a))[0];

  const scenarioMap = {};
  uniqueCurrent.forEach((item) => {
    (item.fitScenarios || []).forEach((scenario) => {
      scenarioMap[scenario] = (scenarioMap[scenario] || 0) + 1;
    });
  });
  const topScenario = topEntriesFromMap(scenarioMap, 1)[0];

  const blocks = [
    topNewbie ? {
      title: `新人先看：${topNewbie.nameZh}`,
      text: `${topNewbie.summaryZh} 现在它最适合拿来做第一次试用，避免一开始就踩到高门槛技能。`
    } : null,
    topMomentum ? {
      title: `正在升温：${topMomentum.nameZh}`,
      text: `${topMomentum.whyNow} 如果你最近刚好有相关任务，值得优先放进观察名单。`
    } : null,
    topScenario ? {
      title: `当前大盘方向：${topScenario[0]}`,
      text: `当前榜单里与「${topScenario[0]}」相关的 skill 最集中，说明这个方向近期关注度持续偏高。`
    } : null
  ].filter(Boolean);

  briefNode.innerHTML = blocks.map((block) => `
    <article class="brief-item">
      <h3>${escapeHtml(block.title)}</h3>
      <p>${escapeHtml(block.text)}</p>
    </article>
  `).join("");
}

function ensureSentence(text = "") {
  const normalized = String(text).replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return /[。！？.!?]$/.test(normalized) ? normalized : `${normalized}。`;
}

function getCardDescription(item) {
  const primary = ensureSentence(item.detailSummaryZh || item.summaryZh || item.uses);
  const secondarySource = item.expectedOutput
    ? `通常会给你：${item.expectedOutput}`
    : item.useCases?.length
      ? `常见用法：${item.useCases.slice(0, 2).join("、")}`
      : item.whyNow;
  const secondary = ensureSentence(secondarySource);

  return {
    primary,
    secondary: secondary && secondary !== primary ? secondary : ""
  };
}

function renderRecommendationItem(item, index) {
  const description = getCardDescription(item);
  return `
    <article class="recommend-item">
      <div class="recommend-copy">
        <div class="recommend-title-wrap">
          <h3>${index + 1}. ${escapeHtml(item.nameZh)}</h3>
          <p class="card-title-en">${escapeHtml(item.nameEn || item.skill)}</p>
        </div>
        <div class="card-intro">
          <p class="card-summary">${escapeHtml(description.primary)}</p>
          ${description.secondary ? `<p class="card-support">${escapeHtml(description.secondary)}</p>` : ""}
        </div>
        <div class="recommend-tags">
          <span class="pill">${escapeHtml(item.fitRoles.slice(0, 2).join(" / "))}</span>
          <span class="pill alt">${escapeHtml(item.fitScenarios[0] || "通用效率提升")}</span>
          ${(item.badges || []).slice(0, 1).map((badge) => `<span class="pill">${escapeHtml(badge)}</span>`).join("")}
        </div>
      </div>
      <div class="recommend-rank">
        <strong>#${escapeHtml(item.ranks?.[STATE.board] || "-")}</strong>
        <span>${escapeHtml(BOARD_META[STATE.board].label)}</span>
        <button class="action-button" type="button" data-action="open-detail" data-key="${escapeHtml(item.key)}">完整解读</button>
      </div>
    </article>
  `;
}

function renderRecommendations(visibleSkills) {
  const picks = visibleSkills
    .filter((item) => item.verificationStatus === "已核验")
    .sort((a, b) => recommendationScore(b) - recommendationScore(a))
    .slice(0, 3);
  const hintParts = [getLayerMeta(STATE.layer).shortLabel];
  if (STATE.persona !== "all") hintParts.push(STATE.persona);
  if (STATE.scenario !== "all") hintParts.push(STATE.scenario);
  document.getElementById("recommendHint").textContent = hintParts.length
    ? hintParts.join(" × ")
    : `${getLayerMeta(STATE.layer).shortLabel} × 全部角色 × 全部场景`;

  const list = document.getElementById("recommendList");
  if (!picks.length) {
    list.innerHTML = `
      <article class="empty-card">
        <h3>当前没有已核验推荐</h3>
        <p>这说明当前榜单里没有足够可靠、且明确匹配你所选角色/场景的 skill。可以先切换场景，或回到全部角色查看。</p>
      </article>
    `;
    return;
  }

  list.innerHTML = picks.map(renderRecommendationItem).join("");
}

function renderStats(visibleSkills, boardSkills) {
  const layerBoardSkills = getLayerBoardSkills(boardSkills);
  const beginnerCount = visibleSkills.filter((item) => item.beginnerFriendly).length;
  const risingCount = visibleSkills.filter((item) => (item.ranks?.hot && item.ranks.hot <= 15) || (item.ranks?.trending && item.ranks.trending <= 15)).length;
  const verifiedCount = visibleSkills.filter((item) => item.verificationStatus === "已核验").length;
  const hiddenCount = boardSkills.filter((item) => item.defaultHidden).length;
  const excludedByLayer = boardSkills.filter((item) => !item.defaultHidden && !matchesLayerScope(item)).length;
  const avgHeat = visibleSkills.reduce((sum, item) => sum + (item.heat?.totalHeat || 0), 0) / Math.max(1, visibleSkills.length);
  const layerMeta = getLayerMeta(STATE.layer);

  document.getElementById("statsBar").innerHTML = [
    {
      label: "当前层",
      value: layerMeta.label,
      desc: layerMeta.note
    },
    {
      label: "榜单",
      value: BOARD_META[STATE.board].label,
      desc: "当前查看的热度维度"
    },
    {
      label: "层内候选",
      value: String(layerBoardSkills.length),
      desc: `当前层保留 ${layerBoardSkills.length} 个候选`
    },
    {
      label: "当前结果",
      value: String(visibleSkills.length),
      desc: `筛选后命中 ${visibleSkills.length} 个结果`
    },
    {
      label: "已核验",
      value: String(verifiedCount),
      desc: "当前结果里的可信卡片"
    },
    {
      label: "层外 / 沉底",
      value: String(excludedByLayer + hiddenCount),
      desc: `层外 ${excludedByLayer} 个，默认沉底 ${hiddenCount} 个`
    },
    {
      label: "新手友好 / 升温",
      value: `${beginnerCount} / ${risingCount}`,
      desc: `平均热度 ${avgHeat.toFixed(1)}`
    }
  ].map((stat) => `
    <article class="stat-card">
      <div class="label">${escapeHtml(stat.label)}</div>
      <div class="value">${escapeHtml(stat.value)}</div>
      <div class="desc">${escapeHtml(stat.desc)}</div>
    </article>
  `).join("");
}

function renderNarrative(visibleSkills, boardSkills) {
  const layerBoardSkills = getLayerBoardSkills(boardSkills);
  const top = visibleSkills[0] || sortSkills(layerBoardSkills)[0];
  const selectedPersona = STATE.persona === "all" ? "全部角色" : STATE.persona;
  const selectedScenario = STATE.scenario === "all" ? "全部场景" : STATE.scenario;
  const layerMeta = getLayerMeta(STATE.layer);

  const text = top
    ? `当前是${layerMeta.label}，视角为 ${selectedPersona} × ${selectedScenario}。优先从 ${top.nameZh} 开始。`
    : "当前没有匹配结果，可以放宽角色、场景或搜索条件。";

  document.getElementById("boardNarrative").textContent = text;
  document.getElementById("resultMeta").textContent = `当前层保留 ${layerBoardSkills.length} 个候选，共展示 ${visibleSkills.length} 个结果，按「${SORT_LABELS[STATE.sort] || "推荐优先"}」排序。`;
}

function renderInsights(visibleSkills, boardSkills) {
  const layerBoardSkills = getLayerBoardSkills(boardSkills);
  const recommendationRows = visibleSkills.slice(0, 5).map((item) => `
    <div class="insight-row">
      <div>
        <strong>${escapeHtml(item.nameZh)}</strong>
        <small>${escapeHtml(item.whyNow)}</small>
      </div>
      <span class="insight-count">#${escapeHtml(item.ranks?.[STATE.board] || "-")}</span>
    </div>
  `).join("");

  const scenarioMap = {};
  layerBoardSkills.forEach((item) => {
    (item.fitScenarios || ["通用效率提升"]).forEach((scenario) => {
      scenarioMap[scenario] = (scenarioMap[scenario] || 0) + 1;
    });
  });
  const scenarioRows = topEntriesFromMap(scenarioMap, 5).map(([name, count]) => `
    <div class="insight-row">
      <div>
        <strong>${escapeHtml(name)}</strong>
        <small>当前榜单里共有 ${count} 个相关 skill。</small>
      </div>
      <span class="insight-count">${escapeHtml(count)}</span>
    </div>
  `).join("");

  const vendorMap = {};
  layerBoardSkills.forEach((item) => {
    const vendor = item.vendor || "未知来源";
    vendorMap[vendor] = (vendorMap[vendor] || 0) + 1;
  });
  const vendorRows = topEntriesFromMap(vendorMap, 5).map(([name, count]) => `
    <div class="insight-row">
      <div>
        <strong>${escapeHtml(name)}</strong>
        <small>在当前榜单里占据 ${count} 个位置。</small>
      </div>
      <span class="insight-count">${escapeHtml(count)}</span>
    </div>
  `).join("");

  document.getElementById("statusBoard").innerHTML = recommendationRows || `<div class="insight-row"><div><strong>暂无结果</strong><small>请调整筛选条件。</small></div><span class="insight-count">0</span></div>`;
  document.getElementById("scenarioBoard").innerHTML = scenarioRows || `<div class="insight-row"><div><strong>暂无结果</strong><small>请调整筛选条件。</small></div><span class="insight-count">0</span></div>`;
  document.getElementById("vendorBoard").innerHTML = vendorRows || `<div class="insight-row"><div><strong>暂无结果</strong><small>请调整筛选条件。</small></div><span class="insight-count">0</span></div>`;
}

function renderBadgeRow(item) {
  const layerBadge = item.audienceLayer === "business"
    ? "业务直用"
    : item.audienceLayer === "professional"
      ? "专业场景"
      : "跨层可用";
  const allBadges = [layerBadge, ...(item.badges || [])];
  return unique(allBadges).map((badge) => {
    const alt = /新手友好|三榜同现|业务直用|跨层可用/.test(badge) ? " alt" : "";
    return `<span class="badge${alt}">${escapeHtml(badge)}</span>`;
  }).join("");
}

function renderCard(item) {
  const rolesText = item.fitRoles?.length
    ? item.fitRoles.slice(0, 3).join(" / ")
    : "通用";
  const scenarioText = item.fitScenarios?.length
    ? item.fitScenarios.slice(0, 2).join(" / ")
    : "通用效率提升";
  const description = getCardDescription(item);
  return `
    <article class="decision-card">
      <div class="card-top">
        <div>
          <p class="card-kicker">${escapeHtml(BOARD_META[STATE.board].label)}</p>
          <h3 class="card-title">${escapeHtml(item.nameZh)}</h3>
          <p class="card-title-en">${escapeHtml(item.nameEn || item.skill)}</p>
        </div>
        <div class="rank-pill">#${escapeHtml(item.ranks?.[STATE.board] || "-")}</div>
      </div>
      <div class="badge-row">${renderBadgeRow(item)}</div>
      <div class="card-intro">
        <p class="card-summary">${escapeHtml(description.primary)}</p>
        ${description.secondary ? `<p class="card-support">${escapeHtml(description.secondary)}</p>` : ""}
      </div>
      <dl class="card-meta">
        <div class="meta-block">
          <dt>适合谁</dt>
          <dd>${escapeHtml(rolesText)}</dd>
        </div>
        <div class="meta-block">
          <dt>优先场景</dt>
          <dd>${escapeHtml(scenarioText)}</dd>
        </div>
        <div class="meta-block">
          <dt>上手难度</dt>
          <dd>${escapeHtml(item.difficulty || "低")}</dd>
        </div>
        <div class="meta-block">
          <dt>综合热度</dt>
          <dd>${escapeHtml((item.heat?.totalHeat || 0).toFixed(1))}</dd>
        </div>
      </dl>
      <div class="card-copy">
        <strong>为什么推荐</strong>
        <p>${escapeHtml(item.whyNow)}</p>
      </div>
      <div class="card-copy">
        <strong>第一句怎么问</strong>
        <p>${escapeHtml(item.firstPrompt)}</p>
      </div>
      <div class="card-actions">
        <button class="action-button" type="button" data-action="open-detail" data-key="${escapeHtml(item.key)}">查看完整解读</button>
        <a class="text-button" href="${escapeHtml(item.detailUrl)}" target="_blank" rel="noopener noreferrer">原始详情</a>
      </div>
    </article>
  `;
}

function renderDroppedCard(item) {
  const description = getCardDescription(item);
  return `
    <article class="dropped-card">
      <div class="dropped-top">
        <div>
          <h3>${escapeHtml(item.nameZh)}</h3>
          <p class="card-title-en">${escapeHtml(item.nameEn || item.skill)}</p>
        </div>
        <span class="dropped-tag">已掉榜</span>
      </div>
      <div class="card-intro">
        <p class="card-summary">${escapeHtml(description.primary)}</p>
        ${description.secondary ? `<p class="card-support">${escapeHtml(description.secondary)}</p>` : ""}
      </div>
      <div class="card-copy">
        <strong>观察建议</strong>
        <p>${escapeHtml(item.whyNow)}</p>
      </div>
      <div class="card-actions">
        <button class="action-button" type="button" data-action="open-detail" data-key="${escapeHtml(item.key)}">查看完整解读</button>
        <a class="text-button" href="${escapeHtml(item.detailUrl)}" target="_blank" rel="noopener noreferrer">原始详情</a>
      </div>
    </article>
  `;
}

function renderCards(visibleSkills, visibleDroppedSkills) {
  const currentGrid = document.getElementById("currentGrid");
  currentGrid.innerHTML = visibleSkills.length
    ? visibleSkills.map(renderCard).join("")
    : `
      <article class="empty-card">
        <h3>当前筛选下没有结果</h3>
        <p>建议先清空部分筛选，或者搜索更宽泛的关键词。</p>
      </article>
    `;

  const droppedGrid = document.getElementById("droppedGrid");
  droppedGrid.innerHTML = visibleDroppedSkills.length
    ? visibleDroppedSkills.slice(0, 12).map(renderDroppedCard).join("")
    : `
      <article class="empty-card">
        <h3>当前没有匹配的掉榜 Skill</h3>
        <p>说明你筛选到的方向目前仍以在榜技能为主。</p>
      </article>
    `;
}

function renderDrawer(item) {
  const content = document.getElementById("detailContent");
  const ranks = item.ranks || {};
  const rolesText = item.fitRoles?.length
    ? item.fitRoles.join(" / ")
    : "通用";
  const scenarioText = item.fitScenarios?.length
    ? item.fitScenarios.join(" / ")
    : "通用效率提升";

  content.innerHTML = `
    <section class="drawer-hero">
      <p class="section-kicker">Skill 详情解读</p>
      <h2>${escapeHtml(item.nameZh)}</h2>
      <p class="drawer-sub">${escapeHtml(item.nameEn || item.skill)} · ${escapeHtml(item.vendor || item.owner || "未知来源")}</p>
      <div class="badge-row" style="margin-top:14px;">${renderBadgeRow(item)}</div>
      <p class="card-summary" style="margin-top:16px;">${escapeHtml(item.detailSummaryZh || item.summaryZh)}</p>
    </section>

    <section class="drawer-section">
      <h3>这类 Skill 适合做什么</h3>
      <ul class="drawer-list">
        ${(item.useCases || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
      </ul>
    </section>

    <section class="drawer-section">
      <h3>为什么现在值得关注</h3>
      <p>${escapeHtml(item.whyNow)}</p>
    </section>

    <section class="drawer-section">
      <h3>采用判断</h3>
      <dl class="drawer-meta">
        <div>
          <dt>适合谁</dt>
          <dd>${escapeHtml(rolesText)}</dd>
        </div>
        <div>
          <dt>主要场景</dt>
          <dd>${escapeHtml(scenarioText)}</dd>
        </div>
        <div>
          <dt>上手难度</dt>
          <dd>${escapeHtml(item.difficulty || "低")}</dd>
        </div>
        <div>
          <dt>信息来源</dt>
          <dd>${escapeHtml(item.confidenceSource)}</dd>
        </div>
        <div>
          <dt>当前榜单排名</dt>
          <dd>${escapeHtml(BOARD_META[STATE.board].label)} #${escapeHtml(ranks[STATE.board] || "-")}</dd>
        </div>
        <div>
          <dt>综合热度</dt>
          <dd>${escapeHtml((item.heat?.totalHeat || 0).toFixed(1))}</dd>
        </div>
      </dl>
    </section>

    <section class="drawer-section">
      <h3>第一次怎么问</h3>
      <div class="prompt-box">
        <code>${escapeHtml(item.firstPrompt)}</code>
      </div>
      <div class="drawer-actions" style="margin-top:14px;">
        <button class="action-button" type="button" data-action="copy-prompt" data-text="${escapeHtml(item.firstPrompt)}">复制这句提问</button>
        <a class="text-button inline" href="${escapeHtml(item.detailUrl)}" target="_blank" rel="noopener noreferrer">查看原始详情</a>
      </div>
      <div id="copyFeedback" class="copy-feedback" aria-live="polite"></div>
    </section>

    <section class="drawer-section">
      <h3>你会得到什么</h3>
      <p>${escapeHtml(item.expectedOutput)}</p>
    </section>

    <section class="drawer-section">
      <h3>使用前提</h3>
      <ul class="drawer-list">
        ${(item.requirements || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
      </ul>
    </section>

    <section class="drawer-section">
      <h3>风险提醒</h3>
      <ul class="drawer-list">
        ${(item.riskNotes || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
      </ul>
    </section>

    <section class="drawer-section">
      <h3>组合建议</h3>
      <ul class="drawer-list">
        ${(item.comboSuggestions || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
      </ul>
    </section>

    <section class="drawer-section">
      <h3>榜单信号</h3>
      <dl class="drawer-meta">
        <div>
          <dt>长期热度</dt>
          <dd>#${escapeHtml(ranks.allTime || "-")} · ${escapeHtml(item.heat?.allTimeRaw || "-")}</dd>
        </div>
        <div>
          <dt>24 小时趋势</dt>
          <dd>#${escapeHtml(ranks.trending || "-")} · ${escapeHtml(item.heat?.trendingRaw || "-")}</dd>
        </div>
        <div>
          <dt>即时升温</dt>
          <dd>#${escapeHtml(ranks.hot || "-")} · ${escapeHtml(item.heat?.hotRaw || "-")}</dd>
        </div>
        <div>
          <dt>最近更新时间</dt>
          <dd>${escapeHtml(fmtDate(STATE.current?.generatedAt))}</dd>
        </div>
      </dl>
    </section>

    <section class="drawer-section">
      <h3>官方摘要原文</h3>
      <p>${escapeHtml(item.officialSummary || item.uses || "暂无官方摘要")}</p>
    </section>
  `;
}

function openDetail(key) {
  const catalogMap = getCatalogMap();
  const item = catalogMap.get(key);
  if (!item) return;

  closeMobileFilters();
  renderDrawer(item);
  document.getElementById("drawerBackdrop").hidden = false;
  document.getElementById("detailDrawer").classList.add("open");
  document.getElementById("detailDrawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}

function closeDetail() {
  document.getElementById("drawerBackdrop").hidden = true;
  document.getElementById("detailDrawer").classList.remove("open");
  document.getElementById("detailDrawer").setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function showCopyFeedback(message) {
  const node = document.getElementById("copyFeedback");
  if (!node) return;
  node.textContent = message;
  if (STATE.copyFeedbackTimer) clearTimeout(STATE.copyFeedbackTimer);
  STATE.copyFeedbackTimer = setTimeout(() => {
    node.textContent = "";
  }, 1600);
}

function render() {
  ensureScopedSelections();
  renderLayerRail();
  renderTabs();
  syncControls();
  renderPersonaRail();
  renderScenarioRail();
  renderBriefs();

  const boardSkills = getBoardSkills();
  const visibleSkills = getVisibleSkills(boardSkills);
  const visibleDroppedSkills = getVisibleDroppedSkills();

  renderRecommendations(visibleSkills);
  renderNarrative(visibleSkills, boardSkills);
  renderStats(visibleSkills, boardSkills);
  renderInsights(visibleSkills, boardSkills);
  renderCards(visibleSkills, visibleDroppedSkills);
  syncResponsiveState();
  syncUrlState();
}

function bindEvents() {
  const layerRail = document.getElementById("layerRail");
  if (layerRail) {
    layerRail.addEventListener("click", (event) => {
      const button = event.target.closest("[data-kind='layer']");
      if (!button) return;
      STATE.layer = button.dataset.id;
      ensureScopedSelections();
      collapseMobileFiltersAfterAction();
      render();
    });
  }

  document.getElementById("personaRail").addEventListener("click", (event) => {
    const button = event.target.closest("[data-kind='persona']");
    if (!button) return;
    STATE.persona = button.dataset.id;
    collapseMobileFiltersAfterAction();
    render();
  });

  document.getElementById("scenarioRail").addEventListener("click", (event) => {
    const button = event.target.closest("[data-kind='scenario']");
    if (!button) return;
    STATE.scenario = button.dataset.id;
    collapseMobileFiltersAfterAction();
    render();
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      STATE.board = tab.dataset.board;
      collapseMobileFiltersAfterAction();
      render();
    });
  });

  document.getElementById("searchInput").addEventListener("input", (event) => {
    STATE.query = event.target.value;
    render();
  });

  document.getElementById("sortSelect").addEventListener("change", (event) => {
    STATE.sort = event.target.value;
    collapseMobileFiltersAfterAction();
    render();
  });

  const clearFiltersButton = document.getElementById("clearFilters");
  if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
      STATE.persona = "all";
      STATE.scenario = "all";
      STATE.query = "";
      const searchInput = document.getElementById("searchInput");
      if (searchInput) searchInput.value = "";
      collapseMobileFiltersAfterAction();
      render();
    });
  }

  const delegateDetail = async (event) => {
    const detailButton = event.target.closest("[data-action='open-detail']");
    if (detailButton) {
      openDetail(detailButton.dataset.key);
      return;
    }
    const copyButton = event.target.closest("[data-action='copy-prompt']");
    if (copyButton) {
      try {
        await copyText(copyButton.dataset.text || "");
        showCopyFeedback("已复制，可以直接拿去试。");
      } catch {
        showCopyFeedback("复制失败，请手动选中复制。");
      }
    }
  };

  document.getElementById("recommendList").addEventListener("click", delegateDetail);
  document.getElementById("currentGrid").addEventListener("click", delegateDetail);
  document.getElementById("droppedGrid").addEventListener("click", delegateDetail);
  document.getElementById("detailContent").addEventListener("click", delegateDetail);

  document.getElementById("drawerClose").addEventListener("click", closeDetail);
  document.getElementById("drawerBackdrop").addEventListener("click", closeDetail);
  const mobileFilterOpen = document.getElementById("mobileFilterOpen");
  const mobileFilterClose = document.getElementById("mobileFilterClose");
  const mobileFilterBackdrop = document.getElementById("mobileFilterBackdrop");
  if (mobileFilterOpen) mobileFilterOpen.addEventListener("click", openMobileFilters);
  if (mobileFilterClose) mobileFilterClose.addEventListener("click", closeMobileFilters);
  if (mobileFilterBackdrop) mobileFilterBackdrop.addEventListener("click", closeMobileFilters);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeMobileFilters();
    closeDetail();
  });
  window.addEventListener("resize", syncResponsiveState);
}

async function boot() {
  if (window.__SKILLS_CURRENT__ && window.__SKILLS_HISTORY__) {
    STATE.current = window.__SKILLS_CURRENT__;
    STATE.history = window.__SKILLS_HISTORY__;
  } else {
    const [currentResp, historyResp] = await Promise.all([
      fetch("./data/skills-current.json"),
      fetch("./data/skills-history.json")
    ]);
    STATE.current = await currentResp.json();
    STATE.history = await historyResp.json();
  }

  readUrlState();
  ensureScopedSelections();
  document.getElementById("metaText").textContent = `更新于 ${fmtDate(STATE.current.generatedAt)} · 覆盖三榜前 100`;
  bindEvents();
  syncResponsiveState();
  render();
}

boot().catch((error) => {
  document.getElementById("metaText").textContent = `加载失败：${error.message}`;
});
