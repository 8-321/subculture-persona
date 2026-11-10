module.exports = [
  { file: 'miniprogram/pages/reports/reports.js', old: `      const sec = r.seconds || 0;
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return Object.assign({}, r, {
        img: TM.img(r.type),
        timeText: m + ' 分 ' + (s < 10 ? '0' + s : s) + ' 秒',
        dateText: r.dateText || UI.relTime(r.ts || r.createdAt)
      });`, new: `      const sec = r.seconds || 0;
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return Object.assign({}, r, {
        img: TM.img(r.type),
        footText: (r.qcount || 0) + ' 题' + (sec > 0 ? ' · 用时 ' + m + ' 分 ' + (s < 10 ? '0' + s : s) + ' 秒' : ''),
        dateText: r.dateText || UI.relTime(r.ts || r.createdAt)
      });` },
  { file: 'miniprogram/pages/reports/reports.wxml', old: `      <text>{{item.qcount}} 题 · 用时 {{item.timeText}}</text>`, new: `      <text>{{item.footText}}</text>` },

  { file: 'miniprogram/pages/history/history.wxml', old: `            <text class="src">{{it.src}}</text>{{it.timeText}}`, new: `            <text wx:if="{{it.src}}" class="src">{{it.src}}</text>{{it.timeText}}` },

  { file: 'miniprogram/pages/post-detail/post-detail.wxml', old: `    <view class="bar" bindtap="onMusic">
      <image class="bic" src="{{playing ? '/images/ic/music-ink.png' : '/images/ic/music-ink.png'}}" mode="aspectFit" />
      <view class="btx">
        <view class="bt">{{item.music.title}}</view>
        <view class="bs">{{playing ? '正在播放配乐' : '帖子配乐'}}</view>
      </view>
      <image class="bpl" src="/images/ic/{{playing ? 'close' : 'play'}}-{{dark ? 'white' : 'ink'}}.png" mode="aspectFit" />
    </view>

    <view class="bar" bindtap="onRead">
      <image class="bic" src="/images/ic/voice-ink.png" mode="aspectFit" />
      <view class="btx">
        <view class="bt">{{item.read.title}}</view>
        <view class="bs">{{reading ? '正在朗读' : item.read.sub}}</view>
      </view>
      <image class="bpl" src="/images/ic/{{reading ? 'close' : 'play'}}-{{dark ? 'white' : 'ink'}}.png" mode="aspectFit" />
    </view>`, new: `    <view class="bar" bindtap="onMusic">
      <image class="bic" src="/images/ic/music-ink.png" mode="aspectFit" />
      <view class="btx">
        <view class="bt">{{item.music.title}}</view>
        <view class="bs">{{item.music.sub}} · 暂不播放</view>
      </view>
      <text class="bdemo">示例</text>
    </view>

    <view class="bar" bindtap="onRead">
      <image class="bic" src="/images/ic/voice-ink.png" mode="aspectFit" />
      <view class="btx">
        <view class="bt">{{item.read.title}}</view>
        <view class="bs">{{item.read.sub}} · 接入后开放</view>
      </view>
      <text class="bdemo">未开放</text>
    </view>` },
  { file: 'miniprogram/pages/post-detail/post-detail.wxss', old: `.bpl { width: 32rpx; height: 32rpx; flex: 0 0 32rpx; }`, new: `.bpl { width: 32rpx; height: 32rpx; flex: 0 0 32rpx; }
.bdemo { flex: 0 0 auto; padding: 6rpx 16rpx; border-radius: 999rpx; background: var(--line); color: var(--text-3);
  font-size: 18rpx; font-weight: 700; white-space: nowrap; }` },
  { file: 'miniprogram/pages/post-detail/post-detail.wxml', old: `    <view class="sh-s">提交后会进入人工复核，24 小时内处理。同一条被多人反馈会先隐藏。</view>`, new: `    <view class="sh-s">举报只存在这台手机上，用来先隐藏内容；编辑部后台接入后才会真正受理。</view>` },
  { file: 'miniprogram/pages/post-detail/post-detail.js', old: `  onMusic() {
    this.setData({ playing: !this.data.playing });
    UI.toast(this.data.playing ? '配乐已开启' : '配乐已关闭');
  },

  onRead() {
    this.setData({ reading: !this.data.reading });
    UI.toast(this.data.reading ? '开始朗读' : '已停止');
  },`, new: `  onMusic() {
    UI.toast('示例配乐：接入音频后开放');
  },

  onRead() {
    UI.toast('朗读将在接入语音服务后开放');
  },` },
  { file: 'miniprogram/pages/post-detail/post-detail.js', old: `    if (Store.Report.isHidden(it.id)) {
      UI.toast('已收到，该内容将隐藏待复核');
      setTimeout(() => { UI.back(); }, 900);
    } else {
      UI.toast('已收到（第 ' + times + ' 次反馈），24 小时内处理');
    }`, new: `    if (Store.Report.isHidden(it.id)) {
      UI.toast('已在本机隐藏这条内容');
      setTimeout(() => { UI.back(); }, 900);
    } else {
      UI.toast('已记录（第 ' + times + ' 次），满 3 次在本机隐藏');
    }` },

  { file: 'miniprogram/pages/post-publish/post-publish.wxml', old: `  <view class="note">当前为投稿内测：先存本地草稿，再复制给编辑部；通过后由编辑部发布。</view>`, new: `  <view class="note">投稿内测：先存本地草稿，再复制给编辑部审核。</view>` },

  { file: 'miniprogram/pages/settings/settings.wxml', old: `      <view class="t2">跳转、收藏、筛选各有一种声音；静音键拨到静音时自动不发声</view>`, new: `      <view class="t2">跳转、收藏、筛选各有提示音；静音时自动关闭</view>` },

  { file: 'miniprogram/pages/my-report/my-report.js', old: `    note: '这里只是这台手机上的记录，用于你自己回看与撤销；正式受理以后台为准。',`, new: `    note: '记录只保存在这台手机，用于回看与撤销；编辑部后台接入后才会真正受理。',` },
  { file: 'miniprogram/pages/my-report/my-report.js', old: `      statusText: g.hidden ? '已隐藏待复核' : '已记录，等待复核',`, new: `      statusText: g.hidden ? '本机已隐藏' : '本机已记录',` }
];
