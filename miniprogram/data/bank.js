// 本文件由 tools/build_data.py 自动生成，请勿手改
// 来源：04-测试体系/《题库_爆款版.json》《人格库_14型.json》

const meta = {
 "name": "隐藏亚文化人格测试 · 爆款版",
 "version": "2.0",
 "date": "2026-10-07",
 "count": 30,
 "minutes": 3,
 "style": "抽象语言风格（40% 荒诞 + 60% 生活）；题干是「一句脑洞 + 一个动作」，选项是自己会念出来的那种短句，不是标签词。",
 "desc": "30 道场景题 · 约 3 分钟 · 14 种亚文化人格。题目走「抽象脑洞 + 日常第一反应」，不说行话；选项都是短句，选完能记住自己选了哪句。",
 "scoring": {
  "style": "每个选项给 3 个亚文化人格加分（主 +3 / 次 +2 / 再 +1）。30 题答完求和，最高分者即结果人格。",
  "balance": "每个型附带平衡系数（脚本自动计算），保证 14 型在随机作答下的出现机会均等。",
  "tie_break": [
   "出现题数多者优先",
   "含最后一题得分者优先",
   "priority 列表靠前者优先"
  ],
  "dims": "四个维度（反叛倾向/独立表达/审美自主/社交开放度）按选项 dims 累加，用 dims_display 的线性映射展示。",
  "balance_factors": {
   "PUNK": 1.107,
   "GOTH": 1.039,
   "LOTA": 1.212,
   "STR8": 1.137,
   "CYB3": 1.183,
   "V4PR": 1.198,
   "ROCK": 1.442,
   "HHOP": 1.219,
   "DANC": 1.201,
   "SK8R": 1.359,
   "BIKR": 1.446,
   "JK": 1.142,
   "DARK": 0.915,
   "TRND": 1.28
  },
  "balance_note": "经 4 万次随机作答模拟校准：14 型出率 6.64%~7.92%（目标 7.14%），无冷门型；彩蛋触发率约 21%。",
  "egg_rule": "第一名与第二名（平衡后分数）比值 ≥ 0.96 时，结果页显示「你也有一点 {第二名} 的影子」；实测触发率约 21%。",
  "dims_display": {
   "method": "display = round(clamp(32 + (raw-lo)/(hi-lo)*60, 12, 96))，lo/hi 取随机作答分布的 5%/95% 分位",
   "scale": {
    "rebel": [
     16,
     30
    ],
    "express": [
     17,
     27
    ],
    "aesthetic": [
     16,
     29
    ],
    "social": [
     16,
     29
    ]
   }
  },
  "egg_ratio": 0.965
 },
 "priority": [
  "PUNK",
  "GOTH",
  "LOTA",
  "STR8",
  "CYB3",
  "V4PR",
  "ROCK",
  "HHOP",
  "DANC",
  "SK8R",
  "BIKR",
  "JK",
  "DARK",
  "TRND"
 ]
};
const bank = [
 {
  "id": "q1",
  "topic": "第一眼",
  "text": "刷到四张图的时候，你的眼睛会先停在哪一张？",
  "options": [
   {
    "key": "a",
    "title": "蕾丝与缎带",
    "sub": "甜系·层叠",
    "styles": {
     "LOTA": 3,
     "V4PR": 2,
     "JK": 1
    },
    "dims": {
     "aesthetic": 2,
     "rebel": 1
    },
    "img": "q-a.jpg"
   },
   {
    "key": "b",
    "title": "铆钉与旧皮",
    "sub": "磨损·锋利",
    "styles": {
     "PUNK": 3,
     "ROCK": 2,
     "STR8": 1
    },
    "dims": {
     "rebel": 2,
     "express": 1
    },
    "img": "m-q-b.jpg"
   },
   {
    "key": "c",
    "title": "束带与反光",
    "sub": "结构·冷感",
    "styles": {
     "CYB3": 3,
     "DARK": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    },
    "img": "q-c.jpg"
   },
   {
    "key": "d",
    "title": "洗旧的牛仔",
    "sub": "直白·耐穿",
    "styles": {
     "STR8": 3,
     "SK8R": 2,
     "BIKR": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    },
    "img": "q-d.jpg"
   }
  ]
 },
 {
  "id": "q2",
  "topic": "耳机",
  "text": "耳机里放什么，决定你和世界的关系。",
  "options": [
   {
    "key": "a",
    "title": "把世界调成背景音",
    "sub": "慢速·失真",
    "styles": {
     "V4PR": 3,
     "DARK": 2,
     "GOTH": 1
    },
    "dims": {
     "express": 2,
     "rebel": 1
    }
   },
   {
    "key": "b",
    "title": "一首歌循环到耳朵起茧",
    "sub": "单曲·上瘾",
    "styles": {
     "ROCK": 3,
     "PUNK": 2,
     "GOTH": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "c",
    "title": "用噪音盖住噪音",
    "sub": "白噪·清场",
    "styles": {
     "DARK": 3,
     "CYB3": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "d",
    "title": "只留人声，其余丢掉",
    "sub": "节奏·入耳",
    "styles": {
     "DANC": 3,
     "HHOP": 2,
     "JK": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   }
  ]
 },
 {
  "id": "q3",
  "topic": "凌晨三点",
  "text": "凌晨三点，你在替谁加班？",
  "options": [
   {
    "key": "a",
    "title": "给白天没回的消息编借口",
    "sub": "复盘·内耗",
    "styles": {
     "GOTH": 3,
     "JK": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "b",
    "title": "把明天的台词先背一遍",
    "sub": "预习·紧张",
    "styles": {
     "JK": 3,
     "STR8": 2,
     "TRND": 1
    },
    "dims": {
     "aesthetic": 2,
     "rebel": 1
    }
   },
   {
    "key": "c",
    "title": "直接出门，骑到天亮",
    "sub": "出逃·兜风",
    "styles": {
     "BIKR": 3,
     "SK8R": 2,
     "DARK": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   },
   {
    "key": "d",
    "title": "修点东西，天亮再睡",
    "sub": "手工·治愈",
    "styles": {
     "SK8R": 3,
     "PUNK": 2,
     "STR8": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   }
  ]
 },
 {
  "id": "q4",
  "topic": "被说奇怪",
  "text": "有人说你审美「很奇怪」。你的第一反应？",
  "options": [
   {
    "key": "a",
    "title": "先记下这句话，回头用得着",
    "sub": "素材·收集",
    "styles": {
     "TRND": 3,
     "HHOP": 2,
     "JK": 1
    },
    "dims": {
     "aesthetic": 2,
     "social": 1
    }
   },
   {
    "key": "b",
    "title": "笑着解释，最后变成科普",
    "sub": "温柔·输出",
    "styles": {
     "LOTA": 3,
     "JK": 2,
     "DANC": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   },
   {
    "key": "c",
    "title": "当场怼回去，讲道理那种",
    "sub": "不吃闷亏",
    "styles": {
     "STR8": 3,
     "PUNK": 2,
     "ROCK": 1
    },
    "dims": {
     "social": 2,
     "express": 1
    }
   },
   {
    "key": "d",
    "title": "心里默默给人建了个档案",
    "sub": "冷处理",
    "styles": {
     "CYB3": 3,
     "DARK": 2,
     "GOTH": 1
    },
    "dims": {
     "express": 2,
     "rebel": 1
    }
   }
  ]
 },
 {
  "id": "q5",
  "topic": "房间",
  "text": "你的房间最像？",
  "options": [
   {
    "key": "a",
    "title": "施工现场，工具摊一地",
    "sub": "未完工",
    "styles": {
     "PUNK": 3,
     "SK8R": 2,
     "BIKR": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   },
   {
    "key": "b",
    "title": "练歌房，墙是隔音棉",
    "sub": "音量拉满",
    "styles": {
     "ROCK": 3,
     "HHOP": 2,
     "DANC": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "c",
    "title": "更衣间，三面都是衣柜",
    "sub": "造型仓库",
    "styles": {
     "HHOP": 3,
     "TRND": 2,
     "LOTA": 1
    },
    "dims": {
     "social": 2,
     "express": 1
    }
   },
   {
    "key": "d",
    "title": "小舞台，地板被踩亮了",
    "sub": "随时开场",
    "styles": {
     "DANC": 3,
     "V4PR": 2,
     "JK": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   }
  ]
 },
 {
  "id": "q6",
  "topic": "走路",
  "text": "在人群里，你的走法是？",
  "options": [
   {
    "key": "a",
    "title": "贴边走最快的线",
    "sub": "抄近路",
    "styles": {
     "SK8R": 3,
     "BIKR": 2,
     "STR8": 1
    },
    "dims": {
     "rebel": 2,
     "express": 1
    }
   },
   {
    "key": "b",
    "title": "走成一条直线，不停",
    "sub": "目的地感",
    "styles": {
     "BIKR": 3,
     "STR8": 2,
     "DARK": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "c",
    "title": "跟着节奏点踩拍子",
    "sub": "自带背景音",
    "styles": {
     "JK": 3,
     "DANC": 2,
     "HHOP": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   },
   {
    "key": "d",
    "title": "边走边刷手机，人是背景",
    "sub": "半离线",
    "styles": {
     "V4PR": 3,
     "CYB3": 2,
     "DARK": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   }
  ]
 },
 {
  "id": "q7",
  "topic": "撤回",
  "text": "如果人生有撤回键，你最想撤回？",
  "options": [
   {
    "key": "a",
    "title": "那句没说完的话",
    "sub": "卡在喉咙",
    "styles": {
     "GOTH": 3,
     "V4PR": 2,
     "JK": 1
    },
    "dims": {
     "express": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "b",
    "title": "那次忍下来的脾气",
    "sub": "存档·未爆",
    "styles": {
     "DARK": 3,
     "PUNK": 2,
     "GOTH": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "c",
    "title": "那个太顺从的选择",
    "sub": "想重选",
    "styles": {
     "LOTA": 3,
     "JK": 2,
     "STR8": 1
    },
    "dims": {
     "aesthetic": 2,
     "social": 1
    }
   },
   {
    "key": "d",
    "title": "不撤，都是素材",
    "sub": "全都留着",
    "styles": {
     "TRND": 3,
     "HHOP": 2,
     "DANC": 1
    },
    "dims": {
     "aesthetic": 2,
     "social": 1
    }
   }
  ]
 },
 {
  "id": "q8",
  "topic": "删内存",
  "text": "手机内存不够，你第一个删？",
  "options": [
   {
    "key": "a",
    "title": "先删别人推荐给我的",
    "sub": "不听建议",
    "styles": {
     "PUNK": 3,
     "ROCK": 2,
     "DARK": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   },
   {
    "key": "b",
    "title": "相册里那 2000 张截图",
    "sub": "断舍离",
    "styles": {
     "STR8": 3,
     "CYB3": 2,
     "V4PR": 1
    },
    "dims": {
     "social": 2,
     "rebel": 1
    }
   },
   {
    "key": "c",
    "title": "所有没打开过的 App",
    "sub": "系统清理",
    "styles": {
     "CYB3": 3,
     "DARK": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "d",
    "title": "谁都不删，直接换手机",
    "sub": "暴力解法",
    "styles": {
     "SK8R": 3,
     "BIKR": 2,
     "HHOP": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   }
  ]
 },
 {
  "id": "q9",
  "topic": "现场",
  "text": "演出看不见舞台，你？",
  "options": [
   {
    "key": "a",
    "title": "跟着人浪往前挤",
    "sub": "现场动物",
    "styles": {
     "HHOP": 3,
     "DANC": 2,
     "STR8": 1
    },
    "dims": {
     "social": 2,
     "express": 1
    }
   },
   {
    "key": "b",
    "title": "闭眼自己跳，位置不重要",
    "sub": "自带节拍",
    "styles": {
     "DANC": 3,
     "HHOP": 2,
     "V4PR": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "c",
    "title": "站后排，声音大的地方最好",
    "sub": "听感优先",
    "styles": {
     "ROCK": 3,
     "GOTH": 2,
     "PUNK": 1
    },
    "dims": {
     "rebel": 2,
     "express": 1
    }
   },
   {
    "key": "d",
    "title": "去后台看设备",
    "sub": "硬核兴趣",
    "styles": {
     "PUNK": 3,
     "CYB3": 2,
     "BIKR": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   }
  ]
 },
 {
  "id": "q10",
  "topic": "抽屉底层",
  "text": "抽屉最底层留着？",
  "options": [
   {
    "key": "a",
    "title": "一张没送出去的明信片",
    "sub": "存档",
    "styles": {
     "JK": 3,
     "LOTA": 2,
     "GOTH": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   },
   {
    "key": "b",
    "title": "一条舍不得穿的裙子",
    "sub": "等等再说",
    "styles": {
     "LOTA": 3,
     "JK": 2,
     "TRND": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   },
   {
    "key": "c",
    "title": "一盘老磁带，或者一张旧图表",
    "sub": "时间标本",
    "styles": {
     "V4PR": 3,
     "CYB3": 2,
     "DARK": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "d",
    "title": "一支写不出水的笔",
    "sub": "用完也不扔",
    "styles": {
     "GOTH": 3,
     "DARK": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   }
  ]
 },
 {
  "id": "q11",
  "topic": "暴雨",
  "text": "突然下暴雨，你没带伞？",
  "options": [
   {
    "key": "a",
    "title": "站在屋檐下等雨变小，顺便想点事",
    "sub": "顺势发呆",
    "styles": {
     "DARK": 3,
     "GOTH": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "rebel": 1
    }
   },
   {
    "key": "b",
    "title": "把外套当伞，走最像拍广告那条街",
    "sub": "造型不能乱",
    "styles": {
     "TRND": 3,
     "LOTA": 2,
     "JK": 1
    },
    "dims": {
     "aesthetic": 2,
     "social": 1
    }
   },
   {
    "key": "c",
    "title": "打开天气图，研究雨会下多久",
    "sub": "数据治焦虑",
    "styles": {
     "CYB3": 3,
     "DARK": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "rebel": 1
    }
   },
   {
    "key": "d",
    "title": "直接冲出去，到家再说",
    "sub": "全速·不在乎",
    "styles": {
     "BIKR": 3,
     "SK8R": 2,
     "STR8": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   }
  ]
 },
 {
  "id": "q12",
  "topic": "群聊 99+",
  "text": "群聊 99+，你的处理方式？",
  "options": [
   {
    "key": "a",
    "title": "直接静音，有事打电话",
    "sub": "省事主义",
    "styles": {
     "STR8": 3,
     "BIKR": 2,
     "DARK": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "b",
    "title": "翻到最上面，一条条补",
    "sub": "强迫症",
    "styles": {
     "SK8R": 3,
     "JK": 2,
     "CYB3": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "c",
    "title": "只回我想回的那条",
    "sub": "挑着来",
    "styles": {
     "PUNK": 3,
     "ROCK": 2,
     "DARK": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   },
   {
    "key": "d",
    "title": "把梗图存了，聊天不看",
    "sub": "素材优先",
    "styles": {
     "HHOP": 3,
     "DANC": 2,
     "TRND": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   }
  ]
 },
 {
  "id": "q13",
  "topic": "一个人的周末",
  "text": "一个人的周末，你最想要？",
  "options": [
   {
    "key": "a",
    "title": "有人一起跳一下午",
    "sub": "出汗即社交",
    "styles": {
     "DANC": 3,
     "HHOP": 2,
     "STR8": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "b",
    "title": "耳机戴一天，谁也别找我",
    "sub": "音量结界",
    "styles": {
     "ROCK": 3,
     "GOTH": 2,
     "DARK": 1
    },
    "dims": {
     "rebel": 2,
     "express": 1
    }
   },
   {
    "key": "c",
    "title": "把房间整理到能拍照",
    "sub": "完成感",
    "styles": {
     "JK": 3,
     "LOTA": 2,
     "TRND": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   },
   {
    "key": "d",
    "title": "做一件慢慢来的小事",
    "sub": "慢工",
    "styles": {
     "LOTA": 3,
     "V4PR": 2,
     "GOTH": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   }
  ]
 },
 {
  "id": "q14",
  "topic": "镜子",
  "text": "照镜子的时候，你其实在看？",
  "options": [
   {
    "key": "a",
    "title": "今天眼神里的那点疲惫",
    "sub": "状态检测",
    "styles": {
     "GOTH": 3,
     "DARK": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "b",
    "title": "这套搭配还差一件什么",
    "sub": "造型清单",
    "styles": {
     "V4PR": 3,
     "TRND": 2,
     "LOTA": 1
    },
    "dims": {
     "express": 2,
     "rebel": 1
    }
   },
   {
    "key": "c",
    "title": "哪里可以再藏一点",
    "sub": "收好破绽",
    "styles": {
     "DARK": 3,
     "GOTH": 2,
     "CYB3": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "d",
    "title": "像一个不太认识的自己",
    "sub": "抽离观察",
    "styles": {
     "CYB3": 3,
     "DARK": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "rebel": 1
    }
   }
  ]
 },
 {
  "id": "q15",
  "topic": "学新东西",
  "text": "学一样新东西，你会？",
  "options": [
   {
    "key": "a",
    "title": "先上路，边摔边学",
    "sub": "野路子",
    "styles": {
     "BIKR": 3,
     "SK8R": 2,
     "STR8": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "b",
    "title": "先配齐装备，仪式感拉满",
    "sub": "装备先行",
    "styles": {
     "TRND": 3,
     "LOTA": 2,
     "JK": 1
    },
    "dims": {
     "aesthetic": 2,
     "social": 1
    }
   },
   {
    "key": "c",
    "title": "找个会的人带我走一遍",
    "sub": "找搭子",
    "styles": {
     "STR8": 3,
     "DANC": 2,
     "HHOP": 1
    },
    "dims": {
     "social": 2,
     "rebel": 1
    }
   },
   {
    "key": "d",
    "title": "自己拆解，反复练同一个动作",
    "sub": "死磕",
    "styles": {
     "SK8R": 3,
     "PUNK": 2,
     "CYB3": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   }
  ]
 },
 {
  "id": "q16",
  "topic": "不合理的规定",
  "text": "遇到一条不合理的规定，你？",
  "options": [
   {
    "key": "a",
    "title": "当面问：凭什么",
    "sub": "直球质疑",
    "styles": {
     "PUNK": 3,
     "ROCK": 2,
     "STR8": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   },
   {
    "key": "b",
    "title": "把它写成段子讲出去",
    "sub": "梗攻击",
    "styles": {
     "HHOP": 3,
     "DANC": 2,
     "TRND": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "c",
    "title": "不吵，但我不执行",
    "sub": "沉默对抗",
    "styles": {
     "ROCK": 3,
     "GOTH": 2,
     "DARK": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "d",
    "title": "拉上大家一起想办法",
    "sub": "集体出行",
    "styles": {
     "DANC": 3,
     "JK": 2,
     "STR8": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   }
  ]
 },
 {
  "id": "q17",
  "topic": "打字习惯",
  "text": "你打字最常出现的符号是？",
  "options": [
   {
    "key": "a",
    "title": "感叹号，语气要热一点",
    "sub": "热情在线",
    "styles": {
     "JK": 3,
     "DANC": 2,
     "STR8": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   },
   {
    "key": "b",
    "title": "波浪号，把话说软",
    "sub": "温柔缓冲",
    "styles": {
     "LOTA": 3,
     "JK": 2,
     "GOTH": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   },
   {
    "key": "c",
    "title": "句号，一句一个",
    "sub": "冷处理",
    "styles": {
     "GOTH": 3,
     "DARK": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "d",
    "title": "空白，能不回就不回",
    "sub": "已读撤退",
    "styles": {
     "V4PR": 3,
     "DARK": 2,
     "CYB3": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   }
  ]
 },
 {
  "id": "q18",
  "topic": "发照片前",
  "text": "发照片之前，你会？",
  "options": [
   {
    "key": "a",
    "title": "调参数，把光压成想要的色",
    "sub": "精确修正",
    "styles": {
     "CYB3": 3,
     "DARK": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "rebel": 1
    }
   },
   {
    "key": "b",
    "title": "加一层暗的，别人看不清最好",
    "sub": "留一半",
    "styles": {
     "DARK": 3,
     "GOTH": 2,
     "CYB3": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "c",
    "title": "先想好文案，图是配角",
    "sub": "文案先行",
    "styles": {
     "TRND": 3,
     "LOTA": 2,
     "JK": 1
    },
    "dims": {
     "aesthetic": 2,
     "rebel": 1
    }
   },
   {
    "key": "d",
    "title": "不修，原图就是态度",
    "sub": "直出",
    "styles": {
     "BIKR": 3,
     "STR8": 2,
     "PUNK": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   }
  ]
 },
 {
  "id": "q19",
  "topic": "不喜欢的礼物",
  "text": "收到很贵、但你不喜欢的礼物，你会？",
  "options": [
   {
    "key": "a",
    "title": "直说：谢谢，但我用不上",
    "sub": "实话实说",
    "styles": {
     "STR8": 3,
     "PUNK": 2,
     "BIKR": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "b",
    "title": "收下，然后放进柜子深处",
    "sub": "礼貌收纳",
    "styles": {
     "SK8R": 3,
     "JK": 2,
     "CYB3": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "c",
    "title": "当场改造，改成能用的",
    "sub": "二次创作",
    "styles": {
     "PUNK": 3,
     "CYB3": 2,
     "LOTA": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   },
   {
    "key": "d",
    "title": "发条动态谢谢，礼物转给朋友",
    "sub": "转手快乐",
    "styles": {
     "DANC": 3,
     "HHOP": 2,
     "TRND": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   }
  ]
 },
 {
  "id": "q20",
  "topic": "深夜电台",
  "text": "深夜电台在问你：今天过得怎么样。",
  "options": [
   {
    "key": "a",
    "title": "还行，耳机救了我",
    "sub": "音量续命",
    "styles": {
     "ROCK": 3,
     "GOTH": 2,
     "DARK": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "b",
    "title": "起起落落，但挺好笑",
    "sub": "苦中作梗",
    "styles": {
     "HHOP": 3,
     "DANC": 2,
     "TRND": 1
    },
    "dims": {
     "social": 2,
     "express": 1
    }
   },
   {
    "key": "c",
    "title": "今天有点没做好，明天补上",
    "sub": "复盘选手",
    "styles": {
     "JK": 3,
     "STR8": 2,
     "LOTA": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   },
   {
    "key": "d",
    "title": "有一件小事很好看，记下来了",
    "sub": "小事收藏",
    "styles": {
     "LOTA": 3,
     "V4PR": 2,
     "GOTH": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   }
  ]
 },
 {
  "id": "q21",
  "topic": "十年后",
  "text": "十年后的你，可能在？",
  "options": [
   {
    "key": "a",
    "title": "一个很安静的地方，慢慢过日子",
    "sub": "慢时间",
    "styles": {
     "V4PR": 3,
     "DARK": 2,
     "LOTA": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "b",
    "title": "还在守着一件没人理解的事",
    "sub": "守望者",
    "styles": {
     "GOTH": 3,
     "DARK": 2,
     "PUNK": 1
    },
    "dims": {
     "express": 2,
     "rebel": 1
    }
   },
   {
    "key": "c",
    "title": "在没人认识我的城市重新开始",
    "sub": "重启",
    "styles": {
     "DARK": 3,
     "BIKR": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "d",
    "title": "在一个别人看不懂的工作里",
    "sub": "稀有工种",
    "styles": {
     "CYB3": 3,
     "TRND": 2,
     "JK": 1
    },
    "dims": {
     "express": 2,
     "rebel": 1
    }
   }
  ]
 },
 {
  "id": "q22",
  "topic": "搬家",
  "text": "搬家只能带一个箱子，你装？",
  "options": [
   {
    "key": "a",
    "title": "一双走烂的鞋",
    "sub": "路上用的",
    "styles": {
     "BIKR": 3,
     "SK8R": 2,
     "STR8": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "b",
    "title": "最能代表我的那件外套",
    "sub": "标志单品",
    "styles": {
     "TRND": 3,
     "LOTA": 2,
     "JK": 1
    },
    "dims": {
     "aesthetic": 2,
     "social": 1
    }
   },
   {
    "key": "c",
    "title": "朋友送的、奇怪但好用的东西",
    "sub": "有故事的",
    "styles": {
     "STR8": 3,
     "DANC": 2,
     "HHOP": 1
    },
    "dims": {
     "social": 2,
     "rebel": 1
    }
   },
   {
    "key": "d",
    "title": "工具和板，其他现场买",
    "sub": "实用至上",
    "styles": {
     "SK8R": 3,
     "PUNK": 2,
     "BIKR": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   }
  ]
 },
 {
  "id": "q23",
  "topic": "被夸特别",
  "text": "有人夸你「很特别」，你的反应？",
  "options": [
   {
    "key": "a",
    "title": "早知道，但谢谢",
    "sub": "坦然收下",
    "styles": {
     "PUNK": 3,
     "ROCK": 2,
     "TRND": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   },
   {
    "key": "b",
    "title": "太好了，那一起玩",
    "sub": "立刻邀请",
    "styles": {
     "DANC": 3,
     "HHOP": 2,
     "STR8": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "c",
    "title": "笑笑，不解释",
    "sub": "不接话",
    "styles": {
     "ROCK": 3,
     "GOTH": 2,
     "DARK": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "d",
    "title": "记下来，当个性签名",
    "sub": "梗进档案",
    "styles": {
     "HHOP": 3,
     "TRND": 2,
     "JK": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   }
  ]
 },
 {
  "id": "q24",
  "topic": "排队 40 人",
  "text": "前面还有 40 个人排队，你会？",
  "options": [
   {
    "key": "a",
    "title": "观察别人的穿搭打发时间",
    "sub": "视觉零食",
    "styles": {
     "LOTA": 3,
     "TRND": 2,
     "GOTH": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   },
   {
    "key": "b",
    "title": "算一遍还要等多久，精确到分",
    "sub": "时间管理",
    "styles": {
     "JK": 3,
     "STR8": 2,
     "CYB3": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   },
   {
    "key": "c",
    "title": "听歌放空，队伍自己会动",
    "sub": "时间失真",
    "styles": {
     "V4PR": 3,
     "DARK": 2,
     "GOTH": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "d",
    "title": "换一家，或者今天不买了",
    "sub": "不勉强",
    "styles": {
     "GOTH": 3,
     "DARK": 2,
     "PUNK": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   }
  ]
 },
 {
  "id": "q25",
  "topic": "被误解",
  "text": "被人误解的时候，你更想？",
  "options": [
   {
    "key": "a",
    "title": "把逻辑捋清楚再开口",
    "sub": "讲证据",
    "styles": {
     "CYB3": 3,
     "GOTH": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "rebel": 1
    }
   },
   {
    "key": "b",
    "title": "让他继续误会，省事",
    "sub": "不解释",
    "styles": {
     "DARK": 3,
     "GOTH": 2,
     "PUNK": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "c",
    "title": "一句话噎住他，然后走",
    "sub": "精准反击",
    "styles": {
     "TRND": 3,
     "PUNK": 2,
     "HHOP": 1
    },
    "dims": {
     "aesthetic": 2,
     "rebel": 1
    }
   },
   {
    "key": "d",
    "title": "骑车出去转一圈，回来就没事",
    "sub": "物理消解",
    "styles": {
     "BIKR": 3,
     "SK8R": 2,
     "DANC": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   }
  ]
 },
 {
  "id": "q26",
  "topic": "深夜吃什么",
  "text": "深夜想吃东西，你选？",
  "options": [
   {
    "key": "a",
    "title": "楼下那家开了十年的店",
    "sub": "熟客",
    "styles": {
     "STR8": 3,
     "BIKR": 2,
     "JK": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "b",
    "title": "冰箱里剩什么做什么",
    "sub": "就地取材",
    "styles": {
     "SK8R": 3,
     "DARK": 2,
     "CYB3": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "c",
    "title": "自己做，黑暗但好吃",
    "sub": "实验料理",
    "styles": {
     "PUNK": 3,
     "LOTA": 2,
     "GOTH": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   },
   {
    "key": "d",
    "title": "不吃，再听两首歌就睡",
    "sub": "延迟满足",
    "styles": {
     "ROCK": 3,
     "GOTH": 2,
     "DARK": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   }
  ]
 },
 {
  "id": "q27",
  "topic": "第一次见",
  "text": "认识新朋友，你最先注意的是？",
  "options": [
   {
    "key": "a",
    "title": "他玩起来带不带劲",
    "sub": "能量对不对",
    "styles": {
     "DANC": 3,
     "HHOP": 2,
     "STR8": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "b",
    "title": "他说话有没有梗",
    "sub": "语言合拍",
    "styles": {
     "HHOP": 3,
     "TRND": 2,
     "ROCK": 1
    },
    "dims": {
     "social": 2,
     "express": 1
    }
   },
   {
    "key": "c",
    "title": "他有没有注意到我的细节",
    "sub": "细节雷达",
    "styles": {
     "LOTA": 3,
     "JK": 2,
     "GOTH": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   },
   {
    "key": "d",
    "title": "他和别人相处的方式",
    "sub": "观察员",
    "styles": {
     "JK": 3,
     "V4PR": 2,
     "CYB3": 1
    },
    "dims": {
     "aesthetic": 2,
     "express": 1
    }
   }
  ]
 },
 {
  "id": "q28",
  "topic": "城市很吵",
  "text": "城市很吵的时候，你？",
  "options": [
   {
    "key": "a",
    "title": "戴上耳机，放更安静的东西",
    "sub": "以静制噪",
    "styles": {
     "GOTH": 3,
     "DARK": 2,
     "LOTA": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "b",
    "title": "把它当采样，听出一种氛围",
    "sub": "白噪美学",
    "styles": {
     "V4PR": 3,
     "CYB3": 2,
     "DARK": 1
    },
    "dims": {
     "express": 2,
     "rebel": 1
    }
   },
   {
    "key": "c",
    "title": "降噪开到最大，世界只剩我",
    "sub": "一键清场",
    "styles": {
     "CYB3": 3,
     "DARK": 2,
     "V4PR": 1
    },
    "dims": {
     "express": 2,
     "social": 1
    }
   },
   {
    "key": "d",
    "title": "习惯了，我本来就是背景的一部分",
    "sub": "融入噪音",
    "styles": {
     "DARK": 3,
     "GOTH": 2,
     "STR8": 1
    },
    "dims": {
     "express": 2,
     "rebel": 1
    }
   }
  ]
 },
 {
  "id": "q29",
  "topic": "坚持最久",
  "text": "你坚持最久的一件事是？",
  "options": [
   {
    "key": "a",
    "title": "每天出门走一段路",
    "sub": "里程习惯",
    "styles": {
     "BIKR": 3,
     "SK8R": 2,
     "STR8": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "b",
    "title": "保持自己的样子",
    "sub": "造型自律",
    "styles": {
     "TRND": 3,
     "LOTA": 2,
     "JK": 1
    },
    "dims": {
     "aesthetic": 2,
     "social": 1
    }
   },
   {
    "key": "c",
    "title": "和同一群朋友一直在一起",
    "sub": "关系长期",
    "styles": {
     "STR8": 3,
     "DANC": 2,
     "HHOP": 1
    },
    "dims": {
     "social": 2,
     "rebel": 1
    }
   },
   {
    "key": "d",
    "title": "练一个别人觉得没用的动作",
    "sub": "无用之用",
    "styles": {
     "SK8R": 3,
     "PUNK": 2,
     "CYB3": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   }
  ]
 },
 {
  "id": "q30",
  "topic": "留给未来",
  "text": "最后一题：留给未来的自己一句话？",
  "options": [
   {
    "key": "a",
    "title": "别变成你讨厌的那种人",
    "sub": "底线",
    "styles": {
     "PUNK": 3,
     "GOTH": 2,
     "DARK": 1
    },
    "dims": {
     "rebel": 2,
     "social": 1
    }
   },
   {
    "key": "b",
    "title": "音量别调小",
    "sub": "保持热度",
    "styles": {
     "ROCK": 3,
     "HHOP": 2,
     "DANC": 1
    },
    "dims": {
     "rebel": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "c",
    "title": "记得玩，别只记得赢",
    "sub": "快乐优先",
    "styles": {
     "DANC": 3,
     "HHOP": 2,
     "STR8": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   },
   {
    "key": "d",
    "title": "就算没人看，也要好玩",
    "sub": "自娱自乐",
    "styles": {
     "HHOP": 3,
     "TRND": 2,
     "PUNK": 1
    },
    "dims": {
     "social": 2,
     "aesthetic": 1
    }
   }
  ]
 }
];
module.exports = { meta: meta, bank: bank };
