# 第二文化 · 微信小程序

亚文化人格测试与文化档案：31 页、14 型档案、数据可核对。

**项目主页**：https://8-321.github.io/subculture-persona/ ｜ **隐私政策**：https://8-321.github.io/subculture-persona/legal/privacy.html

---

# 第二文化 · 微信小程序

> 按 `01-UI` 29 屏定稿 + `02-动效与交互` 三件套 + `04-测试体系` 题库人格库，落成的原生微信小程序工程。  
> 需求基线见 **`05-需求V3/第二文化_需求文档_V3.0.md`（真实数据版）**：所有数字、年份、出处都必须可核对；没有来源的数字不许上屏。
> 零后端方案：本地档案、收藏、点赞、历史、报告全部走本地存储，云开发留作后续增强。

**上线状态（2026-11-03 03:07）**：31 页 / 包体 1,579,157 字节 / `verify` 68 项全绿 / `smoke` 45 项全绿；**1.1.1 已上传**（微信侧 ✔ upload，预览码 `.workbuddy/preview-1.1.1.png`）。  
**界面回归**：1.0 / 1.3 / 1.6 倍系统字号 + 320px 小屏，32 页「裁剪 0 · 挤字 0 · 溢出父框 0」。  
**体验版可上传；正式提审仍有 3 个外部阻断**：真实邮箱、隐私政策 HTTPS 链接、运营主体（另需 ICP 备案）。  
完整评审与路线见 **`05-需求V3/第二文化_上线评审_V4.md`**；一键核对：`npm run preflight`。

---

## 1. 导入与运行

1. 下载安装 **微信开发者工具**（独立 IDE，必须由本人微信扫码登录）：  
   <https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html>
2. 打开工具 →「导入项目」→ 目录选 **`miniprogram/`**。
3. AppID：
   - 当前工程已绑定 `wx669bf4366c75627d`（第二文化）；换账号时改 `miniprogram/project.config.json` 的 `appid`。
   - 只想看界面 → 导入界面选「测试号」，但上传与真机能力会受限。
4. 导入后点「编译」，模拟器即可跑通；「预览」可真机扫码。
5. 上传：「上传」填版本号 → 公众平台「版本管理」→「提交审核」→ 类目建议「工具 - 信息查询」。  
   **上传这一步需要本人扫码，AI 无法代劳。**

离线自检（随时可跑）：

```bash
node verify.js
```

---

## 2. 工程结构

```
miniprogram/
├── project.config.json      AppID / 编译配置
├── app.json                 31 个页面 + 自定义 tabBar + custom 导航
├── app.js                   全局：主题、登录态、埋点口、未登录拦截
├── app.wxss                 设计 token（浅/深双模式）+ 通用组件 + @import 动效库
├── styles/
│   └── motion.wxss          动效库：53 个动效类 / 39 组 keyframes（见 §3）
├── audio/                   7 个音效 wav，共 81 KB（gen_audio.py 生成）
├── custom-tab-bar/          悬浮胶囊 Tab 栏（切 Tab 走 Nav.tab → T5）
├── data/
│   ├── bank.js              30 题题库（由 04-测试体系/题库_爆款版.json 生成）
│   ├── types.js             14 型人格库（同上，来自 人格库_14型.json）
│   └── content.js           测试 / 商品 / 社区 / 文章 / 兴趣 / 穿搭 / 筛选项
├── utils/
│   ├── engine.js            计分与判定（纯函数，可被 Node 直接 require）
│   ├── store.js             本地存储：收藏 / 点赞 / 历史 / 报告 / 进度
│   ├── ui.js                主题同步、Toast、震动、防连点、Tab 高亮
│   ├── motion.js            动效调度：交错 / 补间 / 码表 / 火花 / 解密 / 揭示
│   ├── sound.js             声音系统：7 种语义音效 + 开关 + 预算
│   ├── nav.js               跳转中枢：T1~T5 转场 + 音效 + 震动 + 栈守卫
│   ├── stat.js              数字闸门：无后台来源的数字一律「待接入」（正式版自动关）
│   ├── privacy.js           隐私授权：__usePrivacyCheck__ + ensure 三态（同意/拒绝/老基础库）
│   ├── track.js             埋点：22 事件白名单 + 本机 300 条环形日志（不上报）
│   ├── qualify.js           商家资质：统一社会信用代码校验位 + 联系方式校验
│   └── filter.js            筛选内核：商城 / 分类 / 搜索 / 筛选页共用同一口径
├── images/ui/               38 张压缩素材（共 0.97 MB）
├── images/tab/              tabBar 图标 10 个（圆 + 二 商标等比）
├── images/ic/               全站线性图标 78 个（ink / white 双色）
├── tools/                   素材/数据构建：build_images.py / build_data.py / gen_icons.py / gen_audio.py
│                            数据管线：build_realfacts.py / patch_articles.py（在 miniprogram/tools/）
└── pages/                   31 个页面
```

