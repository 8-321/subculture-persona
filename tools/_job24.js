module.exports = [
  {
    file: 'miniprogram/pages/post-publish/post-publish.wxml',
    old: `  <view class="snd">声音（可选）</view>
  <view class="srow">
    <image class="bic" src="/images/ic/music-ink.png" mode="aspectFit" />
    <view class="stx">
      <view class="tt">配乐 · {{music}}</view>
      <view class="ss">暗潮合辑 · 帖子配乐可选</view>
    </view>
    <view class="chg" bindtap="onChangeMusic">更换
      <image src="/images/ic/fwd-{{dark ? 'white' : 'ink'}}.png" mode="aspectFit" />
    </view>
  </view>
  <view class="phead">`,
    new: `  <view class="phead">`
  },
  {
    file: 'miniprogram/pages/post-publish/post-publish.wxml',
    old: `  <view class="note">投稿内测：先存本地草稿，再复制给编辑部审核。</view>`,
    new: `  <view class="note">当前版本只存本地草稿，不会自动上传，也没有在线审核后台。</view>`
  },
  {
    file: 'miniprogram/pages/post-publish/post-publish.js',
    old: `    music: '暗潮合辑',`,
    new: `    music: '',`
  },
  {
    file: 'miniprogram/pages/post-publish/post-publish.js',
    old: `      music: d.music || '暗潮合辑',`,
    new: `      music: d.music || '',`
  },
  {
    file: 'miniprogram/pages/post-publish/post-publish.js',
    old: `  onChangeMusic() {
    const self = this;
    wx.showActionSheet({
      itemList: ['暗潮合辑', '缎带与旧钢琴', '凌晨两点的商场', '不使用配乐'],
      success: (res) => {
        const list = ['暗潮合辑', '缎带与旧钢琴', '凌晨两点的商场', '不使用配乐'];
        self.setData({ music: list[res.tapIndex] });
      }
    });
  },

  onToggleRead() { this.setData({ readOn: !this.data.readOn }); },`,
    new: `  onToggleRead() { this.setData({ readOn: !this.data.readOn }); },`
  },
  {
    file: 'miniprogram/pages/post-publish/post-publish.js',
    old: `    // 不假装有审核后台：完整存草稿，再把投稿文本交给用户自己发出去`,
    new: `    // 不假装有审核后台：完整存本地草稿，投稿文本由用户自己决定发不发`
  },
  {
    file: 'miniprogram/pages/post-publish/post-publish.js',
    old: `      content: '发布通道还在内测。可复制投稿内容发给编辑部，审核通过后由编辑部发布。',`,
    new: `      content: '发布通道还没开放。可复制内容发给「第二文化」的运营者，由人工确认后发布。',`
  },
  {
    file: 'miniprogram/pages/merchant-apply/merchant-apply.wxml',
    old: `  <view class="hsub">先登记资料，编辑部人工联系。当前版本没有在线审核后台，也不会自动开通发布权限。</view>`,
    new: `  <view class="hsub">先登记资料，由运营者人工联系。当前版本没有在线审核后台，也不会自动开通发布权限。</view>`
  },
  {
    file: 'miniprogram/pages/merchant-apply/merchant-apply.wxml',
    old: `  <view class="note">资料只保存在本机，不会自动上传。保存后可复制发给编辑部，进入人工招募名单。</view>`,
    new: `  <view class="note">资料只保存在本机，不会自动上传。复制后发给运营者，才会进入人工招募名单。</view>`
  },
  {
    file: 'miniprogram/pages/merchant-apply/merchant-apply.js',
    old: `      content: '当前没有在线审核后台。可复制这份资料发给编辑部，进入人工招募名单；不会自动通过。',`,
    new: `      content: '当前没有在线审核后台。可复制这份资料发给运营者，进入人工招募名单；不会自动通过。',`
  }
];