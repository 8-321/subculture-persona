module.exports = [
  { file: '04-测试体系/题库_爆款版.json', old: `"text": "刷到四张图，你的眼睛先停在哪一张？",`, new: `"text": "刷到四张图的时候，你的眼睛会先停在哪一张？",` },
  { file: '04-测试体系/题库_爆款版.csv', old: `刷到四张图，你的眼睛先停在哪一张？`, new: `刷到四张图的时候，你的眼睛会先停在哪一张？`, once: false },
  { file: 'miniprogram/data/bank.js', old: `"text": "刷到四张图，你的眼睛先停在哪一张？",`, new: `"text": "刷到四张图的时候，你的眼睛会先停在哪一张？",` },

  { file: 'miniprogram/pages/post-detail/post-detail.wxml', old: `    <view class="sh-s">举报只存在这台手机上，用来先隐藏内容；编辑部后台接入后才会真正受理。</view>`, new: `    <view class="sh-s">举报只存在这台手机，用于先隐藏内容；后台接入后才真正受理。</view>` },
  { file: 'miniprogram/pages/merchant-apply/merchant-apply.wxml', old: `    <view class="tip" wx:else>按国家标准校验位检查，抄错一位会当场提示；提交后人工核对执照照片。</view>`, new: `    <view class="tip" wx:else>按国家标准校验位检查，抄错一位会当场提示。</view>` },
  { file: 'miniprogram/pages/my-report/my-report.js', old: `    note: '记录只保存在这台手机，用于回看与撤销；编辑部后台接入后才会真正受理。',`, new: `    note: '记录只存在这台手机，用于回看与撤销；后台接入后才受理。',` },

  { file: 'miniprogram/pages/legal/legal.wxml', old: `如果你主动设置昵称和头像，它们也只保存在本机，不会上传。`, new: `昵称和头像只保存在本机，不会上传。` },
  { file: 'miniprogram/pages/legal/legal.wxml', old: `需要长期保留的报告，请在报告页生成人格名片并保存到相册。`, new: `想长期保留，可在报告页生成名片并保存到相册。` },
  { file: 'miniprogram/pages/legal/legal.wxml', old: `相册与剪贴板都属于微信隐私接口，调用前会先弹出平台隐私授权说明。`, new: `相册与剪贴板属于微信隐私接口，调用前会先弹授权说明。` },
  { file: 'miniprogram/pages/legal/legal.wxml', old: `撤回授权：微信－设置－隐私－授权管理，可随时关闭相册等权限。`, new: `撤回授权：微信－设置－隐私－授权管理。` }
];