---

## 3. 页面清单（对应设计稿编号）

| #  | 设计稿            | 页面路径                                  | 说明                                 |
| -- | -------------- | ------------------------------------- | ---------------------------------- |
| 1  | 01 / 19        | `pages/home/home`                     | 首页：4 张轮播 + 推荐品类 + 测试横滑 + 下拉刷新      |
| 2  | 02-tests       | `pages/tests/tests`                   | 测评列表：6 分类 + 主推卡 + 双列网格             |
| 3  | 22 / 22b       | `pages/community/community`           | 第二文化：双列瀑布流，示例内容明确标注；投稿只存本机草稿 |
| 4  | 05 / 05b       | `pages/shop/shop`                     | 商城：分类条 + 排序 + 筛选入口（跳转独立筛选页）+ 已选条件条 |
| 5  | 12             | `pages/mine/mine`                     | 我的：人格头图 + 兴趣 + 三宫格 + 深色开关          |
| 6  | 18 / 02-intro  | `pages/test-detail/test-detail`       | 测试详情：数据条 + 你会被问到 + 收藏 + 继续答题       |
| 7  | 03             | `pages/question/question`             | 答题：2×2 选项、进度、计时、320ms 自动下一题、进度保存   |
| 8  | —              | `pages/generating/generating`         | 生成中：2 秒读完四步，减弱动效时 0.5 秒；不故意拖时间 |
| 9  | 04 / 04b / 04c | `pages/result/result`                 | 结果 + 文字报告 + 推荐（一页下滑，含 count-up）    |
| 10 | 11             | `pages/search/search`                 | 搜索：联想（防抖 300ms）+ 历史 + 分类筛选 + 空态    |
| 11 | 23             | `pages/category/category`             | 分类：一级竖排 + 二级横排 + 网格                |
| 12 | 13             | `pages/shop-detail/shop-detail`       | 商品详情：多图 + 店铺名片 + 收藏 + 找同款（外链二次确认） |
| 13 | 24 + 文章        | `pages/post-detail/post-detail`       | 帖子详情：配乐 + 同款好物 + 收藏点赞 + 举报；文章分享带类型 |
| 14 | 25             | `pages/post-publish/post-publish`     | 写投稿 / 存草稿：图片落本机、可回填、可复制投稿文本     |
| 15 | 26             | `pages/merchant-apply/merchant-apply` | 申请成为商家                             |
| 16 | 28             | `pages/followed-shops/followed-shops` | 关注的商家：只显示真正关注过的店；空态给去商城入口       |
| 17 | 14 / 14b       | `pages/favorites/favorites`           | 收藏三段：帖子收藏 / 点赞 / 商城收藏              |
| 18 | 15             | `pages/history/history`               | 浏览历史：今天 / 昨天 / 更早 + 清空确认           |
| 19 | 16             | `pages/reports/reports`               | 我的报告：四维缩略条，长按删除                    |
| 20 | 17             | `pages/settings/settings`             | 设置：深色模式 + 主题预览 + 减弱动效 + 清除缓存       |
| 21 | 07             | `pages/register/register`             | 本地建档：头像 + 昵称 + 协议；不收集手机号、不上传       |
| 22 | 08             | `pages/interests/interests`           | 兴趣选择：图片卡多选，≥3 才可进入                 |
| 23 | 05b（改独立页）     | `pages/filter/filter`                 | 独立筛选页：左分组右选项，跳转进来即是筛选界面，可下拉关闭    |
| 24 | 04 延伸          | `pages/type/type`                     | 人格档案：起源 / 误解 / 合拍相克 / 选物 / 阅读，可分享     |
| 25 | 新增             | `pages/card/card`                     | 人格名片：Canvas 750×1180，档案编号水印，保存到相册      |
| 26 | 新增             | `pages/legal/legal`                   | 隐私政策 / 用户协议 / 未成年人保护三合一，同源生成线上页   |
| 27 | 新增             | `pages/cooperation/cooperation`       | 品牌 / 场地 / 商家合作：三档产品包 + 咨询模板 + 客服     |
| 28 | 新增             | `pages/drafts/drafts`                 | 我的草稿：投稿未公开时完整保留在本机                    |
| 29 | 13 延伸          | `pages/shop-home/shop-home`           | 店铺档案：店内在列 + 关注 + 只展示不交易                |
| 30 | 兼容             | `pages/index/index`                   | 旧首页路径兼容，onLoad 后 reLaunch 到 home          |

