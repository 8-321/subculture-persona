module.exports = [
  { file: 'miniprogram/pages/register/register.wxss', old: `.sub { font-size: 23rpx; line-height: 1.72; color: var(--text-2); margin-top: 18rpx; }`, new: `.sub { font-size: 23rpx; line-height: 1.72; color: var(--text-2); margin-top: 18rpx; }
.form { border-radius: 32rpx; }` },
  { file: 'miniprogram/pages/register/register.wxss', old: `.form { margin: 34rpx 40rpx 0; padding: 26rpx 26rpx 20rpx; background: var(--card); border: 1rpx solid var(--line); }`, new: `.form { margin: 34rpx 40rpx 0; padding: 26rpx 26rpx 20rpx; background: var(--card); border: 1rpx solid var(--line); border-radius: 32rpx; }` },
  { file: 'miniprogram/pages/register/register.wxss', old: `.input { height: 74rpx; font-size: 32rpx; font-weight: 700; color: var(--text); }`, new: `.input { width: 100%; height: 74rpx; font-size: 32rpx; font-weight: 700; color: var(--text); }` },
  { file: 'miniprogram/pages/register/register.wxss', old: `.cta { margin: 36rpx 40rpx 0; height: 100rpx; background: var(--ink); color: var(--on-ink);`, new: `.cta { margin: 36rpx 40rpx 0; height: 100rpx; border-radius: 999rpx; background: var(--ink); color: var(--on-ink);` },
  { file: 'miniprogram/pages/register/register.wxml', old: `    <view class="sub">昵称和头像只存在这台手机。换设备不会同步，也不会上传到服务器。</view>`, new: `    <view class="sub">昵称和头像只存在这台手机，换设备不同步，也不上传服务器。</view>` },

  { file: 'miniprogram/pages/merchant-apply/merchant-apply.wxss', old: `.hero { padding: 0 40rpx; margin-top: 40rpx; font-size: 52rpx; font-weight: 800; line-height: 1.24;
  letter-spacing: .4rpx; white-space: pre-wrap; color: var(--text); }`, new: `.hero { padding: 0 40rpx; margin-top: 40rpx; font-size: 52rpx; font-weight: 800; line-height: 1.24;
  letter-spacing: .4rpx; color: var(--text); }` },
  { file: 'miniprogram/pages/merchant-apply/merchant-apply.wxss', old: `.fld { margin: 16rpx 40rpx 0; height: 96rpx; padding: 0 28rpx; border-radius: 28rpx;
  background: var(--card); box-shadow: var(--shadow-card); font-size: 27rpx; color: var(--text); }`, new: `.fld { margin: 16rpx 40rpx 0; width: 670rpx; box-sizing: border-box; height: 96rpx; padding: 0 28rpx; border-radius: 28rpx;
  background: var(--card); box-shadow: var(--shadow-card); font-size: 27rpx; color: var(--text); }` },
  { file: 'miniprogram/pages/merchant-apply/merchant-apply.wxss', old: `.cp { height: 64rpx; padding: 0 26rpx; border-radius: 999rpx; background: var(--card);
  border: 1rpx solid var(--line); font-size: 24rpx; font-weight: 700; color: var(--text-2);
  display: flex; align-items: center; }`, new: `.cp { width: calc((670rpx - 32rpx) / 3); height: 64rpx; padding: 0; border-radius: 999rpx; background: var(--card);
  border: 1rpx solid var(--line); font-size: 24rpx; font-weight: 700; color: var(--text-2);
  display: flex; align-items: center; justify-content: center; box-sizing: border-box; }` },
  { file: 'miniprogram/pages/merchant-apply/merchant-apply.wxss', old: `.tip { padding: 0 40rpx; margin-top: 10rpx; font-size: 21rpx; line-height: 1.5; color: var(--text-3); }`, new: `.tip { padding: 0 40rpx; margin-top: 10rpx; font-size: 21rpx; line-height: 1.5; color: var(--text-3); }
.note { text-wrap: balance; }` },
  { file: 'miniprogram/pages/merchant-apply/merchant-apply.wxml', old: `    <view class="tip" wx:else>按国家标准校验位检查，抄错一位会当场提示；提交后由人工核对执照照片。</view>`, new: `    <view class="tip" wx:else>按国家标准校验位检查，抄错一位会当场提示；提交后人工核对执照照片。</view>` },
  { file: 'miniprogram/pages/merchant-apply/merchant-apply.wxml', old: `  <view class="note">资料只保存在本机，不会自动上传。保存后可复制发给编辑部，进入人工招募名单；没有在线审核，也不会自动通过。</view>`, new: `  <view class="note">资料只保存在本机，不会自动上传。保存后可复制发给编辑部，进入人工招募名单。</view>` },

  { file: 'miniprogram/pages/type/type.wxss', old: `.btn { flex: 1; height: 96rpx; background: var(--ink); color: var(--on-ink); font-size: 29rpx;
  font-weight: 800; letter-spacing: 1rpx; display: flex; align-items: center; justify-content: center; }`, new: `.btn { flex: 1; height: 96rpx; border-radius: 999rpx; background: var(--ink); color: var(--on-ink); font-size: 29rpx;
  font-weight: 800; letter-spacing: 1rpx; display: flex; align-items: center; justify-content: center; }` },
  { file: 'miniprogram/pages/type/type.wxss', old: `.sbtn { width: 96rpx; height: 96rpx; flex: 0 0 96rpx; padding: 0; margin: 0; background: transparent;
  border: 1rpx solid var(--line-2); display: flex; align-items: center; justify-content: center; }`, new: `.sbtn { width: 96rpx; height: 96rpx; flex: 0 0 96rpx; padding: 0; margin: 0; background: transparent;
  border: 1rpx solid var(--line-2); border-radius: 50%; display: flex; align-items: center; justify-content: center; }` },
  { file: 'miniprogram/pages/type/type.wxss', old: `.note { margin: 28rpx 40rpx 0; padding: 26rpx 30rpx; background: var(--ink); color: var(--on-ink); }`, new: `.note { margin: 28rpx 40rpx 0; padding: 26rpx 30rpx; border-radius: 32rpx; background: var(--ink); color: var(--on-ink); }` },

  { file: 'miniprogram/pages/shop-home/shop-home.wxss', old: `.h-t { font-size: 20rpx; color: rgba(255,255,255,.82); border: 1rpx solid rgba(255,255,255,.38); padding: 6rpx 12rpx; }`, new: `.h-t { font-size: 20rpx; color: rgba(255,255,255,.82); border: 1rpx solid rgba(255,255,255,.38); border-radius: 999rpx; padding: 6rpx 16rpx; }` },
  { file: 'miniprogram/pages/shop-home/shop-home.wxss', old: `.idcard { display: flex; align-items: center; gap: 20rpx; margin: 26rpx 40rpx 0; padding: 26rpx 28rpx;
  background: var(--card); border: 1rpx solid var(--line); }`, new: `.idcard { display: flex; align-items: center; gap: 20rpx; margin: 26rpx 40rpx 0; padding: 26rpx 28rpx;
  background: var(--card); border: 1rpx solid var(--line); border-radius: 32rpx; box-shadow: var(--shadow-card); }` },
  { file: 'miniprogram/pages/shop-home/shop-home.wxss', old: `.fo { flex: 0 0 auto; min-width: 136rpx; height: 72rpx; padding: 0 24rpx; display: flex; align-items: center;
  justify-content: center; background: var(--ink); color: var(--on-ink); font-size: 23rpx; font-weight: 800;
  white-space: nowrap; }`, new: `.fo { flex: 0 0 auto; min-width: 136rpx; height: 72rpx; padding: 0 26rpx; display: flex; align-items: center;
  justify-content: center; background: var(--ink); color: var(--on-ink); font-size: 23rpx; font-weight: 800;
  border-radius: 999rpx; white-space: nowrap; }` },
  { file: 'miniprogram/pages/shop-home/shop-home.wxss', old: `.pd-im { position: relative; height: 360rpx; overflow: hidden; background: var(--card-2); border-radius: 16rpx; }`, new: `.pd-im { position: relative; height: 360rpx; overflow: hidden; background: var(--card-2); border-radius: 24rpx; }` },
  { file: 'miniprogram/pages/shop-home/shop-home.wxml', old: `      <view class="id-s">本页只做店铺与选物展示，不提供下单、支付或售后。</view>`, new: `      <view class="id-s">只做店铺与选物展示，不提供下单、支付或售后。</view>` },

  { file: 'miniprogram/pages/followed-shops/followed-shops.wxss', old: `.empty .eb { display: inline-flex; align-items: center; justify-content: center; min-width: 220rpx; height: 80rpx;
  margin-top: 28rpx; padding: 0 30rpx; background: var(--ink); color: var(--on-ink); font-size: 24rpx; font-weight: 800; }`, new: `.empty .eb { display: inline-flex; align-items: center; justify-content: center; min-width: 220rpx; height: 80rpx;
  margin-top: 28rpx; padding: 0 30rpx; border-radius: 999rpx; background: var(--ink); color: var(--on-ink); font-size: 24rpx; font-weight: 800; }` },
  { file: 'miniprogram/pages/followed-shops/followed-shops.wxml', old: `  <view class="hint">共 {{list.length}} 家 · 在帖子页点「关注」即可添加</view>`, new: `  <view wx:if="{{list.length > 0}}" class="hint">共 {{list.length}} 家 · 点右侧「取消关注」可移出</view>` },

  { file: 'miniprogram/pages/drafts/drafts.wxss', old: `.e-b { display: inline-flex; margin-top: 40rpx; padding: 22rpx 44rpx; background: var(--ink); color: var(--on-ink); font-size: 25rpx; font-weight: 700; }`, new: `.e-b { display: inline-flex; margin-top: 40rpx; padding: 22rpx 44rpx; border-radius: 999rpx; background: var(--ink); color: var(--on-ink); font-size: 25rpx; font-weight: 700; }` },
  { file: 'miniprogram/pages/cooperation/cooperation.wxss', old: `.c-btn { flex: 1; height: 86rpx; display: flex; align-items: center; justify-content: center;
  background: var(--ink); color: var(--on-ink); font-size: 24rpx; font-weight: 700; padding: 0; margin: 0; line-height: 1; }`, new: `.c-btn { flex: 1; height: 86rpx; display: flex; align-items: center; justify-content: center; border-radius: 999rpx;
  background: var(--ink); color: var(--on-ink); font-size: 24rpx; font-weight: 700; padding: 0; margin: 0; line-height: 1; }` }
];
