module.exports = [
  {
    file: 'miniprogram/utils/site.js',
    old: `  mail: 'hello@secondculture.cn',
  mailIsPlaceholder: true,`,
    new: `  mail: '',
  mailIsPlaceholder: true,`
  },
  {
    file: 'miniprogram/pages/settings/settings.js',
    old: `  onFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '把想说的话发到 ' + Site.mail + '，或在小程序里打开客服会话。我们会逐条看。',
      showCancel: false
    });
  },`,
    new: `  onFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '点右上角「···」，选「反馈与投诉」，会直接提交给微信平台；也可以在小程序资料页查看运营者信息。',
      showCancel: false
    });
  },`
  },
  {
    file: 'miniprogram/pages/cooperation/cooperation.js',
    old: `  data: {
    mail: MAIL,`,
    new: `  data: {
    mail: MAIL,
    hasMail: !!MAIL,`
  },
  {
    file: 'miniprogram/pages/cooperation/cooperation.js',
    old: `  onCopyMail() {
    Privacy.ensure(() => {`,
    new: `  onCopyMail() {
    if (!MAIL) { UI.toast('联系邮箱上线前公布'); return; }
    Privacy.ensure(() => {`
  },
  {
    file: 'miniprogram/pages/cooperation/cooperation.wxml',
    old: `    <view class="c-t">把品牌、场地或店铺的情况发给我们，48 小时内回。</view>
    <view class="c-mail" bindtap="onCopyMail">{{mail}}</view>
    <view class="c-ops">
      <view class="c-btn" bindtap="onCopyKit" hover-class="press">复制咨询模板</view>
      <button class="c-btn ghost" open-type="contact" hover-class="press">打开客服会话</button>
    </view>
    <view class="c-fine">客服会话需要在小程序后台配置后生效；也可以直接复制邮箱发信。</view>`,
    new: `    <view class="c-t">先把品牌、场地或店铺的情况整理成一段话，再决定用哪种方式发给我们。</view>
    <view wx:if="{{hasMail}}" class="c-mail" bindtap="onCopyMail">{{mail}}</view>
    <view wx:else class="c-mail off">联系邮箱上线前公布</view>
    <view class="c-ops">
      <view class="c-btn" bindtap="onCopyKit" hover-class="press">复制咨询模板</view>
      <button class="c-btn ghost" open-type="contact" hover-class="press">打开客服会话</button>
    </view>
    <view class="c-fine">客服会话需要在小程序后台配置后生效；邮箱也会在上线前补上。</view>`
  },
  {
    file: 'miniprogram/pages/cooperation/cooperation.wxss',
    old: `.c-mail { font-size: 30rpx; font-weight: 800; margin-top: 18rpx; text-decoration: underline; }`,
    new: `.c-mail { font-size: 30rpx; font-weight: 800; margin-top: 18rpx; text-decoration: underline; }
.c-mail.off { font-size: 24rpx; font-weight: 700; color: var(--text-3); text-decoration: none; }`
  },
  {
    file: 'miniprogram/pages/legal/legal.wxml',
    old: `      <view class="ct-mail" bindtap="onCopyEmail">{{contact}}</view>`,
    new: `      <view wx:if="{{contact}}" class="ct-mail" bindtap="onCopyEmail">{{contact}}</view>
      <view wx:else class="ct-mail off">邮箱上线前公布</view>`
  },
  {
    file: 'miniprogram/pages/legal/legal.wxss',
    old: `.ct-mail { font-size: 26rpx; font-weight: 700; margin-top: 8rpx; text-decoration: underline; }`,
    new: `.ct-mail { font-size: 26rpx; font-weight: 700; margin-top: 8rpx; text-decoration: underline; }
.ct-mail.off { font-size: 22rpx; color: var(--text-3); text-decoration: none; }`
  }
];