---

## 4. 动效体系（多种动效，不再只有一种）

> 参数底座：《第二文化_动效设计规范》V1.0 —— 6 档时长（t0 100 / t1 240 / t2 300 / t3 380 / t4 420 / t5 1200~3000）、
> 6 条曲线（A 减速 / B 过冲 / C 快出慢收 / D 缓入快出 / E 匀速 / F 长尾）。
> 效果目录参照 reactbits 组件体系（Text Animations / Animations / Components / Backgrounds），
> 用 WXSS + WXS 重写 —— reactbits 是 React 组件库，小程序跑不了，只借鉴「效果思路 + 参数」。

### 4.1 动效库 `styles/motion.wxss`（53 个类 / 39 组 keyframes）

| 族              | 类（示例）                                                                                          | 用在哪                   |
| -------------- | --------------------------------------------------------------------------------------------- | --------------------- |
| 入场（12）         | `m-fade` `m-rise` `m-rise-lg` `m-blur` `m-pop` `m-pop-lg` `m-drop` `m-flip` `m-slide-r` `m-mask` `m-unfold` `m-pixels` | 卡片、标题、弹层、文字逐行揭示     |
| 强调（11）         | `m-shine` `m-shine-once` `m-glow` `m-border` `m-glare` `m-tilt` `m-magnet` `m-sel` `m-jelly` `m-heart` `m-ripple` `m-spark` | 扫光、3D 倾斜、磁吸、收藏心三段、点击火花 |
| 循环（7）          | `m-breathe` `m-float` `m-kenburns` `m-shimmer` `m-pulse-dot` `m-wave` `m-dotgrid`                 | 加载、轮播推近、骨架、氛围背景        |
| 转场（8）          | `t1-in/out` `t2-hero/t2-text` `t3-up/mask/down` `t4-pop` `t5-in`                                | T1 推入 / T2 共享元素 / T3 抽屉 / T4 弹层 / T5 Tab |

reactbits 对应关系：`BlurText→m-blur`、`SplitText→m-mask`、`ShinyText→m-shine`、`ClickSpark→m-spark`、
`GlareHover→m-glare`、`TiltCard→m-tilt`、`StarBorder→m-border`、`PixelTransition→m-pixels`、
`ScrollReveal→m-rv + motion.reveal()`、`CountUp→motion.countUp()`、`DecryptedText→motion.decrypt()`。

### 4.2 调度器 `utils/motion.js`

- `stagger(list, 26, 0, 10)` —— 交错入场，长列表只做前 10 项
- `countUp / countUpList` —— 码表数字滚动 700ms 曲线 F，多位数逐位错峰 40ms
- `decrypt` —— 人格名解密式逐字显现
- `reveal` —— IntersectionObserver，元素进入视口才播（瀑布流用）
- `spark / sparkAt` —— 点击火花粒子
- `tiltOf / magnetOf` —— 跟手 3D 倾斜（±2.5°）与磁吸偏移
- 内置 cubic-bezier 求解器，六条曲线与规范一一对应

### 4.3 各页动效分工（不是全站一个动效）

| 页面          | 用到的动效                                                         |
| ----------- | -------------------------------------------------------------- |
| 首页          | 轮播 Ken Burns 推近、标题模糊上浮、副标延迟淡入、品牌名扫光、卡片 3D 倾斜 + 高光、点击火花、断点续答卡上浮 |
| 商城          | 商品卡交错弹入、图片 3D 倾斜 + 高光、收藏心三段、分类切换整块侧向推入重播、结果数码表滚动              |
| 独立筛选页       | T3 从下升起、分组切换选项交错弹入、已选 chip 过冲、结果数码表滚动、顶部拖拽跟手 + 弹簧回弹、落下关闭       |
| 结果页         | T2 共享元素放大、人格名解密显现、标签交错弹入、金句遮罩揭示、维度码表滚动、完成音                    |
| 社区          | 瀑布流揭示式入场（滚到哪播到哪）、分类切换淡入重播                                      |
| 答题页         | 题干整块侧向推入重播、选项选中回弹 `m-sel`、勾选码表音                                 |
| 搜索 / 分类 / 测评 | 热词与结果交错入场、卡片 3D 高光、筛选入口                                        |

> 硬规则延续：所有光晕、流光、扫光一律黑灰白，`verify.js` 第 7c 项会扫彩色。

---

## 5. 声音系统

`utils/sound.js` + `audio/*.wav`（纯 Python 生成，单声道 16bit 22050Hz，合计 81 KB）。

| 音效      | 时长    | 触发场景              |
| ------- | ----- | ----------------- |
| tap     | 40ms  | 分类切换、勾选、次级按钮      |
| pop     | 150ms | 收藏心、关注、重要选中       |
| slide   | 280ms | 筛选页进出、清空条件        |
| whoosh  | 340ms | 页面跳转（T1 / T2）     |
| chime   | 780ms | 结果生成完成            |
| warn    | 240ms | 未登录拦截、外链确认、表单校验   |
| tick    | 50ms  | 答题选中、码表吸附         |

- 设置页新增「操作音效」开关（默认开），写入本地配置
- 预算：全局 70ms、同名音效 120ms，不叠音
- 遵守系统静音键（`obeyMuteSwitch`），创建失败静默降级不报错

---

## 6. 跳转中枢 `utils/nav.js`

| 方法            | 转场     | 说明                          |
| ------------- | ------ | --------------------------- |
| `Nav.push()`  | T1 推入  | 380ms/C，常规二级页               |
| `Nav.hero()`  | T2 共享  | 420ms/C，卡片→详情，图片放大成头图       |
| `Nav.drawer()`| T3 抽屉  | 420ms/D，跳转进独立筛选页            |
| `Nav.tab()`   | T5 Tab | 320ms/C，内容淡入 + 上移 8px       |
| `Nav.backWith()` | —   | 返回并把结果回写上一页（`onBackFrom`）   |
| `Nav.confirmOut()` | T4 | 外链确认弹层 + heavy 震动 + 提示音     |

统一带：防连点 400ms、页面栈守卫（≥9 层自动 `redirectTo`）、跳转音效、震动、`{{tr}}` 转场类注入。
`verify.js` 第 7e 项确保全站没有残留的 `UI.go / wx.navigateTo / wx.switchTab`。

---

## 7. 独立筛选页（不再是点一下才弹出）

- 入口：商城 / 分类 / 搜索页的「筛选」→ `Nav.drawer('/pages/filter/filter' + 条件)`，**跳转后立刻就是筛选界面**
- 布局：左侧分组导航（排序 / 价格 / 风格 / 品牌 / 尺码 / 服务）+ 右侧选项区，价格支持自定义区间与 4 个快捷区间
- 关闭：右上角关闭、顶部下拉拖拽（>120px 或快速下拉即关，否则弹簧回弹）
- 结果：`Nav.backWith()` 回写上一页 `onBackFrom`，列表页与筛选页共用 `utils/filter.js`，口径必然一致
- 新增「服务」筛选项，商品数据补齐 `sizes` / `services` 字段

---

## 8. 数据层与计分口径

- **题库**：30 题 × 4 选项（爆款版），每题落 3 个亚文化人格分（主 +3 / 次 +2 / 再 +1）+ 四维度分。
- **人格库**：14 型（朋克 / 哥特 / 洛丽塔 / 街头 / 赛博 / 蒸汽波 / 摇滚 / 嘻哈 / 街舞 / 滑板 / 机车 / JK / 暗黑 / 潮流），  
  每型含昵称、代号、金句、标签、对应 MBTI、三条判定理由、合拍与相克。
- **平衡系数**：沿用题库自带的 14 型校准系数（4 万次随机作答校准），保证出率均等。
- **平局规则**：出现题数多 → 含最后一题得分 → 人格库顺序靠前。
- **彩蛋**：第一名 / 第二名 ≥ 0.965 时，结果页显示「你也有一点 X 的影子」。
- **四维展示值**：`clamp(32 + (raw-lo)/(hi-lo)*60, 12, 96)`，按 30 题等效分归一（短测试同样可比）。
- **轻量测试**：11 个轻量测试共用同一套题库与引擎，各自取 8~12 题子集，`qcount` 与子集一致。

---

## 9. 已落实的硬规则

| 规则                  | 落地方式                                                     |
| ------------------- | -------------------------------------------------------- |
| R1 界面无英文            | `verify.js` 第 7 项：剥掉标签与 `{{}}` 后扫文本节点，`[A-Za-z]` 命中为 0   |
| R2/R3 只有一套主色        | 全站 token 唯一 `--ink:#141418`；深色照片上的按钮反白                   |
| R4 无装饰小字 / 无「无广告免费」 | 文案表已按此写                                                  |
| R5 照片真实色彩           | 素材只做压缩与裁切，不加蒙版、不做 hue 旋转                                 |
| 触发热区 ≥ 44           | 图标视觉 28~40px 时，外层容器热区均 ≥ 76rpx（≈38px，设计规范值）              |
| 底部安全垫 ≥ 92px        | 所有滚动页 `.safe-pad` = 200rpx + 底部渐隐                        |
| 减弱动效                | 设置页开关；全站 31 页根节点均带 `reduce-motion`，位置类动画落到终值、循环类停掉（校验第 7g 项） |
| 动效无彩色               | 光晕 / 流光 / 扫光全黑灰白，`verify.js` 第 7c 项扫描 hex 与 rgb 三通道差值 ≤ 4 |
| 操作音效                | 7 个语义音效可在设置页关掉；遵守系统静音键                                   |
| 商城只推荐不收款            | 全站无「购买 / 加购 / 支付」入口；商品详情底栏只有收藏 + 立即跳转                    |
| 结果合规声明              | 结果页常驻「结果仅供兴趣参考，不是心理诊断」                                   |
| R6 数字必须有来源          | `utils/stat.js` 是唯一出口；`app.js` 按 `envVersion` 关闸，正式版无后台数据即显示「待接入」；`verify.js` 第 [9] 项拦截硬编码 |
| R7 文化事实必须有出处        | `data/realfacts.js`（14 型，由 `05-需求V3/真实文化档案_14型.json` 生成）；结果页「这个亚文化从哪来」可复制出处链接 |
| R8 文章必须有出处          | 8 篇知识库文章每篇带 `facts[].src` + `sources[].url`，正文末段写「出处：××」 |
| R9 隐私接口必须过 ensure     | `app.json __usePrivacyCheck__: true`；选图、复制链接全部走 `utils/privacy.js`，被拒时给「查看指引」入口 |
| R10 内容必须有举报入口      | 详情页右上「···」→ 5 类理由；同一内容 3 次先隐藏待复核，列表/搜索/分类统一过滤 |
| R11 价格只能来自商家录入     | 全站价格走 `Stat.price()`；没有采价记录就写「价格以商家为准」，不显示旧价 |
| R12 埋点必须走白名单         | `utils/track.js` 登记事件；未登记的直接丢弃并告警；只存本机 300 条环形，设置页可查可清，不含手机号 |
| R16 顶栏必须避让系统胶囊     | 顶栏用 `UI.capsuleRight()` 的 `capR` 让位、整行控件用 `UI.capsuleBottom()` 的 `capB` 下移；顶栏图标统一 68rpx 浅底（`app.wxss .icbtn`），禁止再出现 80rpx 黑圆 |
| R14 示例内容必须打标         | 26 条 demo 内容（帖子/商品/店铺）在列表与详情都显示「示例」，社区首屏常驻说明；正式版接入后台后 demo 内容必须为 0 |
| R15 不做交易承诺             | 界面禁用「包邮 / 正品 / 支持直接下单 / 好评率 / 七天无理由 / 销量第一 / 假一赔十」7 个词，`verify.js` 静态拦截 |
| R13 资质只登记不冒充审核     | 商家登记必须过 `qualify.creditCode`（校验位算法），文案不许写「审核中/1-3 个工作日」；没有审核后台就说没有 |

---

## 10. 已知限制 / 待客户拍板

> 完整 14 条决策见 `05-需求V3/第二文化_需求文档_V3.0.md` §9（每条给 A/B 选项与建议）。

| # | 事项             | 当前处理                                                   |
| - | -------------- | ------------------------------------------------------ |
| 1 | 小程序主体（个人 / 企业） | 已按个人主体实现：外链走「复制链接」，不用 `web-view`；**但社区类目与商家入驻需企业主体 + ICP 备案**（V3.0 §2） |
| 2 | 账号体系            | 当前是**本地档案**：昵称/头像/报告只存本机，不收集手机号；没有云同步 |
| 3 | 内容是否接后台        | 当前全本地数据；接接口时替换 `data/content.js` 即可，页面不变               |
| 4 | 答题进度云同步        | 本地缓存已做，云同步随接口扩展 `utils/store.js`                       |
| 5 | 筛选「筛出 Y 件」     | 本地实时计算；筛选已改独立页面，列表页与筛选页共用 `utils/filter.js` 同一口径 |
| 6 | 搜索历史           | 已记录，可清空                                                |
| 7 | 报告删除           | 已做（长按 + 确认）                                            |
| 8 | 店铺主页           | 已补 `pages/shop-home`；商品与店铺仍为示例，正式版需商家后台录入 |
| 9 | AppID          | `wx669bf4366c75627d`（已验证可 upload）                                   |
| 10 | 真实商家与商品       | 示例品牌为虚构，正式版只展示已入驻商家（V3.0 §4 L2）                     |
| 11 | 出率偏差          | 实测 5.85%—8.37%（±1.29pp），P1 重跑 `build_calib.py` 压到 ±0.5pp |
| 12 | 隐私指引 / 备案     | 站内文本与可托管页已就绪（`05-需求V3/legal-site`）；**在线 HTTPS 链接、运营主体、备案号仍未填**，`node tools/launch_check.js` 会拦住 |
| 13 | 上线闸门 | 体验版可上传；正式提审仍有 3 个外部阻断：真实邮箱 / 隐私政策 HTTPS 链接 / 运营主体（另需 ICP 备案） |

---

## 11. 工具脚本

```bash
# 重新生成数据层（题库 / 人格库 JSON → data/*.js）
python miniprogram/tools/build_data.py

# 重新压缩素材（01-UI/assets → images/ui，1:1 400px / 大图 750px）
python miniprogram/tools/build_images.py

# 重新生成图标（tabBar 81px + 全站线性图标 96px，纯 Python PNG，无第三方依赖）
python miniprogram/tools/gen_icons.py

# 重新生成音效（7 个 wav，纯标准库：wave + struct + math）
python miniprogram/tools/gen_audio.py

# 离线校验（语法 / 数据 / 引擎 / 硬规则 / 数据真实性 / 体积）
node verify.js

# 14 型出率复测（4 万次随机作答，可传次数与种子）
node tools/calib_report.js

# 数字闸门双环境对拍（开发版有数 → 正式版「待接入」）
node tools/gate_test.js

# 上线前检查：页面完整性 / 路由 / 占位文案 / 主包体积 / 邮箱 / 隐私链接 / 主体
node tools/launch_check.js

# 由站内唯一法务文本生成可托管的线上页（05-需求V3/legal-site）
node tools/build_legal_site.js

# 由 14 型真实档案重建 data/realfacts.js
python miniprogram/tools/build_realfacts.py

# 把 05-需求V3/知识库文章_源.js 的真实文章写回 content.js（幂等）
python miniprogram/tools/patch_articles.py
```

> 三个 Python 脚本需 Pillow 仅 `build_images.py` 用到；其余只用标准库。

---

## 12. 自检结果（当前）

```
通过 68 项｜失败 0 项｜提醒 0 项
主包（含素材）1.61 MB
[9] 数据真实性 7 项：真实档案 14 型 / 出处可解析 / 8 篇文章有出处 / demo 标记 / 闸门存在 / release 自动关闭 / 无硬编码数字
[10] 交付完整性 6 项：隐私开关 / 隐私必经 ensure / 举报链路 / 无直出价格与互动数 / 模块引用完整 / 无 TODO
冒烟（node tools/smoke_test.js）：46 项通过｜举报阈值 3 次隐藏 / 闸门双环境 / 隐私三态 / 埋点白名单 / 举报聚合撤销 / 执照号校验
上线闸门（node tools/launch_check.js）：7 通过 / 1 提醒 / 3 阻断（真实邮箱、隐私 HTTPS 链接、运营主体）
```
